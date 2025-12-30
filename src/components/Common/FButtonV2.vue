<template>
  <button
    type="button"
    :class="buttonClasses"
    :disabled="disabled"
    :aria-disabled="disabled"
    :aria-label="computedAriaLabel"
    @click="onClick"
  >
    <!-- Left icon slot / prop -->
    <span
      v-if="hasIconLeft"
      class="w-5 h-5 flex items-center justify-center flex-shrink-0"
    >
      <img
        v-if="iconLeft"
        :src="iconLeft"
        alt=""
        class="w-full h-full object-contain"
      />
      <slot name="icon-left" />
    </span>

    <!-- Text / default slot -->
    <span v-if="!iconOnly" class="px-[2px] py-0 leading-[20px]">
      <slot>
        <span>{{ label }} </span>
      </slot>
    </span>

    <!-- Right icon slot / prop -->
    <span
      v-if="hasIconRight"
      class="w-5 h-5 flex items-center justify-center flex-shrink-0"
    >
      <img
        v-if="iconRight"
        :src="iconRight"
        alt=""
        class="w-full h-full object-contain"
      />
      <slot name="icon-right" />
    </span>
  </button>
</template>

<script setup>
import { computed, useSlots } from "vue";

const props = defineProps({
  label: { type: String, default: "Button" },
  size: { type: String, default: "sm" },
  variant: { type: String, default: "primary" },
  iconLeft: { type: String, default: "" },
  iconRight: { type: String, default: "" },
  iconOnly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits(["click"]);
const slots = useSlots();

const hasIconLeft = computed(() => !!props.iconLeft || !!slots["icon-left"]);
const hasIconRight = computed(() => !!props.iconRight || !!slots["icon-right"]);

const onClick = (e) => {
  if (props.disabled) return;
  emit("click", e);
};

const computedAriaLabel = computed(() => {
  // When iconOnly is true, ensure there's an aria-label
  if (props.iconOnly) return props.ariaLabel || props.label || "button";
  return undefined;
});

const variantClass = computed(() => {
  let vClass = "";
  switch (props.variant) {
    case "primary":
      vClass = "bg-primary text-white";
      break;

    default:
      vClass = "bg-gray-200 text-gray-800";
      break;
  }
  return vClass;
});

const buttonClasses = computed(() => {
  const base =
    "inline-flex items-center justify-center gap-[6px] rounded-[8px] px-[12px] py-[8px] text-[14px] font-[600] leading-[20px]";

  const disabledClass = props.disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";
  return `${base} ${variantClass.value} ${disabledClass} fbtnv2-shadow`;
});
</script>

<style scoped>
.fbtnv2-shadow {
  /* exact inset shadows from the design preview */
  box-shadow: inset 0px -2px 0px 0px rgba(39, 39, 39, 0.35),
    inset 1.2px 0px 0px 0px rgba(255, 255, 255, 0.15),
    inset -1.2px 0px 0px 0px rgba(255, 255, 255, 0.15),
    inset 0px 1.2px 0px 0px rgba(255, 255, 255, 0.48);
}

button {
  -webkit-tap-highlight-color: transparent;
  border: none;
}

/* ensure images inside icons don't stretch */
.fbtnv2-icon img {
  display: block;
}
</style>

