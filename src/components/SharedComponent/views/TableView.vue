<template>
  <div class="fb-flex fb-flex-col fb-h-full fb-w-full">
    <div class="fb-shrink-0 fb-mb-4">
      <!-- Title row: title + actions -->
      <div
        v-if="!!title || !!$slots['header-actions']"
        class="fb-flex fb-justify-between fb-items-center fb-mb-6"
      >
        <div class="fb-flex fb-items-center fb-space-x-3">
          <h5 class="!fb-m-0 !fb-text-lg !fb-font-semibold">{{ title }}</h5>
        </div>
        <div class="fb-flex fb-justify-end fb-gap-2">
          <slot name="header-actions" />
        </div>
      </div>

      <!-- Filter/Toolbar row: override entirely with #toolbar, or use #filters + #search for simple cases -->
      <slot name="toolbar">
        <div class="fb-flex fb-flex-wrap fb-gap-3 fb-justify-between fb-items-end">
          <div class="fb-flex-1 fb-flex fb-flex-wrap fb-gap-3 fb-items-center">
            <slot name="filters" />
          </div>
          <div class="fb-flex-shrink-0 fb-flex fb-flex-wrap fb-gap-3 fb-items-center fb-ml-auto">
            <slot v-if="searchable" name="search">
              <IconField>
                <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
                  <IconSearch />
                </InputIcon>
                <InputText
                  :modelValue="searchValue"
                  :placeholder="searchPlaceholder"
                  class="fb-w-full md:fb-w-72"
                  size="small"
                  @input="onInput"
                />
              </IconField>
            </slot>
          </div>
        </div>
      </slot>
    </div>

    <!-- Table area -->
    <div class="fb-w-full fb-flex-1 fb-flex fb-flex-col fb-min-h-[28rem]">
      <slot name="table" />
    </div>
  </div>

  <!-- Extra content outside main layout (modals, dialogs, etc.) -->
  <slot name="extra" />
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  searchValue: {
    type: String,
    default: null,
  },
  searchPlaceholder: {
    type: String,
    default: 'Tìm kiếm...',
  },
  searchable: {
    type: Boolean,
    default: true,
  },
});

const home = ref({
  label: 'Home',
});
const items = ref([
  { label: 'Electronics' },
  { label: 'Computer' },
  { label: 'Accessories' },
  { label: 'Keyboard' },
  { label: 'Wireless' },
]);

const emit = defineEmits(['update:searchValue', 'search']);

const onInput = (event) => {
  emit('update:searchValue', event.target.value);
  emit('search');
};
</script>
