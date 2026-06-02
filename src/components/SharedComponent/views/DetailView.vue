<template>
  <div
    class="fb-fixed fb-left-0 fb-top-0 !fb-h-screen !fb-w-screen fb-z-10 fb-bg-surface-100 fb-overflow-auto"
  >
    <div class="fb-w-full fb-flex fb-flex-col">
      <!-- Header -->
      <div
        class="fb-fixed fb-z-10 fb-w-full fb-flex fb-items-center fb-justify-between fb-px-8 fb-py-[0.625rem] fb-border-b fb-border-gray-200 fb-bg-white"
      >
        <Button variant="text" severity="secondary" aria-label="Back" @click="handleBackFunc()">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 12H4M4 12L10 18M4 12L10 6"
              stroke="#414651"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>
        <h6 class="fb-text-lg fb-font-semibold !fb-m-0">{{ title || 'Chi tiết' }}</h6>
        <div>
          <slot name="header-actions" />
        </div>
      </div>

      <!-- Content -->
      <div class="fb-p-8 fb-mt-12">
        <slot />
      </div>

      <!-- Footer -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  title: { type: String },
  handleBack: {
    type: Function,
    default: null
  }
});

const handleBackFunc = () => {
  if (props.handleBack) {
    props.handleBack();
  } else {
    router.back();
  }
};
</script>
