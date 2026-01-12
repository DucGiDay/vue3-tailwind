<script setup>
import { useRoute } from 'vue-router';

import AppMenuItem from './AppMenuItem.vue';

const route = useRoute();

const modelExample = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
  },
  {
    label: 'UI Components',
    items: [
      { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
      { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
      { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
      { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
      { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
      { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
      { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
      { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
      { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
      { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
      { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
      { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
      { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
      { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
      { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
    ]
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/landing'
      },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/auth/login'
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/auth/error'
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/auth/access'
          }
        ]
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        to: '/pages/crud'
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/pages/notfound'
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/pages/empty'
      }
    ]
  },
  {
    label: 'Hierarchy',
    items: [
      {
        label: 'Submenu 1',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 1.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            ]
          },
          {
            label: 'Submenu 1.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
          }
        ]
      },
      {
        label: 'Submenu 2',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 2.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            ]
          },
          {
            label: 'Submenu 2.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
          }
        ]
      }
    ]
  },
  {
    label: 'Get Started',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        to: '/pages/documentation'
      },
      {
        label: 'View Source',
        icon: 'pi pi-fw pi-github',
        url: 'https://github.com/primefaces/sakai-vue',
        target: '_blank'
      }
    ]
  }
]);

// const model = ref([
//   {
//     label: 'Cashier',
//     items: [
//       {
//         label: 'Sale Report',
//         icon: 'pi pi-fw pi-money-bill',
//         to: '/sale-report'
//       }
//     ]
//   },
//   {
//     label: 'Customer',
//     items: [
//       {
//         label: 'List Customer',
//         icon: 'pi pi-fw pi-users',
//         to: '/customer'
//       }
//     ]
//   },
//   {
//     label: 'Store',
//     items: [
//       {
//         label: 'List Store',
//         icon: 'pi pi-fw pi-shop',
//         to: '/store',
//         startWith: '/store/' // highlight khi path bắt đầu băng key này
//       },
//       {
//         label: 'List Product',
//         icon: 'pi pi-fw pi-database',
//         to: '/product',
//         startWith: '/product/'
//       },
//       {
//         label: 'List Category',
//         icon: 'pi pi-fw pi-list',
//         to: '/category',
//         startWith: '/category/'
//       }
//     ]
//   },
//   {
//     label: 'Staff',
//     items: [
//       {
//         label: 'User',
//         icon: 'pi pi-fw pi-user',
//         items: [
//           {
//             label: 'List User',
//             icon: 'pi pi-fw pi-users',
//             to: '/user'
//           },
//           {
//             label: 'Create User',
//             icon: 'pi pi-fw pi-user-plus',
//             to: '/user'
//           }
//         ]
//       },
//       {
//         label: 'Shift Calendar',
//         icon: 'pi pi-fw pi-calendar-clock',
//         to: '/shift-calendar'
//       }
//     ]
//   },
//   {
//     label: 'Other',
//     items: [
//       {
//         label: 'Banner',
//         icon: 'pi pi-fw pi-images',
//         to: '/banner'
//       }
//     ]
//   },
//   {
//     label: 'Get Started',
//     items: [
//       {
//         label: 'Documentation',
//         icon: 'pi pi-fw pi-book',
//         to: '/pages/documentation'
//       }
//     ]
//   }
// ]);

const listItems = computed(() => {
  // if (route.fullPath.startsWith('/uikit/') || route.fullPath.startsWith('/pages/')) return modelExample.value;
  // else return model.value;

  return modelExample.value;
});
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in listItems" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>