<script setup>
import { ref } from 'vue';

const dropdownItems = ref([
  { name: 'Option 1', code: 'Option 1' },
  { name: 'Option 2', code: 'Option 2' },
  { name: 'Option 3', code: 'Option 3' }
]);

const dropdownItem = ref(null);
</script>

<template>
  <Fluid>
    <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-8">
      <div class="md:fb-w-1/2">
        <div class="card fb-flex fb-flex-col fb-gap-4">
          <div class="fb-font-semibold fb-text-xl">Vertical</div>
          <div class="fb-flex fb-flex-col fb-gap-2">
            <label for="name1">Name</label>
            <InputText id="name1" type="text" />
          </div>
          <div class="fb-flex fb-flex-col fb-gap-2">
            <label for="email1">Email</label>
            <InputText id="email1" type="text" />
          </div>
          <div class="fb-flex fb-flex-col fb-gap-2">
            <label for="age1">Age</label>
            <InputText id="age1" type="text" />
          </div>
        </div>

        <div class="card fb-flex fb-flex-col fb-gap-4">
          <div class="fb-font-semibold fb-text-xl">Vertical Grid</div>
          <div class="fb-flex fb-flex-wrap fb-gap-4">
            <div class="fb-flex fb-flex-col fb-grow fb-basis-0 fb-gap-2">
              <label for="name2">Name</label>
              <InputText id="name2" type="text" />
            </div>
            <div class="fb-flex fb-flex-col fb-grow fb-basis-0 fb-gap-2">
              <label for="email2">Email</label>
              <InputText id="email2" type="text" />
            </div>
          </div>
        </div>
      </div>
      <div class="md:fb-w-1/2">
        <div class="card fb-flex fb-flex-col fb-gap-4">
          <div class="fb-font-semibold fb-text-xl">Horizontal</div>
          <div class="fb-grid fb-grid-cols-12 fb-gap-2">
            <label for="name3" class="fb-flex fb-items-center fb-col-span-12 fb-mb-2 md:fb-col-span-2 md:fb-mb-0">Name</label>
            <div class="fb-col-span-12 md:fb-col-span-10">
              <InputText id="name3" type="text" />
            </div>
          </div>
          <div class="fb-grid fb-grid-cols-12 fb-gap-2">
            <label for="email3" class="fb-flex fb-items-center fb-col-span-12 fb-mb-2 md:fb-col-span-2 md:fb-mb-0">Email</label>
            <div class="fb-col-span-12 md:fb-col-span-10">
              <InputText id="email3" type="text" />
            </div>
          </div>
        </div>

        <div class="card fb-flex fb-flex-col fb-gap-4">
          <div class="fb-font-semibold fb-text-xl">Inline</div>
          <div class="fb-flex fb-flex-wrap fb-items-start fb-gap-4">
            <div class="field">
              <label for="firstname1" class="fb-sr-only">Firstname</label>
              <InputText id="firstname1" type="text" placeholder="Firstname" />
            </div>
            <div class="field">
              <label for="lastname1" class="fb-sr-only">Lastname</label>
              <InputText id="lastname1" type="text" placeholder="Lastname" />
            </div>
            <Button label="Submit" :fluid="false"></Button>
          </div>
        </div>
        <div class="card fb-flex fb-flex-col fb-gap-4">
          <div class="fb-font-semibold fb-text-xl">Help Text</div>
          <div class="fb-flex fb-flex-wrap fb-gap-2">
            <label for="username">Username</label>
            <InputText id="username" type="text" />
            <small>Enter your username to reset your password.</small>
          </div>
        </div>
      </div>
    </div>

    <div class="fb-flex fb-mt-8">
      <div class="card fb-flex fb-flex-col fb-gap-4 fb-w-full">
        <div class="fb-font-semibold fb-text-xl">Advanced</div>
        <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
          <div class="fb-flex fb-flex-wrap fb-gap-2 fb-w-full">
            <label for="firstname2">Firstname</label>
            <InputText id="firstname2" type="text" />
          </div>
          <div class="fb-flex fb-flex-wrap fb-gap-2 fb-w-full">
            <label for="lastname2">Lastname</label>
            <InputText id="lastname2" type="text" />
          </div>
        </div>

        <div class="fb-flex fb-flex-wrap">
          <label for="address">Address</label>
          <Textarea id="address" rows="4" />
        </div>

        <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
          <div class="fb-flex fb-flex-wrap fb-gap-2 fb-w-full">
            <label for="state">State</label>
            <Select id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="fb-w-full"></Select>
          </div>
          <div class="fb-flex fb-flex-wrap fb-gap-2 fb-w-full">
            <label for="zip">Zip</label>
            <InputText id="zip" type="text" />
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>