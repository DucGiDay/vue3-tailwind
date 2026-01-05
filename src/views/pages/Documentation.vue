<template>
  <div class="card">
    <div class="fb-font-semibold fb-text-2xl fb-mb-4">Documentation</div>
    <div class="fb-font-semibold fb-text-xl fb-mb-4">Get Started</div>
    <p class="fb-text-lg fb-mb-4">
      Sakai is an application template for Vue based on the
      <a href="https://github.com/vuejs/create-vue" class="fb-font-medium fb-text-primary hover:fb-underline">create-vue</a>, the recommended way to start a
      <strong>Vite-powered</strong> Vue projects. To get started, clone the
      <a href="https://github.com/primefaces/sakai-vue" class="fb-font-medium fb-text-primary hover:fb-underline">repository</a> from GitHub and install the
      dependencies with npm or yarn.
    </p>
    <pre class="app-code">
<code>git clone https://github.com/primefaces/sakai-vue
npm install
npm run dev</code></pre>

    <p class="fb-text-lg fb-mb-4">
      Navigate to <i class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">http://localhost:5173/</i> to view the application in your
      local environment.
    </p>

    <pre class="app-code"><code>npm run dev</code></pre>

    <div class="fb-font-semibold fb-text-xl fb-mb-4">Structure</div>
    <p class="fb-text-lg fb-mb-4">
      Templates consists of a couple folders, demos and layout have been separated so that you can easily remove what is not necessary for your
      application.
    </p>
    <ul class="fb-leading-normal fb-list-disc fb-pl-8 fb-text-lg fb-mb-4">
      <li><span class="fb-text-primary fb-font-medium">src/layout</span>: Main layout files, needs to be present.</li>
      <li><span class="fb-text-primary fb-font-medium">src/views</span>: Demo pages like Dashboard.</li>
      <li><span class="fb-text-primary fb-font-medium">public/demo</span>: Assets used in demos</li>
      <li><span class="fb-text-primary fb-font-medium">src/assets/demo</span>: Styles used in demos</li>
      <li><span class="fb-text-primary fb-font-medium">src/assets/layout</span>: SCSS files of the main layout</li>
    </ul>

    <div class="fb-font-semibold fb-text-xl fb-mb-4">Menu</div>
    <p class="fb-text-lg fb-mb-4">
      Main menu is defined at <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">src/layout/AppMenu.vue</span> file. Update the
      <i class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">model</i> property to define your own menu items.
    </p>

    <div class="fb-font-semibold fb-text-xl fb-mb-4">Layout Composable</div>
    <p class="fb-text-lg fb-mb-4">
      The <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">src/layout/composables/layout.js</span> is a composable that
      manages the layout state changes including dark mode, PrimeVue theme, menu modes and states. If you change the initial values like the preset or
      colors, make sure to apply them at PrimeVue config at main.js as well.
    </p>

    <div class="fb-font-semibold fb-text-xl fb-mb-4">Tailwind CSS</div>
    <p class="fb-text-lg fb-mb-4">The demo pages are developed with Tailwind CSS however the core application shell mainly uses custom CSS.</p>

    <div class="fb-font-semibold fb-text-xl fb-mb-4">Variables</div>
    <p class="fb-text-lg fb-mb-4">
      CSS variables used in the template derive their values from the PrimeVue styled mode presets, use the files under
      <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">assets/layout/_variables.scss</span> to customize according to your
      requirements.
    </p>

    <div class="fb-font-semibold fb-text-xl fb-mb-4">Add Sakai-Vue to a Nuxt Project</div>
    <p class="fb-text-lg fb-mb-4">To get started, create a Nuxt project.</p>
    <pre class="app-code">
<code>npx nuxi@latest init sakai-nuxt</code></pre>

    <p class="fb-text-lg fb-mb-4">Add Prime related libraries to the project.</p>
    <pre class="app-code">
<code>npm install primevue @primevue/themes tailwindcss-primeui primeicons
npm install --save-dev @primevue/nuxt-module</code></pre>

    <p class="fb-text-lg fb-mb-4">
      Add PrimeVue-Nuxt module to <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">nuxt.config.js</span>
    </p>
    <pre class="app-code">
