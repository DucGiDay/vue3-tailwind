import { ref } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import { useToast } from 'primevue/usetoast';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { formatDate } from '@/common/utils/common';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { INPUT_INVOICE_PRODUCT_COLUMNS } from '@/common/constant/e-invoice-column.constant';

export function useInputInvoiceProductExport() {
  const invoiceStore = useEInoiveStore();
  const filterStore = useFilterStore();
  const globalStore = useGlobalStore();
  const toast = useToast();

  const isLoadingExport = ref(false);

  const executeExport = async (filters) => {
    if (isLoadingExport.value) return;

    try {
      isLoadingExport.value = true;

      const basePayload = {
        company_tax_code: invoiceStore?.currentTaxCode,
        brand_uid: globalStore?.brandUid,
        company_uid: globalStore?.currentUser?.company_uid,
        list_store_uid: invoiceStore.listStoreUidInCurrentTaxCode.join(','),
        start_date: filterStore?.invoice?.start_date,
        end_date: filterStore?.invoice?.end_date,
      };

      if (filters.searchField) basePayload.search = filters.searchField;
      if (filters.filterStatus) basePayload.invoice_status = filters.filterStatus;
      if (filters.filterPattern) basePayload.pattern = filters.filterPattern;
      if (filters.filterSerial) basePayload.serial = filters.filterSerial;
      if (filters.filterNo) basePayload.no = filters.filterNo;

      const exportPageSize = 100;

      // Tải trang 1 để lấy tổng số bản ghi
      const firstPageRes = await invoiceService.getInputInvoiceProducts({
        ...basePayload,
        page: 1,
        page_size: exportPageSize,
      });

      const totalRecords = firstPageRes?.total || 0;
      if (totalRecords === 0) {
        toast.add({
          severity: 'warn',
          summary: 'Thông báo',
          detail: 'Không có dữ liệu để xuất excel',
          life: 5000,
        });
        return;
      }

      const allData = [...(firstPageRes?.data || [])];
      const totalPages = Math.ceil(totalRecords / exportPageSize);

      // Tải các trang tiếp theo với delay 200ms mỗi trang
      for (let page = 2; page <= totalPages; page++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const pageRes = await invoiceService.getInputInvoiceProducts({
          ...basePayload,
          page,
          page_size: exportPageSize,
        });
        if (pageRes?.data) {
          allData.push(...pageRes.data);
        }
      }

      // Tạo file Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách sản phẩm');

      const columnsToExport = INPUT_INVOICE_PRODUCT_COLUMNS;

      // Thêm hàng tiêu đề
      const headerRow = worksheet.addRow(columnsToExport.map((col) => col.header));

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0560A6' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      let currentInvoiceNo = null;
      let displayIndex = 1;
      const mergeQueue = [];
      let currentGroupStartRow = -1;

      // Thêm các hàng dữ liệu
      allData.forEach((item, index) => {
        const rowNum = index + 2; // header is row 1
        let stt = '';

        if (item.invoice_no !== currentInvoiceNo) {
          if (currentGroupStartRow !== -1 && rowNum - 1 > currentGroupStartRow) {
            mergeQueue.push({ start: currentGroupStartRow, end: rowNum - 1 });
          }
          currentInvoiceNo = item.invoice_no;
          currentGroupStartRow = rowNum;
          stt = displayIndex++;
        }

        const rowData = columnsToExport.map((col) => {
          if (col.field === 'no') return stt;
          if (col.field === 'pattern_serial') {
            return `${item.pattern || ''} - ${item.serial || ''}`;
          }
          if (col.field === 'invoice_date') {
            return item.invoice_date ? formatDate(item.invoice_date) : '';
          }
          return item[col.field] ?? '';
        });

        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          cell.border = {
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
            top: { style: 'thin' }, // Add top border just in case for merged cells
          };
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

          const colIndex = colNumber - 1; // 0-based for array mapping
          const col = columnsToExport[colIndex];

          if (col.format === 'currency') {
            cell.numFmt = '#,##0';
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
            if (typeof cell.value === 'string') {
              cell.value = parseFloat(cell.value) || 0;
            }
          }

          if (['invoice_date', 'pattern_serial', 'no', 'tax_rate'].includes(col.field)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
        });
      });

      if (currentGroupStartRow !== -1 && allData.length + 1 > currentGroupStartRow) {
        mergeQueue.push({ start: currentGroupStartRow, end: allData.length + 1 });
      }

      // Các cột cần gộp nếu trùng invoice_no
      const fieldsToMerge = ['no', 'invoice_no', 'invoice_date', 'pattern_serial', 'seller_name'];

      mergeQueue.forEach(({ start, end }) => {
        fieldsToMerge.forEach((field) => {
          const colIndex = columnsToExport.findIndex((c) => c.field === field);
          if (colIndex !== -1) {
            worksheet.mergeCells(start, colIndex + 1, end, colIndex + 1);
          }
        });
      });

      // Tự động điều chỉnh độ rộng cột
      worksheet.columns.forEach((column) => {
        let maxLen = 10;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const value = cell.value ? cell.value.toString() : '';
          if (value.length > maxLen) {
            maxLen = value.length;
          }
        });
        column.width = Math.min(maxLen + 3, 50);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'input_invoice_product_list.xlsx');

      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Xuất file excel thành công',
        life: 3000,
      });
    } catch (error) {
      console.error('Error exporting excel:', error);
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: error?.message || 'Có lỗi xảy ra khi xuất excel',
        life: 5000,
      });
    } finally {
      isLoadingExport.value = false;
    }
  };

  return {
    isLoadingExport,
    executeExport,
  };
}
