<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  root: {
    type: Boolean,
    default: true
  },
  parentItemKey: {
    type: String,
    default: null
  }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onMounted(() => {
  if (props.item.to && checkActiveRoute(props.item)) {
    setActiveMenuItem(itemKey.value);
  }
});

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index);

  const activeItem = layoutState.activeMenuItem;

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false;
});

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    isActiveMenu.value =
      newVal === itemKey.value || (newVal && newVal.startsWith(itemKey.value + '-'));
  }
);

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  if (
    (item.to || item.url) &&
    (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)
  ) {
    toggleMenu();
  }

  if (item.command) {
    item.command({ originalEvent: event, item: item });
  }

  if (item.items && !isActiveMenu.value && !isAnyChildActive(item)) {
    const firstChild = item.items.find((i) => i.to && i.visible !== false);
    if (firstChild) {
      router.push(firstChild.to);
    }
  }

  onActiveMenu(item);
}

function isAnyChildActive(item) {
  if (!item.items) return false;
  return item.items.some((child) => {
    if (checkActiveRoute(child)) return true;
    if (child.items) return isAnyChildActive(child);
    return false;
  });
}

const onActiveMenu = (item) => {
  const foundItemKey = item.items
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey
    : itemKey.value;

  setActiveMenuItem(foundItemKey);
};

function checkActiveRoute(item) {
  return route.path === item.to || (item?.startWith && route.fullPath.startsWith(item.startWith));
}
</script>

<template>
  <li
    :class="[
      { 'fb-border-l fb-ml-5': item.grandchild },
      { 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }
    ]"
  >
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">
      {{ item.label }}
    </div>
    <a
      v-if="(!item.to || item.items) && item.visible !== false"
      :href="item.url"
      @click="itemClick($event, item, index)"
      :class="item.class"
      :target="item.target"
      tabindex="0"
      class="fb-border-l-[6px] fb-border-l-[transparent] fb-font-medium fb-rounded-md fb-flex fb-items-center fb-justify-between"
    >
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <IconChevronRight
        :class="[
          isActiveMenu ? 'fb-rotate-[270deg]' : 'fb-rotate-[90deg]',
          'fb-transition-transform'
        ]"
      />
    </a>
    <router-link
      v-if="item.to && !item.items && item.visible !== false"
      @click="itemClick($event, item, index)"
      :class="[
        'fb-border-l-[6px] fb-border-l-[transparent] fb-font-medium fb-rounded-md',
        item.class,
        { 'active-route fb-border-l-primary': checkActiveRoute(item) }
      ]"
      tabindex="0"
      :to="item.to"
    >
      <span class="layout-menuitem-text">{{ item.label }}</span>
    </router-link>
    <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
      <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
        <app-menu-item
          v-for="(child, i) in item.items"
          :key="child"
          :index="i"
          :item="child"
          :parentItemKey="itemKey"
          :root="false"
        ></app-menu-item>
      </ul>
    </Transition>
  </li>
</template>

<style lang="scss" scoped></style>