<code>modules: [
    '@primevue/nuxt-module',
]</code></pre>

    <p class="fb-text-lg fb-mb-4">
      Install <a href="https://tailwindcss.com/docs/guides/nuxtjs" class="fb-font-medium fb-text-primary hover:fb-underline">Tailwind CSS</a> with Nuxt using
      official documentation.
    </p>

    <p class="fb-text-lg fb-mb-4">
      Add <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">tailwindcss-primeui</span> package as a plugin to
      <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">tailwind.config.js</span>
    </p>
    <pre class="app-code">
<code>plugins: [require('tailwindcss-primeui')]</code></pre>

    <p class="fb-text-lg fb-mb-4">Add PrimeVue to in <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">nuxt.config.js</span></p>
    <pre class="app-code">
<code>import Aura from '@primevue/themes/aura';

primevue: {
    options: {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.app-dark'
            }
        }
    }
}</code></pre>

    <p class="fb-text-lg fb-mb-4">
      Copy <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">src/assets</span> folder and paste them to
      <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">assets</span> folder to your Nuxt project. And add to
      <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">nuxt.config.js</span>
    </p>
    <pre class="app-code">
<code>css: ['~/assets/tailwind.css', '~/assets/styles.scss']</code></pre>

    <p class="fb-text-lg fb-mb-4">Change <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">app.vue</span></p>
    <pre class="app-code">
<code>&lt;template&gt;
    &lt;NuxtLayout&gt;
        &lt;NuxtPage /&gt;
    &lt;/NuxtLayout&gt;
&lt;/template&gt;</code></pre>

    <p class="fb-text-lg fb-mb-4">
      Create <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">layouts/default.vue</span> and paste this code:
    </p>
    <pre class="app-code">
<code>&lt;script setup&gt;
import AppLayout from './AppLayout.vue';
&lt;/script&gt;

&lt;template&gt;
    &lt;AppLayout /&gt;
&lt;/template&gt;</code></pre>

    <p class="fb-text-lg fb-mb-4">
      Create <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">layouts</span> folder and copy
      <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">src/layout</span> folder and paste them. And then create
      <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">composables/use-layout.vue</span> and replace it with
      <span class="bg-highlight fb-px-2 fb-py-1 fb-rounded-border fb-not-italic fb-text-base">src/layout/composables/layout.js</span>. Then remove this line:
    </p>
    <pre class="app-code">
<code>import { useLayout } from '@/layout/composables/layout';</code></pre>

    <p class="fb-text-lg fb-mb-4">As a final step, copy the following folders:</p>
    <ul class="fb-leading-normal fb-list-disc fb-pl-8 fb-text-lg fb-mb-4">
      <li>
        <span class="fb-text-primary fb-font-medium">public/demo</span> <i class="pi pi-arrow-right !fb-text-sm fb-mr-1"></i>
        <span class="fb-text-primary fb-font-medium">public</span>
      </li>
      <li>
        <span class="fb-text-primary fb-font-medium">src/components</span> <i class="pi pi-arrow-right !fb-text-sm fb-mr-1"></i>
        <span class="fb-text-primary fb-font-medium">components</span>
      </li>
      <li>
        <span class="fb-text-primary fb-font-medium">src/service</span> <i class="pi pi-arrow-right !fb-text-sm fb-mr-1"></i>
        <span class="fb-text-primary fb-font-medium">service</span>
      </li>
      <li>
        <span class="fb-text-primary fb-font-medium">src/views/uikit</span> <i class="pi pi-arrow-right !fb-text-sm fb-mr-1"></i>
        <span class="fb-text-primary fb-font-medium">pages/uikit</span>
      </li>
      <li>
        <span class="fb-text-primary fb-font-medium">src/views/pages</span> <i class="pi pi-arrow-right !fb-text-sm fb-mr-1"></i>
        <span class="fb-text-primary fb-font-medium">pages</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
  .video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>