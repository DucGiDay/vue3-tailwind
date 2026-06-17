import { ref } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import { useToast } from 'primevue/usetoast';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { formatDate } from '@/common/utils/common';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { INPUT_INVOICE_TABLE_COLUMNS } from '@/common/constant/e-invoice-column.constant';

export function useInputInvoiceExport() {
  const invoiceStore = useEInoiveStore();
  const filterStore = useFilterStore();
  const globalStore = useGlobalStore();
  const toast = useToast();

  const isLoadingExport = ref(false);

  const executeExport = async (filters, statusMapValue) => {
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
      if (filters.filterStatusMST) basePayload.status_company_tax_code = filters.filterStatusMST;
      if (filters.filterPattern) basePayload.pattern = filters.filterPattern;
      if (filters.filterSerial) basePayload.serial = filters.filterSerial;
      if (filters.filterNo) basePayload.no = filters.filterNo;

      const exportPageSize = 100;

      // Tải trang 1 để lấy tổng số bản ghi
      const firstPageRes = await invoiceService.getInputInvoiceList({
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
        const pageRes = await invoiceService.getInputInvoiceList({
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
      const worksheet = workbook.addWorksheet('Danh sách hóa đơn đầu vào');

      // Lấy danh sách cột cần xuất (bỏ cột action)
      const columnsToExport = INPUT_INVOICE_TABLE_COLUMNS.filter((col) => col.field !== 'action');

      // Thêm hàng tiêu đề
      const row1Values = ['STT', ...columnsToExport.map((col) => col.header)];
      const headerRow = worksheet.addRow(row1Values);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0560A6' } }; // Màu nền xanh dương nhạt như ModalSaleByTranId.vue
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Thêm các hàng dữ liệu
      allData.forEach((item, index) => {
        const rowData = [
          index + 1, // STT
          ...columnsToExport.map((col) => {
            if (col.field === 'pattern_serial') {
              return `${item.pattern || ''} - ${item.serial || ''}`;
            }
            if (col.field === 'tax_declared') {
              return item.status_tax_code_name || '';
            }
            if (col.field === 'invoice_status') {
              return statusMapValue[item.invoice_status] || item.invoice_status || '';
            }
            if (col.field === 'invoice_date') {
              return item.invoice_date ? formatDate(item.invoice_date) : '';
            }
            return item[col.field] ?? '';
          }),
        ];

        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          cell.border = {
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

          const colIndex = colNumber - 2; // Bỏ qua cột STT ở vị trí 1
          if (colIndex >= 0 && colIndex < columnsToExport.length) {
            const col = columnsToExport[colIndex];

            // Format định dạng tiền tệ
            if (col.format === 'currency') {
              cell.numFmt = '#,##0';
              cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
              if (typeof cell.value === 'string') {
                cell.value = parseFloat(cell.value) || 0;
              }
            }

            // Căn giữa một số cột đặc biệt
            if (
              [
                'invoice_date',
                'pattern_serial',
                'no',
                'currency',
                'tax_declared',
                'invoice_status',
              ].includes(col.field)
            ) {
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            }
          } else if (colNumber === 1) {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
      saveAs(new Blob([buffer]), 'input_invoice_list.xlsx');

      // toast.add({
      //   severity: 'success',
      //   summary: 'Thành công',
      //   detail: 'Xuất file excel thành công',
      //   life: 3000,
      // });
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
