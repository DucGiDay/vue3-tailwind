<template>
  <div id="pricing" class="fb-py-6 fb-px-6 lg:fb-px-20 fb-my-2 md:fb-my-6">
    <div class="fb-text-center fb-mb-6">
      <div class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-normal fb-mb-2 fb-text-4xl">Matchless Pricing</div>
      <span class="fb-text-muted-color fb-text-2xl">Amet consectetur adipiscing elit...</span>
    </div>

    <div class="fb-grid fb-grid-cols-12 fb-gap-4 fb-justify-between fb-mt-20 md:fb-mt-0">
      <div class="fb-col-span-12 lg:fb-col-span-4 fb-p-0 md:fb-p-4">
        <div
          class="fb-p-4 fb-flex fb-flex-col fb-border-surface-200 dark:fb-border-surface-600 pricing-card fb-cursor-pointer fb-border-2 hover:fb-border-primary fb-duration-300 fb-transition-all"
          style="border-radius: 10px"
        >
          <div class="fb-text-surface-900 dark:fb-text-surface-0 fb-text-center fb-my-8 fb-text-3xl">Free</div>
          <img src="/demo/images/landing/free.svg" class="fb-w-10/12 fb-mx-auto" alt="free" />
          <div class="fb-my-8 fb-flex fb-flex-col fb-items-center fb-gap-4">
            <div class="fb-flex fb-items-center">
              <span class="fb-text-5xl fb-font-bold fb-mr-2 fb-text-surface-900 dark:fb-text-surface-0">$0</span>
              <span class="fb-text-surface-600 dark:fb-text-surface-200">per month</span>
            </div>
            <Button label="Get Started" class="p-button-rounded fb-border-0 fb-ml-4 fb-font-light fb-leading-tight fb-bg-gray-blue-500 fb-text-white"></Button>
          </div>
          <Divider class="fb-w-full fb-bg-surface-200"></Divider>
          <ul class="fb-my-8 fb-list-none fb-p-0 fb-flex fb-text-surface-900 dark:fb-text-surface-0 fb-flex-col fb-px-8">
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Responsive Layout</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Unlimited Push Messages</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">50 Support Ticket</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Free Shipping</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="fb-col-span-12 lg:fb-col-span-4 fb-p-0 md:fb-p-4 fb-mt-6 md:fb-mt-0">
        <div
          class="fb-p-4 fb-flex fb-flex-col fb-border-surface-200 dark:fb-border-surface-600 pricing-card fb-cursor-pointer fb-border-2 hover:fb-border-primary fb-duration-300 fb-transition-all"
          style="border-radius: 10px"
        >
          <div class="fb-text-surface-900 dark:fb-text-surface-0 fb-text-center fb-my-8 fb-text-3xl">Startup</div>
          <img src="/demo/images/landing/startup.svg" class="fb-w-10/12 fb-mx-auto" alt="startup" />
          <div class="fb-my-8 fb-flex fb-flex-col fb-items-center fb-gap-4">
            <div class="fb-flex fb-items-center">
              <span class="fb-text-5xl fb-font-bold fb-mr-2 fb-text-surface-900 dark:fb-text-surface-0">$1</span>
              <span class="fb-text-surface-600 dark:fb-text-surface-200">per month</span>
            </div>
            <Button label="Get Started" class="p-button-rounded fb-border-0 fb-ml-4 fb-font-light fb-leading-tight fb-bg-gray-blue-500 fb-text-white"></Button>
          </div>
          <Divider class="fb-w-full fb-bg-surface-200"></Divider>
          <ul class="fb-my-8 fb-list-none fb-p-0 fb-flex fb-text-surface-900 dark:fb-text-surface-0 fb-flex-col fb-px-8">
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Responsive Layout</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Unlimited Push Messages</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">50 Support Ticket</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Free Shipping</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="fb-col-span-12 lg:fb-col-span-4 fb-p-0 md:fb-p-4 fb-mt-6 md:fb-mt-0">
        <div
          class="fb-p-4 fb-flex fb-flex-col fb-border-surface-200 dark:fb-border-surface-600 pricing-card fb-cursor-pointer fb-border-2 hover:fb-border-primary fb-duration-300 fb-transition-all"
          style="border-radius: 10px"
        >
          <div class="fb-text-surface-900 dark:fb-text-surface-0 fb-text-center fb-my-8 fb-text-3xl">Enterprise</div>
          <img src="/demo/images/landing/enterprise.svg" class="fb-w-10/12 fb-mx-auto" alt="enterprise" />
          <div class="fb-my-8 fb-flex fb-flex-col fb-items-center fb-gap-4">
            <div class="fb-flex fb-items-center">
              <span class="fb-text-5xl fb-font-bold fb-mr-2 fb-text-surface-900 dark:fb-text-surface-0">$5</span>
              <span class="fb-text-surface-600 dark:fb-text-surface-200">per month</span>
            </div>
            <Button label="Get Started" class="p-button-rounded fb-border-0 fb-ml-4 fb-font-light fb-leading-tight fb-bg-gray-blue-500 fb-text-white"></Button>
          </div>
          <Divider class="fb-w-full fb-bg-surface-200"></Divider>
          <ul class="fb-my-8 fb-list-none fb-p-0 fb-flex fb-text-surface-900 dark:fb-text-surface-0 fb-flex-col fb-px-8">
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Responsive Layout</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Unlimited Push Messages</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">50 Support Ticket</span>
            </li>
            <li class="fb-py-2">
              <i class="pi pi-fw pi-check fb-text-xl fb-text-brand-500 fb-mr-2"></i>
              <span class="fb-text-xl fb-leading-normal">Free Shipping</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>