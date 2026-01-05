<script setup>
import FeaturesWidget from '@/components/PageComponent/landing/FeaturesWidget.vue';
import FooterWidget from '@/components/PageComponent/landing/FooterWidget.vue';
import HeroWidget from '@/components/PageComponent/landing/HeroWidget.vue';
import HighlightsWidget from '@/components/PageComponent/landing/HighlightsWidget.vue';
import PricingWidget from '@/components/PageComponent/landing/PricingWidget.vue';
import TopbarWidget from '@/components/PageComponent/landing/TopbarWidget.vue';
</script>

<template>
  <div class="fb-bg-surface-0 dark:fb-bg-surface-900">
    <div id="home" class="landing-wrapper fb-overflow-hidden">
      <div
        class="fb-py-6 fb-px-6 fb-mx-0 md:fb-mx-12 lg:fb-mx-20 lg:fb-px-20 fb-flex fb-items-center fb-justify-between fb-relative lg:fb-static"
      >
        <TopbarWidget />
      </div>
      <HeroWidget />
      <FeaturesWidget />
      <HighlightsWidget />
      <PricingWidget />
      <FooterWidget />
    </div>
  </div>
</template>
