export const MenuService = {
  getData() {
    return data;
  },
  getProducts() {
    return Promise.resolve({
      success: true,
      data: this.getData()
    });
  },
  getProduct(id) {
    const result = data.find((e) => e.id === id);
    return new Promise((resolve, reject) => {
      if (result) {
        resolve({
          success: true,
          data: result
        });
      } else {
        reject('Không có dữ liệu');
      }
    });
  }
};
export default MenuService;
const data = [
  {
    name_food: 'Chảo thường',
    image: 'https://image.foodbook.vn/images/20240912/1726143169534-28698600_1573446652769110_899941766849487232_o.jpg',
    price: 30000,
    quantity: 73,
    status: true,
    type: 'Món chính',
    id: 1
  },
  {
    name_food: 'Chảo đặc biệt',
    image: 'https://image.foodbook.vn/images/20240912/1726143190153-186957609_3934667076647044_7975702086288959487_n.jpg',
    price: 35000,
    quantity: 12,
    status: true,
    type: 'Món chính',
    id: 2
  },
  {
    name_food: 'Bít tết',
    image: 'https://image.foodbook.vn/images/20240912/1726143211803-320575656_3386915801635838_4549859084249153861_n.jpg',
    price: 79000,
    quantity: 88,
    status: true,
    type: 'Món chính',
    id: 3
  },
  {
    name_food: 'Bít tết đặc biệt',
    image: 'https://image.foodbook.vn/images/20240912/1726143233923-94522910_2857883364325426_4429472533405761536_n.jpg',
    price: 109000,
    quantity: 28,
    status: true,
    type: 'Món chính',
    id: 4
  },
  {
    name_food: 'Sốt vang',
    image: 'https://image.foodbook.vn/images/20240912/1726143267011-65366800_2240150206098748_9039526382656290816_n.jpg',
    price: 35000,
    quantity: 70,
    status: true,
    type: 'Món chính',
    id: 5
  },
  {
    name_food: 'Xúc xích',
    image: 'https://image.foodbook.vn/images/20241212/1733969529528-xuc-xich.jpg',
    price: 12000,
    quantity: 57,
    status: true,
    type: 'Món gọi thêm',
    id: 6
  },
  {
    name_food: 'Trứng ốp la',
    image: 'https://cdn.tgdd.vn/Files/2014/06/09/549028/Cach-lam-mon-trung-op-la-bang-lo-vi-song-600x400.jpg',
    price: 8000,
    quantity: 65,
    status: true,
    type: 'Món gọi thêm',
    id: 7
  },
  {
    name_food: 'Pate',
    image: 'https://image.foodbook.vn/images/20240912/1726142960861-pate-sieu-beo-350g-1660098962-a9316c.jpg',
    price: 10000,
    quantity: 65,
    status: true,
    type: 'Món gọi thêm',
    id: 8
  },
  {
    name_food: 'Thêm bò',
    image: 'https://image.foodbook.vn/images/20240912/1726143104528-images.jpg',
    price: 35000,
    quantity: 94,
    status: true,
    type: 'Món gọi thêm',
    id: 9
  },
  {
    name_food: 'Sốt chảo Ô long(Gọi thêm)',
    image: 'https://image.foodbook.vn/images/20241212/1733969668693-cach-lam-nuoc-sot-banh-mi-pate-1.jpg',
    price: 3000,
    quantity: 78,
    status: true,
    type: 'Món gọi thêm',
    id: 10
  },
  {
    name_food: 'Trà quất',
    image: 'https://i.ytimg.com/vi/lE3efZoYIuo/maxresdefault.jpg',
    price: 15000,
    quantity: 71,
    status: true,
    type: 'Đồ uống pha chế',
    id: 11
  },
  {
    name_food: 'Trà quất nha đam',
    image: 'https://image.foodbook.vn/images/20240912/1726143790145-c7fe91c3f8875cd73910e61ff31458ca.jpg',
    price: 20000,
    quantity: 36,
    status: true,
    type: 'Đồ uống pha chế',
    id: 12
  },
  {
    name_food: 'Chanh tươi',
    image: 'https://viquang.vn/wp-content/uploads/2017/06/images.jpg',
    price: 15000,
    quantity: 90,
    status: true,
    type: 'Đồ uống pha chế',
    id: 13
  },
  {
    name_food: 'Sữa đậu nành',
    image: 'https://image.foodbook.vn/images/20240930/1727664720126-nuoc-dau-nanh_1a2d577c17a24711952e2324850cc592.jpg',
    price: 10000,
    quantity: 62,
    status: true,
    type: 'Đồ uống pha chế',
    id: 14
  },
  {
    name_food: 'Nước chanh leo',
    image: 'https://st.quantrimang.com/photos/image/2020/04/23/nuoc-chanh-leo-co-tac-dung-gi-cach-pha-nuoc-chanh-leo-2.png',
    price: 20000,
    quantity: 49,
    status: true,
    type: 'Đồ uống pha chế',
    id: 15
  },
  {
    name_food: 'Trà lipton nóng/đá',
    image: 'https://image.foodbook.vn/images/20240912/1726143852166-unnamed.png',
    price: 10000,
    quantity: 68,
    status: true,
    type: 'Đồ uống pha chế',
    id: 16
  },
  {
    name_food: 'Khoai tây chiên',
    image: 'https://image.foodbook.vn/images/20240912/1726143512165-khoai-tay-chien-8926.jpg',
    price: 25000,
    quantity: 33,
    status: true,
    type: 'Khai vị',
    id: 17
  },
  {
    name_food: 'Bánh mì chuột',
    image: 'https://image.foodbook.vn/images/20240912/1726143147071-banh-mi-viet-nam-001-934.jpg',
    price: 5000,
    quantity: 14,
    status: true,
    type: 'Khác',
    id: 18
  },
  {
    name_food: 'Coca Cola',
    image: 'https://image.foodbook.vn/images/20240930/1727664734940-nuoc-ngot-coca-cola-330ml-202001131632421470-500x600.png',
    price: 15000,
    quantity: 35,
    status: true,
    type: 'Nước giải khát',
    id: 19
  },
  {
    name_food: 'Nước cam',
    image: 'https://image.foodbook.vn/images/20240928/1727536639632-nuoc-cam-ep-minute-maid-splash-320ml-202008101325415644.jpg',
    price: 15000,
    quantity: 19,
    status: true,
    type: 'Nước giải khát',
    id: 20
  },
  {
    name_food: 'Nước lọc',
    image: 'https://image.foodbook.vn/images/20240927/1727429147376-Dasani-500ml.jpg',
    price: 10000,
    quantity: 9,

    status: true,
    type: 'Nước giải khát',
    id: 21
  },
  {
    name_food: 'Bia Tiger bạc',
    image: 'https://image.foodbook.vn/images/20240912/1726143897301-tiger-bac-chai-7720.jpg',
    price: 25000,
    quantity: 80,
    status: true,
    type: 'Bia',
    id: 22
  }
];
