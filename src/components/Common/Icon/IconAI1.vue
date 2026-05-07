<template>
  <img :src="icon" alt="AI" loading="lazy" />
</template>

<script setup>
import { getAssetUrl } from '@/common/utils/common';
import iconPath from '@/assets/img/icon/ai-1.svg';
const icon = getAssetUrl(iconPath);
</script>
