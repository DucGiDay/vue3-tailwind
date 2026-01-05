<script setup>
import FloatingConfigurator from '@/components/PageComponent/FloatingConfigurator.vue';
</script>

<template>
  <FloatingConfigurator />
  <div class="fb-bg-surface-50 dark:fb-bg-surface-950 fb-flex fb-items-center fb-justify-center fb-min-h-screen fb-min-w-[100vw] fb-overflow-hidden">
    <div class="fb-flex fb-flex-col fb-items-center fb-justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
        <div class="fb-w-full fb-bg-surface-0 dark:fb-bg-surface-900 fb-py-20 fb-px-8 sm:fb-px-20 fb-flex fb-flex-col fb-items-center" style="border-radius: 53px">
          <div class="fb-gap-4 fb-flex fb-flex-col fb-items-center">
            <div class="fb-flex fb-justify-center fb-items-center fb-border-2 fb-border-orange-500 fb-rounded-full" style="width: 3.2rem; height: 3.2rem">
              <i class="fb-text-orange-500 pi pi-fw pi-lock !fb-text-2xl"></i>
            </div>
            <h1 class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-bold fb-text-4xl lg:fb-text-5xl fb-mb-2">Access Denied</h1>
            <span class="fb-text-muted-color fb-mb-8">You do not have the necessary permisions. Please contact admins.</span>
            <img src="/demo/images/access/asset-access.svg" alt="Access denied" class="fb-mb-8" width="80%" />
            <div class="fb-col-span-12 fb-mt-8 fb-text-center">
              <Button as="router-link" label="Go to Dashboard" to="/" severity="warn" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>