<script setup>
import { CountryService } from '@/service/CountryService';
import { NodeService } from '@/service/NodeService';
import { onMounted, ref } from 'vue';

const floatValue = ref(null);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const calendarValue = ref(null);
const inputNumberValue = ref(null);
const sliderValue = ref(50);
const ratingValue = ref(null);
const colorValue = ref('#1976D2');
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const listboxValues = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
]);
const listboxValue = ref(null);
const dropdownValues = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
]);
const dropdownValue = ref(null);
const multiselectValues = ref([
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'China', code: 'CN' },
  { name: 'Egypt', code: 'EG' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'India', code: 'IN' },
  { name: 'Japan', code: 'JP' },
  { name: 'Spain', code: 'ES' },
  { name: 'United States', code: 'US' }
]);

const multiselectValue = ref(null);
const toggleValue = ref(false);
const selectButtonValue = ref(null);
const selectButtonValues = ref([{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]);
const knobValue = ref(50);
const inputGroupValue = ref(false);
const treeSelectNodes = ref(null);
const selectedNode = ref(null);

onMounted(() => {
  CountryService.getCountries().then((data) => (autoValue.value = data));
  NodeService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

function searchCountry(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      autoFilteredValue.value = [...autoValue.value];
    } else {
      autoFilteredValue.value = autoValue.value.filter((country) => {
        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
}
</script>

<template>
  <Fluid class="fb-flex fb-flex-col md:fb-flex-row fb-gap-8">
    <div class="md:fb-w-1/2">
      <div class="card fb-flex fb-flex-col fb-gap-4">
        <div class="fb-font-semibold fb-text-xl">InputText</div>
        <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
          <InputText type="text" placeholder="Default" />
          <InputText type="text" placeholder="Disabled" :disabled="true" />
          <InputText type="text" placeholder="Invalid" invalid />
        </div>

        <div class="fb-font-semibold fb-text-xl">Icons</div>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText type="text" placeholder="Username" />
        </IconField>
        <IconField iconPosition="left">
          <InputText type="text" placeholder="Search" />
          <InputIcon class="pi pi-search" />
        </IconField>

        <div class="fb-font-semibold fb-text-xl">Float Label</div>
        <FloatLabel>
          <InputText id="username" type="text" v-model="floatValue" />
          <label for="username">Username</label>
        </FloatLabel>

        <div class="fb-font-semibold fb-text-xl">Textarea</div>
        <Textarea placeholder="Your Message" :autoResize="true" rows="3" cols="30" />

        <div class="fb-font-semibold fb-text-xl">AutoComplete</div>
        <AutoComplete
          v-model="selectedAutoValue"
          :suggestions="autoFilteredValue"
          optionLabel="name"
          placeholder="Search"
          dropdown
          multiple
          display="chip"
          @complete="searchCountry($event)"
        />

        <div class="fb-font-semibold fb-text-xl">DatePicker</div>
        <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>

        <div class="fb-font-semibold fb-text-xl">InputNumber</div>
        <InputNumber v-model="inputNumberValue" showButtons mode="decimal"></InputNumber>
      </div>

      <div class="card fb-flex fb-flex-col fb-gap-4">
        <div class="fb-font-semibold fb-text-xl">Slider</div>
        <InputText v-model.number="sliderValue" />
        <Slider v-model="sliderValue" />

        <div class="fb-flex fb-flex-row fb-mt-6">
          <div class="fb-flex fb-flex-col fb-gap-4 fb-w-1/2">
            <div class="fb-font-semibold fb-text-xl">Rating</div>
            <Rating v-model="ratingValue" />
          </div>
          <div class="fb-flex fb-flex-col fb-gap-4 fb-w-1/2">
            <div class="fb-font-semibold fb-text-xl">ColorPicker</div>
            <ColorPicker style="width: 2rem" v-model="colorValue" />
          </div>
        </div>

        <div class="fb-font-semibold fb-text-xl">Knob</div>
        <Knob v-model="knobValue" :step="10" :min="-50" :max="50" valueTemplate="{value}%" />
      </div>
    </div>
    <div class="md:fb-w-1/2">
      <div class="card fb-flex fb-flex-col fb-gap-4">
        <div class="fb-font-semibold fb-text-xl">RadioButton</div>
        <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
          <div class="fb-flex fb-items-center">
            <RadioButton id="option1" name="option" value="Chicago" v-model="radioValue" />
            <label for="option1" class="fb-leading-none fb-ml-2">Chicago</label>
          </div>
          <div class="fb-flex fb-items-center">
            <RadioButton id="option2" name="option" value="Los Angeles" v-model="radioValue" />
            <label for="option2" class="fb-leading-none fb-ml-2">Los Angeles</label>
          </div>
          <div class="fb-flex fb-items-center">
            <RadioButton id="option3" name="option" value="New York" v-model="radioValue" />
            <label for="option3" class="fb-leading-none fb-ml-2">New York</label>
          </div>
        </div>

        <div class="fb-font-semibold fb-text-xl">Checkbox</div>
        <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
          <div class="fb-flex fb-items-center">
            <Checkbox id="checkOption1" name="option" value="Chicago" v-model="checkboxValue" />
            <label for="checkOption1" class="fb-ml-2">Chicago</label>
          </div>
          <div class="fb-flex fb-items-center">
            <Checkbox id="checkOption2" name="option" value="Los Angeles" v-model="checkboxValue" />
            <label for="checkOption2" class="fb-ml-2">Los Angeles</label>
          </div>
          <div class="fb-flex fb-items-center">
            <Checkbox id="checkOption3" name="option" value="New York" v-model="checkboxValue" />
            <label for="checkOption3" class="fb-ml-2">New York</label>
          </div>
        </div>

        <div class="fb-font-semibold fb-text-xl">ToggleSwitch</div>
        <ToggleSwitch v-model="switchValue" />
      </div>

      <div class="card fb-flex fb-flex-col fb-gap-4">
        <div class="fb-font-semibold fb-text-xl">Listbox</div>
        <Listbox v-model="listboxValue" :options="listboxValues" optionLabel="name" :filter="true" />

        <div class="fb-font-semibold fb-text-xl">Select</div>
        <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />

        <div class="fb-font-semibold fb-text-xl">MultiSelect</div>
        <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Select Countries" :filter="true">
          <template #value="slotProps">
            <div
              class="fb-inline-flex fb-items-center fb-py-1 fb-px-2 fb-bg-primary fb-text-primary-contrast fb-rounded-border fb-mr-2"
              v-for="option of slotProps.value"
              :key="option.code"
            >
              <span :class="'mr-2 flag flag-' + option.code.toLowerCase()" style="width: 18px; height: 12px" />
              <div>{{ option.name }}</div>
            </div>
            <template v-if="!slotProps.value || slotProps.value.length === 0">
              <div class="fb-p-1">Select Countries</div>
            </template>
          </template>
          <template #option="slotProps">
            <div class="fb-flex fb-items-center">
              <span :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </MultiSelect>

        <div class="fb-font-semibold fb-text-xl">TreeSelect</div>
        <TreeSelect v-model="selectedNode" :options="treeSelectNodes" placeholder="Select Item"></TreeSelect>
      </div>

      <div class="card fb-flex fb-flex-col fb-gap-4">
        <div class="fb-font-semibold fb-text-xl">ToggleButton</div>
        <ToggleButton v-model="toggleValue" onLabel="Yes" offLabel="No" :style="{ width: '10em' }" />

        <div class="fb-font-semibold fb-text-xl">SelectButton</div>
        <SelectButton v-model="selectButtonValue" :options="selectButtonValues" optionLabel="name" />
      </div>
    </div>
  </Fluid>

  <Fluid class="fb-flex fb-mt-8">
    <div class="card fb-flex fb-flex-col fb-gap-4 fb-w-full">
      <div class="fb-font-semibold fb-text-xl">InputGroup</div>
      <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText placeholder="Username" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-clock"></i>
          </InputGroupAddon>
          <InputGroupAddon>
            <i class="pi pi-star-fill"></i>
          </InputGroupAddon>
          <InputNumber placeholder="Price" />
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupAddon>.00</InputGroupAddon>
        </InputGroup>
      </div>
      <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
        <InputGroup>
          <Button label="Search" />
          <InputText placeholder="Keyword" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <Checkbox v-model="inputGroupValue" :binary="true" />
          </InputGroupAddon>
          <InputText placeholder="Confirm" />
        </InputGroup>
      </div>
    </div>
  </Fluid>
</template>