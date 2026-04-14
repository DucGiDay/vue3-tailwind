<template>
  <div class="fb-flex fb-flex-col fb-h-full fb-w-full">
    <div class="fb-shrink-0 fb-mb-4">
      <!-- Title row: title + actions -->
      <div
        v-if="!!title || !!$slots['header-actions']"
        class="fb-flex fb-justify-between fb-items-center fb-mb-6"
      >
        <div class="fb-flex fb-items-center fb-space-x-3">
          <h4 class="!fb-m-0">{{ title }}</h4>
        </div>
        <div class="fb-flex fb-justify-end fb-gap-2">
          <slot name="header-actions" />
        </div>
      </div>

      <!-- Filter/Toolbar row: override entirely with #toolbar, or use #filters + #search for simple cases -->
      <slot name="toolbar">
        <div class="fb-flex fb-flex-wrap fb-gap-3 fb-justify-between fb-items-center">
          <div class="fb-flex fb-flex-wrap fb-gap-3 fb-items-center">
            <slot name="filters" />
          </div>
          <div>
            <slot name="search">
              <IconField>
                <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="fb-h-[1rem]"
                  >
                    <path
                      d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
                      stroke="#A4A7AE"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
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
    default: ''
  },
  searchValue: {
    type: String,
    default: null
  },
  searchPlaceholder: {
    type: String,
    default: 'Tìm kiếm...'
  }
});

const emit = defineEmits(['update:searchValue', 'search']);

const onInput = (event) => {
  emit('update:searchValue', event.target.value);
  emit('search');
};
</script>
