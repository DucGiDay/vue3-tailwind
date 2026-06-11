<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import { useGlobalStore } from '@/stores/global.store';
import { useAuthStore } from '@/stores/auth.store';

const { toggleMenu } = useLayout();
const router = useRouter();
const globalStore = useGlobalStore();
const authStore = useAuthStore();

const user = computed(() => {
  if (globalStore.currentUser && Object.keys(globalStore.currentUser).length) {
    return globalStore.currentUser;
  }
  return JSON.parse(localStorage.getItem('user') || '{}');
});

const splitName = computed(() => (user.value?.full_name || '').charAt(0));

const brands = computed(() => user.value?.brands || []);

const selectedBrand = ref(
  globalStore.currentBrand && Object.keys(globalStore.currentBrand).length
    ? globalStore.currentBrand
    : brands.value[0]
);

if (selectedBrand.value && (!globalStore.currentBrand || !Object.keys(globalStore.currentBrand).length)) {
  globalStore.setGlobalState({ currentBrand: selectedBrand.value });
}

const onBrandChange = (event) => {
  globalStore.setGlobalState({ currentBrand: event.value });
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <span class="text-primary">Hóa đơn điện tử</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions fb-items-center fb-gap-4">
      <Select
        v-if="brands.length > 0"
        v-model="selectedBrand"
        :options="brands"
        optionLabel="brand_name"
        placeholder="Chọn thương hiệu"
        @change="onBrandChange"
        class="fb-w-48"
      />
      <span class="fb-hidden md:fb-block fb-font-medium">{{ user?.full_name }}</span>
      <Avatar
        :label="splitName"
        size="large"
        style="background-color: #f5f5f5; color: #717680; border: 1px solid #e9eaeb"
        shape="circle"
      />
      <Button icon="pi pi-sign-out" severity="danger" text rounded aria-label="Đăng xuất" @click="handleLogout" />
    </div>
  </div>
</template>
