import { ref } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import { useToast } from 'primevue/usetoast';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { formatDate } from '@/common/utils/common';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

export function useInputInvoiceSummaryExport() {
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

      const res = await invoiceService.getInputInvoiceSummary(basePayload);

      const allData = res?.data || [];
      if (allData.length === 0) {
        toast.add({
          severity: 'warn',
          summary: 'Thông báo',
          detail: 'Không có dữ liệu để xuất excel',
          life: 5000,
        });
        return;
      }

      // Group data incase of pagination splitting
      const groupedData = {};
      allData.forEach((group) => {
        if (!groupedData[group.tax_rate]) {
          groupedData[group.tax_rate] = {
            tax_rate: group.tax_rate,
            total_before_tax: 0,
            total_tax: 0,
            invoices: [],
          };
        }
        groupedData[group.tax_rate].invoices.push(...(group.invoices || []));
        groupedData[group.tax_rate].total_before_tax += Number(group.total_before_tax) || 0;
        groupedData[group.tax_rate].total_tax += Number(group.total_tax) || 0;
      });
      const finalItems = Object.values(groupedData);

      const totalBeforeTaxAll = finalItems.reduce(
        (sum, group) => sum + (Number(group.total_before_tax) || 0),
        0,
      );
      const totalTaxAll = finalItems.reduce(
        (sum, group) => sum + (Number(group.total_tax) || 0),
        0,
      );
      const totalTaxableAll = totalBeforeTaxAll - totalTaxAll;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Bảng kê HDDV');

      const headers = [
        'STT',
        'Ký hiệu hóa đơn',
        'Mẫu số',
        'Số hóa đơn',
        'Thời gian lập',
        'Đơn vị bán',
        'Mã số thuế bên bán',
        'Tiền trước thuế',
        'Tiền thuế',
        'Ghi chú',
      ];

      // Bảng có các dòng đặc biệt. Row by Row approach:
      finalItems.forEach((group) => {
        // 1. Dòng tax rate
        const taxRow = worksheet.addRow([`Mức thuế suất: ${group.tax_rate}`]);
        worksheet.mergeCells(`A${taxRow.number}:J${taxRow.number}`);
        taxRow.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0560A6' } };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });

        // 2. Dòng header
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0560A6' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });

        // 3. Dòng invoice
        group.invoices.forEach((invoice, index) => {
          const stt = invoice.stt || index + 1; // fallback if no stt
          const rowValues = [
            stt,
            invoice.serial,
            invoice.pattern,
            invoice.no,
            invoice.invoice_date ? formatDate(invoice.invoice_date) : '',
            invoice.seller_name,
            invoice.seller_tax_code,
            Number(invoice.amount_before_tax) || 0,
            Number(invoice.tax_amount) || 0,
            invoice.note || '',
          ];
          const row = worksheet.addRow(rowValues);
          row.eachCell((cell, colNum) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', wrapText: true };
            if ([1, 2, 3, 4, 5, 7].includes(colNum)) {
              cell.alignment.horizontal = 'center';
            }
            if ([8, 9].includes(colNum)) {
              cell.numFmt = '#,##0';
              cell.alignment.horizontal = 'right';
            }
          });
        });

        // 4. Tổng của nhóm
        const totalRow = worksheet.addRow([
          'Tổng',
          '',
          '',
          '',
          '',
          '',
          '',
          Number(group.total_before_tax) || 0,
          Number(group.total_tax) || 0,
          '',
        ]);
        worksheet.mergeCells(`A${totalRow.number}:G${totalRow.number}`);
        totalRow.eachCell((cell, colNum) => {
          cell.font = { bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F6F9' } };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if (colNum === 1) cell.alignment = { horizontal: 'center' };
          if ([8, 9].includes(colNum)) {
            cell.numFmt = '#,##0';
            cell.alignment = { horizontal: 'right' };
          }
        });
      });

      // 5. Khoảng trống
      worksheet.addRow([]);

      // 6. 3 Hàng tổng cuối
      const finalRow1 = worksheet.addRow([
        'Tổng doanh thu hàng hoá, dịch vụ mua vào trước thuế',
        '',
        '',
        '',
        '',
        '',
        '',
        totalBeforeTaxAll,
        '',
        '',
      ]);
      worksheet.mergeCells(`A${finalRow1.number}:G${finalRow1.number}`);
      finalRow1.eachCell((cell, colNum) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F6F9' } };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (colNum === 1) cell.alignment = { horizontal: 'left' };
        if (colNum === 8) {
          cell.numFmt = '#,##0';
          cell.alignment = { horizontal: 'right' };
        }
      });

      const finalRow2 = worksheet.addRow([
        'Tổng doanh thu hàng hoá, dịch vụ mua vào chịu thuế GTGT',
        '',
        '',
        '',
        '',
        '',
        '',
        totalTaxableAll,
        '',
        '',
      ]);
      worksheet.mergeCells(`A${finalRow2.number}:G${finalRow2.number}`);
      finalRow2.eachCell((cell, colNum) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F6F9' } };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (colNum === 1) cell.alignment = { horizontal: 'left' };
        if (colNum === 8) {
          cell.numFmt = '#,##0';
          cell.alignment = { horizontal: 'right' };
        }
      });

      const finalRow3 = worksheet.addRow([
        'Tổng số thuế GTGT của hàng hóa, dịch vụ mua vào',
        '',
        '',
        '',
        '',
        '',
        '',
        totalTaxAll,
        '',
        '',
      ]);
      worksheet.mergeCells(`A${finalRow3.number}:G${finalRow3.number}`);
      finalRow3.eachCell((cell, colNum) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F6F9' } };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (colNum === 1) cell.alignment = { horizontal: 'left' };
        if (colNum === 8) {
          cell.numFmt = '#,##0';
          cell.alignment = { horizontal: 'right' };
        }
      });

      // Tự động điều chỉnh độ rộng cột
      worksheet.columns.forEach((column) => {
        let maxLen = 10;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const value = cell.value ? cell.value.toString() : '';
          // Bỏ qua row tax_rate và tổng vì nó đã mergeCells, có thể làm width bị kéo dãn vô lí
          if (value.startsWith('Mức thuế suất') || value.startsWith('Tổng')) return;
          if (value.length > maxLen) {
            maxLen = value.length;
          }
        });
        column.width = Math.min(maxLen + 3, 50);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'input_invoice_summary.xlsx');
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
