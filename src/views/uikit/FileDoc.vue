<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const fileupload = ref();

function upload() {
  fileupload.value.upload();
}

function onUpload() {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}
</script>

<template>
  <div class="fb-grid fb-grid-cols-12 fb-gap-8">
    <div class="fb-col-span-full lg:fb-col-span-6">
      <div class="card">
        <div class="fb-font-semibold fb-text-xl fb-mb-4">Advanced</div>
        <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload />
      </div>
    </div>
    <div class="fb-col-span-full lg:fb-col-span-6">
      <div class="card">
        <div class="fb-font-semibold fb-text-xl fb-mb-4">Basic</div>
        <div class="card fb-flex fb-flex-col fb-gap-6 fb-items-center fb-justify-center">
          <Toast />
          <FileUpload ref="fileupload" mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000" @uploader="onUpload" customUpload />
          <Button label="Upload" @click="upload" severity="secondary" />
        </div>
      </div>
    </div>
  </div>
</template>