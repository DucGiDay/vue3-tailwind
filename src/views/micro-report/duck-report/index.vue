<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Danh sách đơn giản</h1>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Tên
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Vai trò
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ item.id }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ item.name }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ item.email }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ item.role }}</p>
            </td>
            <td
              class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right"
            >
              <button
                class="text-indigo-600 hover:text-indigo-900"
              >
                Sửa
              </button>
              <button
                class="text-red-600 hover:text-red-900 ml-4"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const data = ref([
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Admin' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'User' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'User' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'Guest' },
]);
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
