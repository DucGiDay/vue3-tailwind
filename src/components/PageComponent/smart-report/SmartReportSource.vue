<template>
  <div
    class="fb-flex fb-flex-col fb-w-[18.75rem] fb-min-w-[18.75rem] fb-border-l fb-border-[#e9eaeb] fb-bg-white fb-overflow-hidden"
  >
    <!-- Header -->
    <div class="fb-px-4 fb-py-3 fb-flex fb-items-center fb-justify-between fb-border-b fb-border-[#e9eaeb]">
      <span class="fb-text-sm fb-font-semibold">Nguồn</span>
      <Button text severity="secondary" size="small">
        <IconClose />
      </Button>
    </div>

    <!-- Content -->
    <div class="fb-flex-1 fb-overflow-y-auto fb-px-4 fb-py-4 fb-flex fb-flex-col fb-gap-4 custom-scrollbar">
      <!-- AI text content -->
      <div class="fb-text-sm fb-text-gray-700 fb-leading-relaxed">
        <slot>
          <p class="fb-mb-2">
            Ngày 01/01 (Tết Dương lịch) làm nhịp mua sắm thay đổi so với ngày thường.
          </p>
          <p class="fb-mb-2">
            Đa một phần khách di chơi hoặc di chuyển, cửa hàng gần khu dân cư vẫn nhận nhu cầu mua
            cho gia đình/nhóm bạn tăng.
          </p>
          <p>
            So với 01/12 (Thứ Hai – đầu tuần), khi hành vi mua thường là đơn lẻ, "vừa đủ", 01/01
            hình thành 2 cum cao điểm rõ rệt, trong đó 13–14h nổi bật hơn.
          </p>
        </slot>
      </div>

      <!-- Source links — dùng <a> vì đây là navigation link thực sự (semantic HTML) -->
      <div class="fb-flex fb-flex-col fb-gap-2">
        <a
          v-for="source in sources"
          :key="source.id"
          :href="source.url || '#'"
          target="_blank"
          rel="noreferrer"
          class="fb-flex fb-items-center fb-justify-between fb-px-3 fb-py-2.5 fb-rounded-lg fb-border fb-border-[#e9eaeb] fb-bg-gray-50 hover:fb-bg-gray-100 fb-transition-colors fb-duration-150 fb-no-underline"
        >
          <span class="fb-text-[0.8125rem] fb-font-medium fb-text-gray-800">{{ source.name }}</span>
          <i class="pi pi-chevron-right fb-text-gray-400 fb-text-xs"></i>
        </a>

        <!-- Fallback nếu không có sources prop -->
        <a
          v-if="!sources.length"
          href="#"
          class="fb-flex fb-items-center fb-justify-between fb-px-3 fb-py-2.5 fb-rounded-lg fb-border fb-border-[#e9eaeb] fb-bg-gray-50 hover:fb-bg-gray-100 fb-transition-colors fb-duration-150 fb-no-underline"
        >
          <span class="fb-text-[0.8125rem] fb-font-medium fb-text-gray-800">
            Xem chi tiết báo cáo B05
          </span>
          <i class="pi pi-chevron-right fb-text-gray-400 fb-text-xs"></i>
        </a>
      </div>
    </div>

    <!-- Footer action -->
    <div class="fb-px-4 fb-py-3 fb-border-t fb-border-[#e9eaeb]">
      <Button
        text
        severity="secondary"
        size="small"
        icon="pi pi-download"
        v-tooltip.top="'Tải xuống'"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  sources: {
    type: Array,
    default: () => []
  }
});
</script>
