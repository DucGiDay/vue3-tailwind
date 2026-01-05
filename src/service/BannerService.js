export const BannerService = {
  getData() {
    return data;
  },
  getBanners() {
    return Promise.resolve(this.getData());
  },
  getBanner(id) {
    const result = data.find((e) => e.id === id);
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result);
      } else {
        reject('Không có dữ liệu');
      }
    });
  }
};
const data = [
  {
    image: 'https://image.foodbook.vn/upload/20231102/1698917632016_blob.jpeg',
    id: 1
  },
  {
    image: 'https://image.foodbook.vn/upload/20240105/1704444034880_blob.jpeg',
    id: 2
  },
  {
    image: 'https://image.foodbook.vn/upload/20240105/1704444047986_blob.jpeg',
    id: 3
  }
];
