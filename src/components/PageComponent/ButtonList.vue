<template>
	<div :class="containerClass" role="group" :aria-orientation="vertical ? 'vertical' : 'horizontal'">
		<FButton
			v-for="(btn, idx) in normalizedButtons"
			:key="btn.key"
			:variant="btn.variant"
			:size="btn.size"
			:rounded="rounded"
			:disabled="btn.disabled"
			:loading="btn.loading"
			:icon="btn.icon"
			:selected="idx === localValue"
			@click="select(idx)"
			class="focus:outline-none"
			type="button"
		>
			<template #default>
				<span>{{ btn.label }}</span>
			</template>
		</FButton>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import FButton from '../Common/FButton.vue'

/**
 * ButtonList
 * Props:
 * - buttons: Array of { key?, label, variant?, size?, disabled?, loading?, icon? }
 * - modelValue: selected index (v-model)
 * - vertical: boolean (stack vertically)
 * - rounded: boolean (pass to FButton)
 * - gap: spacing between buttons (Tailwind spacing class suffix, default '2')
 */

const props = defineProps({
	buttons: { type: Array, default: () => [] },
	modelValue: { type: Number, default: null },
	vertical: { type: Boolean, default: false },
	rounded: { type: Boolean, default: true },
	gap: { type: [String, Number], default: '2' }
})

const emit = defineEmits(['update:modelValue', 'select'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (v) => (localValue.value = v))
watch(localValue, (v) => emit('update:modelValue', v))

const normalizedButtons = computed(() =>
	(props.buttons || []).map((b, i) => ({
		key: b.key ?? b.id ?? i,
		label: b.label ?? String(b ?? ''),
		variant: b.variant ?? 'primary',
		size: b.size ?? 'md',
		disabled: !!b.disabled,
		loading: !!b.loading,
		icon: b.icon ?? null
	}))
)

const containerClass = computed(() =>
	[
		'inline-flex',
		props.vertical ? 'flex-col' : 'flex-row',
		props.vertical ? `space-y-${props.gap}` : `space-x-${props.gap}`,
		'items-center'
	].join(' ')
)

function select(idx) {
	const item = normalizedButtons.value[idx]
	if (!item || item.disabled) return
	localValue.value = idx
	emit('select', idx, item)
}

// basic keyboard navigation (only on focused buttons; FButton keeps native focus)
function focusIndex(idx) {
	const list = Array.from(document.querySelectorAll('[role="group"] button'))
	if (list[idx]) list[idx].focus()
}

onMounted(() => {
	// ensure localValue reflects initial modelValue
	localValue.value = props.modelValue
})
</script>

<style scoped>
/* no extra styles; layout via Tailwind classes */
</style>

