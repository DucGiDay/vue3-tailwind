<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Home</h1>
    <p class="mt-4">This is the home page. Use the links to navigate.</p>
    <div class="mt-6 space-x-4">
      <router-link to="/users" class="text-blue-600">Users</router-link>
      <router-link to="/reports" class="text-blue-600">Reports</router-link>
    </div>

    <f-button>heno</f-button>
    <f-button-v2>heno</f-button-v2>
    <!-- <f-button-v2-demo>heno</f-button-v2-demo> -->
  </div>
</template>

<script setup>

import FButton from "@/components/Common/FButton.vue";
import FButtonV2 from "@/components/Common/FButtonV2.vue";
import FButtonV2Demo from "@/components/Common/FButtonV2Demo.vue";
import ButtonList from "./ButtonList.vue";
import { ref } from "vue";

// Demo button arrays
const buttons = [
  { label: "Save", variant: "primary" },
  { label: "Edit", variant: "secondary" },
  { label: "Delete", variant: "danger", disabled: false },
  { label: "More", variant: "ghost", size: "sm" },
];

const verticalButtons = [
  { label: "First", variant: "primary" },
  { label: "Second", variant: "secondary", disabled: true },
  { label: "Third", variant: "primary" },
];

const selectedIndex = ref(null);
const verticalSelected = ref(0);
</script>
