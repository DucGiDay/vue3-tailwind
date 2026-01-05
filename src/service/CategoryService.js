export const CategoryService = {
  getData() {
    return data;
  },
  getCategories() {
    return Promise.resolve({
      success: true,
      data: this.getData()
    });
  },
  getCategory(id) {
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
export default CategoryService;
const data = [
  { label: 'Món chính', des: 'Món chính', id: 1 },
  { label: 'Món gọi thêm', des: 'Món ăn đi kèm với bữa chính', id: 2 },
  { label: 'Đồ uống pha chế', des: 'Đồ uống pha chế', id: 3 },
  { label: 'Khai vị', des: 'Món khai vị dùng trước món chính', id: 4 },
  { label: 'Khác', des: 'Những món khác không có trong thực đơn', id: 5 },
  { label: 'Nước giải khát', des: 'Đồ uống giải khát', id: 6 },
  { label: 'Bia', des: 'Đồ uống có cồn', id: 7 }
];
