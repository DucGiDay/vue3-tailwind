<template>
  <Transition name="fade">
    <div
      v-if="show && fullScreen"
      class="fb-loading-overlay fb-flex fb-flex-col fb-items-center fb-justify-center"
      :class="{ 'fb-loading-full': fullScreen, 'fb-loading-absolute': !fullScreen }"
    >
      <div
        class="fb-loading-content fb-flex fb-flex-col fb-items-center fb-gap-4 fb-p-8 fb-rounded-2xl"
      >
        <ProgressSpinner
          style="width: 3.125rem; height: 3.125rem"
          strokeWidth="6"
          fill="transparent"
        />
        <p v-if="label" class="fb-text-sm fb-font-medium fb-text-gray-700 fb-m-0">
          {{ label }}
        </p>
      </div>
    </div>

    <ProgressSpinner
      v-else-if="show"
      style="width: 1rem; height: 1rem"
      strokeWidth="6"
      fill="transparent"
    />
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'Đang xử lý...',
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.fb-loading-overlay {
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(0.25rem);
  -webkit-backdrop-filter: blur(0.25rem);
}

.fb-loading-full {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
}

.fb-loading-absolute {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
}

.fb-loading-content {
  background: white;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
