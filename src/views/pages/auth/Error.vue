<script setup>
import FloatingConfigurator from '@/components/PageComponent/FloatingConfigurator.vue';
</script>

<template>
  <FloatingConfigurator />
  <div class="fb-bg-surface-50 dark:fb-bg-surface-950 fb-flex fb-items-center fb-justify-center fb-min-h-screen fb-min-w-[100vw] fb-overflow-hidden">
    <div class="fb-flex fb-flex-col fb-items-center fb-justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="fb-w-full fb-bg-surface-0 dark:fb-bg-surface-900 fb-py-20 fb-px-8 sm:fb-px-20 fb-flex fb-flex-col fb-items-center" style="border-radius: 53px">
          <div class="fb-gap-4 fb-flex fb-flex-col fb-items-center">
            <div class="fb-flex fb-justify-center fb-items-center fb-border-2 fb-border-pink-500 fb-rounded-full" style="height: 3.2rem; width: 3.2rem">
              <i class="pi pi-fw pi-exclamation-circle !fb-text-2xl fb-text-pink-500"></i>
            </div>
            <h1 class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-bold fb-text-5xl fb-mb-2">Error Occured</h1>
            <span class="fb-text-muted-color fb-mb-8">Requested resource is not available.</span>
            <img src="/demo/images/error/asset-error.svg" alt="Error" class="fb-mb-8" width="80%" />
            <div class="fb-col-span-12 fb-mt-8 fb-text-center">
              <Button as="router-link" label="Go to Dashboard" to="/" severity="danger" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>