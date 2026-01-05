export const StoreService = {
  getData() {
    return data;
  },

  getStores() {
    return Promise.resolve({
      success: true,
      data: this.getData()
    });
  },

  getStore(id) {
    const result = data.find((e) => e.id === id);
    return new Promise((resolve, reject) => {
      resolve({
        success: true,
        data: result
      });
      if (!result) reject('Không có dữ liệu');
    });
  }
};

export default StoreService;

const today = new Date();
const setTimeISO = (hour, minute = 0) => {
  const date = new Date(today);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const shift_config = [
  { name: 'Sáng', code: 'S', start: new Date(setTimeISO(7)), end: new Date(setTimeISO(12)) },
  { name: 'Chiều', code: 'C', start: new Date(setTimeISO(12)), end: new Date(setTimeISO(17)) },
  { name: 'Tối', code: 'T', start: new Date(setTimeISO(17)), end: new Date(setTimeISO(23)) }
];

const data = [
  {
    id: 1,
    store_code: 'ST001',
    store_name: 'Quán Ăn Hương Quê',
    address: '25 Lý Thường Kiệt, Q.10, TP.HCM',
    phone_number: '0901234567',
    status: true,
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKf5gTv-tSPFeR3u_NEX0nTTNRqbkYe7XJqg&s',
    shift_config,
    extra_data: {}
  },
  {
    id: 2,
    store_code: 'ST002',
    store_name: 'Quán Bún Bò Minh Tâm',
    address: '112 Nguyễn Trãi, Q.5, TP.HCM',
    phone_number: '0987654321',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 3,
    store_code: 'ST003',
    store_name: 'Phở Bò Sunny',
    address: '45 Lê Duẩn, Q.1, TP.HCM',
    phone_number: '0912345678',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 4,
    store_code: 'ST004',
    store_name: 'Cơm Tấm Hưng Thịnh',
    address: '82 Nguyễn Oanh, Gò Vấp, TP.HCM',
    phone_number: '0938765432',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 5,
    store_code: 'ST005',
    store_name: 'Quán Gà Rán TechMax',
    address: '19 Trần Quang Diệu, Q.3, TP.HCM',
    phone_number: '0945123789',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 6,
    store_code: 'ST006',
    store_name: 'Nhà Hàng Chay Hoà Bình',
    address: '55 Nguyễn Văn Cừ, Q.5, TP.HCM',
    phone_number: '0975123467',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 7,
    store_code: 'ST007',
    store_name: 'Bánh Canh Cua Ngọt Ngào',
    address: '120 Hai Bà Trưng, Q.1, TP.HCM',
    phone_number: '0967345612',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 8,
    store_code: 'ST008',
    store_name: 'Bún Riêu Gia Phát',
    address: '77 Cách Mạng Tháng 8, Q.10, TP.HCM',
    phone_number: '0908787878',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 9,
    store_code: 'ST009',
    store_name: 'Quán Ăn Chay Lavender',
    address: '38B Võ Văn Tần, Q.3, TP.HCM',
    phone_number: '0911988888',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  },
  {
    id: 10,
    store_code: 'ST010',
    store_name: 'Lẩu Nướng PowerFit',
    address: '99 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
    phone_number: '0934567890',
    status: true,
    logo: '',
    shift_config,
    extra_data: {}
  }
];
