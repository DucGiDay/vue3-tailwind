<template>
  <Dialog
    v-model:visible="visible"
    header="Gửi lại email"
    modal
    :style="{ width: '70vw' }"
    :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
  >
    <Fluid class="fb-space-y-5">
      <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-8 fb-gap-4">
        <label class="fb-col-span-1 md:fb-col-span-2 fb-text-sm fb-font-medium fb-text-gray-700">
          Email người nhận
          <span class="fb-text-error">*</span>
        </label>
        <div class="fb-col-span-1 md:fb-col-span-6">
          <IconField>
            <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
              <IconMail />
            </InputIcon>
            <InputText
              v-model="emailPayload.email"
              class="fb-w-full"
              size="small"
              placeholder="ipos.vn@gmail.com"
              :invalid="!!error['email']"
              @input="delete error['email']"
            />
          </IconField>
          <Message v-if="error['email']" severity="error" size="small" variant="simple">
            {{ error['email'] }}
          </Message>
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-5 md:fb-grid-cols-8 fb-gap-4">
        <label class="fb-col-span-5 md:fb-col-span-2 fb-text-sm fb-font-medium fb-text-gray-700">
          Danh sách email cc
          <span class="fb-text-error">*</span>
        </label>
        <div class="fb-col-span-4 md:fb-col-span-5">
          <IftaLabel>
            <AutoComplete
              v-model="emailPayload.cc"
              inputId="multiple-ac-2"
              multiple
              fluid
              :typeahead="false"
              :invalid="!!error['cc']"
              @input="delete error['cc']"
              @paste="handlePaste"
            />

            <label for="multiple-ac-2">Nhập email và nhấn phím Enter để thêm</label>
          </IftaLabel>
          <Message v-if="error['cc']" severity="error" size="small" variant="simple">
            {{ error['cc'] }}
          </Message>
        </div>
        <div
          class="fb-col-span-1 fb-flex fb-gap-2 fb-text-primary fb-cursor-pointer"
          @click="handleCopy"
        >
          <IconCopy />
          Sao chép
        </div>
      </div>
    </Fluid>

    <template #footer>
      <Button label="Đóng" severity="secondary" size="small" raised @click="visible = false" />
      <Button label="Gửi ngay" size="small" raised @click="handleResendEmail" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconMail from '@/components/Common/Icon/IconMail.vue';
import IconCopy from '@/components/Common/Icon/IconCopy.vue';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  visible: {
    type: [Object, Boolean],
    default: null
  }
});

const emit = defineEmits(['update:visible', 'send']);

const visible = computed({
  get: () => !!props.visible,
  set: (val) => emit('update:visible', val)
});

const emailPayload = ref({
  email: '',
  cc: []
});
const error = ref({});
const toast = useToast();

const handleCopy = async () => {
  try {
    const textToCopy = emailPayload.value.cc.join(', ');
    if (!textToCopy) {
      toast.add({ severity: 'warn', summary: 'Không có email CC để sao chép', life: 3000 });
      return;
    }
    await navigator.clipboard.writeText(textToCopy);
    toast.add({ severity: 'success', summary: 'Đã sao chép danh sách email CC', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Sao chép thất bại', life: 3000 });
  }
};

const handlePaste = (event) => {
  const pasteData = event.clipboardData?.getData('text');
  if (pasteData) {
    event.preventDefault();
    
    const emails = pasteData
      .split(/[,\s;]+/)
      .map((email) => email.trim())
      .filter((email) => email !== '');

    if (emails.length > 0) {
      const newCcList = [...(emailPayload.value.cc || [])];
      
      emails.forEach((email) => {
        if (!newCcList.includes(email)) {
          newCcList.push(email);
        }
      });
      
      emailPayload.value.cc = newCcList;
      delete error.value['cc'];
    }
  }
};

const handleResendEmail = () => {
  // Reset lỗi
  error.value = {};

  // Validate email
  if (!emailPayload.value.email) {
    error.value.email = 'Vui lòng nhập email người nhận';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPayload.value.email)) {
    error.value.email = 'Email không đúng định dạng';
  } else if (
    emailPayload.value.cc.length &&
    emailPayload.value.cc.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    error.value.cc = 'Email không đúng định dạng';
  }

  if (Object.keys(error.value).length > 0) return;

  emit('send', { ...props.visible, ...emailPayload.value, cc: emailPayload.value.cc.join(',') });
  visible.value = false;
  emailPayload.value = {
    email: '',
    cc: []
  };
};
</script>
