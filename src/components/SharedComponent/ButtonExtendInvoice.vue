<template>
  <Button size="small" outlined class="!fb-rounded-lg" @click="onBuyInvoice">
    <IconCart />
    Mua hóa đơn
  </Button>
</template>

<script setup>
const onBuyInvoice = () => {
  window.location.assign(window.location.origin + '/extend-license/invoice-renewal-stores');
};
</script>
