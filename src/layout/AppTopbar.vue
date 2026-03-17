<script setup>
const user = JSON.parse(localStorage.getItem('user') || '{}');
const splitName = (user?.full_name || '').charAt(0);
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

    <div class="layout-topbar-actions fb-items-center">
      <span class="fb-hidden md:fb-block fb-font-medium">{{ user?.full_name }}</span>
      <Avatar
        :label="splitName"
        size="large"
        style="background-color: #f5f5f5; color: #717680; border: 1px solid #e9eaeb"
        shape="circle"
      />
    </div>
  </div>
</template>
