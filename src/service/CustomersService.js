export const CustomersService = {
  getData() {
    return data;
  },
  getCustomers() {
    return Promise.resolve(this.getData());
  },
  getCustomer(id) {
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
    phone_number: '0979479550',
    customer_name: 'Myra Mraz',
    created_at: '2025-06-23T15:40:18.110Z',
    id: 1,
    point: 1000
  },
  {
    phone_number: '0321456987',
    customer_name: 'Irene Torphy',
    created_at: '2025-06-23T08:22:14.832Z',
    id: 2,
    point: 1000
  },
  {
    phone_number: '0789654123',
    customer_name: 'Mr. Floyd Maggio III',
    created_at: '2025-06-23T06:19:33.352Z',
    id: 3,
    point: 1000
  },
  {
    phone_number: '0175324896',
    customer_name: 'Stanley Bednar',
    created_at: '2025-06-23T15:53:49.238Z',
    id: 4,
    point: 1000
  },
  {
    phone_number: '0357896412',
    customer_name: 'Irving Friesen',
    created_at: '2025-06-23T15:00:38.723Z',
    id: 5,
    point: 1000
  },
  {
    phone_number: '0123658974',
    customer_name: 'Ms. Marlene Mante',
    created_at: '2025-06-23T11:42:58.120Z',
    id: 6,
    point: 1000
  },
  {
    phone_number: '0758963241',
    customer_name: 'Cheryl Aufderhar',
    created_at: '2025-06-23T06:52:41.088Z',
    id: 7,
    point: 1000
  },
  {
    phone_number: '0742589349',
    customer_name: 'Mark Langosh',
    created_at: '2025-06-23T23:12:36.064Z',
    id: 8,
    point: 1000
  },
  {
    phone_number: '0532164987',
    customer_name: 'Bonnie Thiel',
    created_at: '2025-06-23T21:26:59.571Z',
    id: 9,
    point: 1000
  },
  {
    phone_number: '0978523649',
    customer_name: 'Mildred Schmitt',
    created_at: '2025-06-23T14:41:00.747Z',
    id: 10,
    point: 1000
  }
];
