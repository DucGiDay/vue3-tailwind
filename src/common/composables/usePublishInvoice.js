import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import axios from 'axios';

const HILO_BASE = import.meta.env.VITE_HILO_BASE_URL || 'http://localhost:56789';

const parseHiloDateString = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})[T\s](\d{2}):(\d{2}):(\d{2})$/);
  if (match) {
    const [, day, month, year, hour, minute, second] = match;
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }
  return dateStr;
};

export function usePublishInvoice() {
  const isLoading = ref(false);
  const loadingMessage = ref('');
  const toast = useToast();

  const publishInvoice = async (mergedTranIds, onSelectCert, onSelectSignMethod) => {
    isLoading.value = true;
    loadingMessage.value = 'Đang kiểm tra kết nối USB Token...';
    let selectedCertSerial = null;

    try {
      // BƯỚC 2 — KIỂM TRA CHỮ KÝ SỐ (USB Token)
      let certs = [];
      let isPluginAvailable = false;
      try {
        const checkResponse = await axios.get(`${HILO_BASE}/api/certificate/getall`, {
          timeout: 10000,
        });
        const resData = checkResponse.data;
        console.log('response check Hilo plugin', resData);
        if (resData && (resData.status === true || resData.Status === true)) {
          const certData = resData.data || resData.Data;
          if (certData && certData.length > 0) {
            isPluginAvailable = true;
          }
        }
        
      } catch (e) {
        console.error('[PublishInvoice] Lỗi kết nối Hilo Plugin ở bước kiểm tra:', e);
        // Không có chữ ký số hoặc plugin chưa cài -> đi nhánh HSM
      }

      if (isPluginAvailable) {
        // BƯỚC 2.0 - CHỌN PHƯƠNG THỨC KÝ
        let signMethod = 'TOKEN';
        if (onSelectSignMethod) {
          try {
            isLoading.value = false;
            loadingMessage.value = '';
            signMethod = await onSelectSignMethod();
            if (!signMethod) return false; // Hủy chọn
            isLoading.value = true;
            loadingMessage.value = 'Đang chuẩn bị...';
          } catch (e) {
            console.error('[PublishInvoice] Lỗi chọn phương thức ký:', e);
            return false;
          }
        }

        // Nếu người dùng chọn HSM ở dialog, bỏ qua USB Token
        if (signMethod === 'HSM') {
          return await publishHsm(mergedTranIds);
        }

        // BƯỚC 2.1 — CHỌN CHỮ KÝ SỐ (Tự làm giao diện chọn)
        if (onSelectCert) {
          try {
            const checkResponse = await axios.get(`${HILO_BASE}/api/certificate/get`, {
              timeout: 10000,
            });
            const resData = checkResponse.data;
            console.log('response Select cert Hilo plugin', resData);
            if (resData && (resData.status === true || resData.Status === true)) {
              const certData = resData.data || resData.Data;
              if (certData) {
                const rawCerts = Array.isArray(certData) ? certData : [certData];
                certs = rawCerts.map((c) => {
                  const toDate = c.ValidTo || c.ToDate || c.toDate;
                  const fromDate = c.ValidFrom || c.FromDate || c.fromDate;
                  return {
                    ...c,
                    CertSerial: c.CertSerial || c.certSerial,
                    Subject: c.Subject || c.subject,
                    // Issuer: c.Issuer || c.Owner || c.owner || c.Supplier || c.supplier || '',
                    ValidTo: parseHiloDateString(toDate),
                    ValidFrom: parseHiloDateString(fromDate),
                  };
                });
              }
            }

            isLoading.value = false;
            loadingMessage.value = '';
            selectedCertSerial = await onSelectCert(certs);
            if (!selectedCertSerial) return false;
            isLoading.value = true;
            loadingMessage.value = 'Đang chuẩn bị ký số...';
          } catch (e) {
            console.error('[PublishInvoice] Lỗi chọn hoặc hủy chọn chữ ký số:', e);
            // Hủy chọn hoặc lỗi -> Dừng flow phát hành để tránh nhầm lẫn
            return false;
          }
        } else {
          // Fallback nếu không truyền callback
          selectedCertSerial = certs[0]?.CertSerial;
        }

        if (selectedCertSerial) {
          // Đi theo NHÁNH USB TOKEN (Bước 3B)
          const selectedCert = certs.find((c) => c.CertSerial === selectedCertSerial);
          const certBase64 = selectedCert ? selectedCert.CertBase64 || selectedCert.certBase64 : '';
          return await publishUsbToken(mergedTranIds, selectedCertSerial, certBase64);
        } else {
          // Người dùng không chọn chữ ký số -> Dừng flow
          return false;
        }
      } else {
        // Đi theo NHÁNH HSM (Bước 3A)
        // toast.add({
        //   severity: 'warn',
        //   summary: 'Cảnh báo',
        //   detail:
        //     'Hệ thống đang chuyển sang phát hành bằng HSM do không tìm thấy USB Token/Hilo Plugin',
        //   life: 5000,
        // });
        return await publishHsm(mergedTranIds);
      }
    } catch (error) {
      console.error('[PublishInvoice]', error);
      const msg =
        error.response?.data?.message || error.message || 'Có lỗi xảy ra trong quá trình phát hành';
      toast.add({ severity: 'error', summary: 'Lỗi phát hành', detail: msg, life: 5000 });
      return false;
    } finally {
      isLoading.value = false;
      loadingMessage.value = '';
    }
  };

  const publishHsm = async (mergedTranIds) => {
    // BƯỚC 3A — NHÁNH HSM
    loadingMessage.value = 'Đang phát hành hóa đơn qua HSM...';
    await invoiceService.publishHsm({
      merged_tran_ids: mergedTranIds,
    });
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Phát hành hóa đơn thành công!',
      life: 3000,
    });
    return true;
  };

  const publishUsbToken = async (mergedTranIds, certSerial, certBase64) => {
    // BƯỚC 3B — NHÁNH USB TOKEN
    // Bước 3B.1 — Lấy dữ liệu hash/xml để ký
    loadingMessage.value = 'Đang lấy dữ liệu hóa đơn...';

    const hashRes = await invoiceService.hashPublishUsbToken({
      merged_tran_id: (mergedTranIds || []).join(','),
      cert_base64_string: certBase64 || '',
    });

    // axios response bọc trong data, và giả sử backend trả về field data (hoặc trả trực tiếp mảng/object)
    const hashData = hashRes.data?.data || hashRes.data;

    // Bước 3B.2 — Ký số bằng Hilo Plugin
    let signedResult;
    loadingMessage.value = 'Đang ký số qua Hilo Plugin...';
    try {
      const rawXml = hashData.xml || '';

      // Wrap lại đúng chuẩn TT78 trước khi ký
      const xmlToSign = `<XmlTemplate>\n  <Data Id="DL">${rawXml}</Data>\n  <DSCKS><NNT /></DSCKS>\n</XmlTemplate>`;

      const signPayload = {
        IdToSign: 'DL',
        XMLDataToSign: xmlToSign,
        HashAlgorithm: 'SHA256',
        RSASignaturePadding: 'Pkcs1',
        CertSerial: certSerial,
      };

      const signRes = await axios.post(`${HILO_BASE}/api/certificate/Sign78`, signPayload);
      const signedDataStr = signRes.data?.data || signRes.data;

      signedResult = {
        key: hashData.key,
        signed: signedDataStr,
        merged_tran_id: (mergedTranIds || []).join(','),
        cert_base64_string: certBase64 || '',
      };
    } catch (e) {
      console.error('[PublishInvoice] Lỗi ký số:', e);
      toast.add({
        severity: 'error',
        summary: 'Lỗi ký số',
        detail: 'Lỗi ký số: Vui lòng kiểm tra plugin Hilo đã được cài và chạy chưa',
        life: 5000,
      });
      return false; // Stop flow
    }

    // Bước 3B.3 — Phát hành với chữ ký
    loadingMessage.value = 'Đang hoàn tất phát hành...';
    await invoiceService.publishUsbToken(signedResult);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Phát hành hóa đơn thành công!',
      life: 3000,
    });
    return true;
  };

  return { publishInvoice, isLoading, loadingMessage };
}
