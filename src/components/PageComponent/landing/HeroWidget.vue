<template>
  <div
    id="hero"
    class="fb-flex fb-flex-col fb-pt-6 fb-px-6 lg:fb-px-20 fb-overflow-hidden"
    style="
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
        radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%);
      clip-path: ellipse(150% 87% at 93% 13%);
    "
  >
    <div class="fb-mx-6 md:fb-mx-20 fb-mt-0 md:fb-mt-6">
      <h1 class="fb-text-6xl fb-font-bold fb-text-gray-900 fb-leading-tight"><span class="fb-font-light fb-block">Eu sem integer</span>eget magna fermentum</h1>
      <p class="fb-font-normal fb-text-2xl fb-leading-normal md:fb-mt-4 fb-text-gray-700">
        Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer. Placerat in egestas erat...
      </p>
      <Button label="Get Started" as="router-link" to="/" rounded class="!fb-text-xl fb-mt-8 !fb-px-4"></Button>
    </div>
    <div class="fb-flex fb-justify-center md:fb-justify-end">
      <img src="/demo/images/landing/screen-1.png" alt="Hero Image" class="fb-w-9/12 md:fb-w-auto" />
    </div>
  </div>
</template>