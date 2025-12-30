<template>
  <button
    :class="[
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      {
        'opacity-50 cursor-not-allowed pointer-events-none':
          disabled || loading,
      },
      customClasses,
    ]"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading ? 'true' : 'false'"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="inline-flex items-center justify-center mr-2">
      <svg
        class="animate-spin h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </span>

    <span
      v-if="!loading && ($slots['icon-left'] || leftIcon)"
      class="inline-flex items-center mr-2"
    >
      <component
        v-if="leftIcon && !$slots['icon-left']"
        :is="leftIcon"
        class="w-4 h-4"
      />
      <slot name="icon-left" />
    </span>

    <span class="inline-flex items-center justify-center">
      <slot />
    </span>

    <span
      v-if="!loading && ($slots['icon-right'] || rightIcon)"
      class="inline-flex items-center ml-2"
    >
      <slot name="icon-right" />
      <component
        v-if="rightIcon && !$slots['icon-right']"
        :is="rightIcon"
        class="w-4 h-4"
      />
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary", "ghost", "danger"].includes(v),
  },
  size: {
    type: String,
    default: "md",
    validator: (s) => ["sm", "md", "lg", "xl"].includes(s),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  leftIcon: {
    type: [Object, Function, String],
    default: null,
  },
  rightIcon: {
    type: [Object, Function, String],
    default: null,
  },
  customClasses: {
    type: [Object, String],
    default: null,
  },
  type: {
    type: String,
    default: "button",
  },
});

const emit = defineEmits(["click"]);

function handleClick(e) {
  if (props.disabled || props.loading) {
    e.preventDefault();
    return;
  }
  emit("click", e);
}

const baseClasses =
  "inline-flex items-center rounded-lg font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2";

const variantClasses = {
  primary: "bg-primary text-white hover:bg-brand-700 focus:ring-brand-500",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  danger: "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500",
};

const sizeClasses = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2.5 text-base",
  xl: "px-6 py-3 text-lg",
};
</script>

