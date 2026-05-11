<template>
  <div class="fb-date-select">
    <!-- THÁNG: Kiểu slot machine (3 cột select) -->
    <div class="fb-date-select__section">
      <p class="fb-date-select__label">Tháng</p>
      <div class="fb-flex fb-month-select-container">
        <select v-model="monthCol1" size="6" class="fb-overflow-hidden fb-date-select__slot-col">
          <option v-for="month in monthCol1Options" :key="month" :value="month">{{ month }}</option>
        </select>
        <select v-model="monthCol2" size="6" class="fb-overflow-hidden fb-date-select__slot-col">
          <option v-for="month in monthCol2Options" :key="month" :value="month">{{ month }}</option>
        </select>
        <select v-model="monthCol3" size="6" class="fb-overflow-hidden fb-date-select__slot-col">
          <option v-for="month in monthCol3Options" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>
    </div>

    <!-- NGÀY: Kiểu slot machine (2 cột chữ số) -->
    <div class="fb-date-select__section">
      <p class="fb-date-select__label">Ngày</p>
      <div class="fb-flex">
        <select
          v-model="dayDigit1"
          size="5"
          class="fb-overflow-hidden fb-date-select__slot-col fb-date-select__slot-col--digit"
        >
          <option v-for="d in DAY_TENS" :key="d" :value="d">{{ d }}</option>
        </select>
        <select
          v-model="dayDigit2"
          size="5"
          class="fb-date-select__slot-col fb-date-select__slot-col--digit"
        >
          <option v-for="d in DIGITS" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <!-- NĂM: Kiểu slot machine (4 cột chữ số) -->
    <div class="fb-date-select__section">
      <p class="fb-date-select__label">Năm</p>
      <div class="fb-flex">
        <select
          v-model="yearDigit1"
          size="5"
          class="fb-date-select__slot-col fb-date-select__slot-col--digit"
        >
          <option v-for="d in DIGITS" :key="d" :value="d">{{ d }}</option>
        </select>
        <select
          v-model="yearDigit2"
          size="5"
          class="fb-date-select__slot-col fb-date-select__slot-col--digit"
        >
          <option v-for="d in DIGITS" :key="d" :value="d">{{ d }}</option>
        </select>
        <select
          v-model="yearDigit3"
          size="5"
          class="fb-date-select__slot-col fb-date-select__slot-col--digit"
        >
          <option v-for="d in DIGITS" :key="d" :value="d">{{ d }}</option>
        </select>
        <select
          v-model="yearDigit4"
          size="5"
          class="fb-date-select__slot-col fb-date-select__slot-col--digit"
        >
          <option v-for="d in DIGITS" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <!-- Hiển thị ngày đầy đủ -->
    <transition name="fb-fade">
      <div v-if="fullDateLabel" class="fb-date-select__full-date">📅 {{ fullDateLabel }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const now = new Date();
const currentYear = now.getFullYear();
const currentDay = now.getDate();
const currentMonth = now.getMonth() + 1;

// ── Tháng: Logic slot machine ──
const monthCol1 = ref('');
const monthCol2 = ref('');
const monthCol3 = ref('');

// Ghép 3 cột lại → tìm tên tháng → trả về số tháng
const MONTHS_MAP = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
};

const monthCol1Options = ['j', 'nov', 'dec', 'febr', 'm', 'sept'];
const monthCol2Options = ['octo', 'em', 'uly', 'a', 'une', 'an'];
const monthCol3Options = ['ber', 'y', 'uary', 'rch', 'pril', 'ugust'];

const selectedMonth = computed(() => {
  const full = (monthCol1.value + monthCol2.value + monthCol3.value).toLowerCase();
  const validMonth = Object.keys(MONTHS_MAP).find((e) => full.startsWith(e) || full.endsWith(e));
  if (validMonth) {
    return MONTHS_MAP[validMonth];
  } else if (full.startsWith('febr') && full.endsWith('uary')) {
    return MONTHS_MAP['february'];
  }
  return null;
});

// ── Ngày: 2 cột chữ số ──
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const DAY_TENS = [0, 1, 2, 3]; // Hàng chục ngày: 0-3

const dayDigit1 = ref(Math.floor(currentDay / 10));
const dayDigit2 = ref(currentDay % 10);

const selectedDay = computed(() => {
  const val = dayDigit1.value * 10 + dayDigit2.value;
  return val >= 1 && val <= 31 ? val : null;
});

// ── Năm: 4 cột chữ số ──
const yearStr = String(currentYear);
const yearDigit1 = ref(Number(yearStr[0]));
const yearDigit2 = ref(Number(yearStr[1]));
const yearDigit3 = ref(Number(yearStr[2]));
const yearDigit4 = ref(Number(yearStr[3]));

const selectedYear = computed(() => {
  return (
    yearDigit1.value * 1000 + yearDigit2.value * 100 + yearDigit3.value * 10 + yearDigit4.value
  );
});

// ── Ngày đầy đủ ──
const fullDateLabel = computed(() => {
  if (!selectedMonth.value || !selectedDay.value || !selectedYear.value) return '';
  const day = String(selectedDay.value).padStart(2, '0');
  const month = String(selectedMonth.value).padStart(2, '0');
  return `${day}/${month}/${selectedYear.value}`;
});

// Emit data
const emit = defineEmits(['update:modelValue']);
watch(fullDateLabel, (val) => {
  if (val) {
    const d = new Date(selectedYear.value, selectedMonth.value - 1, selectedDay.value);
    emit('update:modelValue', d);
  }
});

onMounted(() => {
  fillMonth();
});

const fillMonth = () => {
  switch (currentMonth) {
    case 1:
      monthCol1.value = 'j';
      monthCol2.value = 'an';
      monthCol3.value = 'uary';

      break;
    case 2:
      monthCol1.value = 'febr';
      monthCol2.value = '';
      monthCol3.value = 'uary';

      break;
    case 3:
      monthCol1.value = 'm';
      monthCol2.value = 'a';
      monthCol3.value = 'rch';

      break;
    case 4:
      monthCol1.value = '';
      monthCol2.value = 'a';
      monthCol3.value = 'pril';

      break;
    case 5:
      monthCol1.value = 'm';
      monthCol2.value = 'a';
      monthCol3.value = 'y';

      break;
    case 6:
      monthCol1.value = 'j';
      monthCol2.value = 'une';
      monthCol3.value = '';

      break;
    case 7:
      monthCol1.value = 'j';
      monthCol2.value = 'uly';
      monthCol3.value = '';

      break;
    case 8:
      monthCol1.value = '';
      monthCol2.value = 'a';
      monthCol3.value = 'ugust';

      break;
    case 9:
      monthCol1.value = 'sept';
      monthCol2.value = 'em';
      monthCol3.value = 'ber';

      break;
    case 10:
      monthCol1.value = '';
      monthCol2.value = 'octo';
      monthCol3.value = 'ber';

      break;
    case 11:
      monthCol1.value = 'nov';
      monthCol2.value = 'em';
      monthCol3.value = 'ber';

      break;
    case 12:
      monthCol1.value = 'dec';
      monthCol2.value = 'em';
      monthCol3.value = 'ber';

      break;
  }
};
</script>

<style lang="scss" scoped>
.fb-date-select {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;

  &__section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    margin: 0;
  }

  &__result {
    font-size: 0.8rem;
    font-weight: 500;
    color: #2563eb;
    animation: fb-pop 0.25s ease-out;
  }

  // ── Cột slot (select tháng & năm) ──
  &__slot-col {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 2px;
    background: #fafafa;
    cursor: pointer;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    font-size: 0.85rem;
    min-width: 52px;
    text-align: center;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
    }

    option {
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;

      &:checked {
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: #fff;
      }

      &:hover {
        background-color: #eff6ff;
      }
    }

    &--year {
      min-width: 48px;
      font-variant-numeric: tabular-nums;
    }
  }

  // ── Ô nhập ngày ──
  &__day-input {
    width: 64px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 0.85rem;
    text-align: center;
    background: #fafafa;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    font-variant-numeric: tabular-nums;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
    }

    /* Ẩn nút tăng giảm */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
  }

  // ── Hiển thị ngày đầy đủ ──
  &__full-date {
    align-self: center;
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    border: 1px solid #bfdbfe;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e40af;
    letter-spacing: 0.02em;
    animation: fb-pop 0.3s ease-out;
  }
}

// ── Hiệu ứng ──
.fb-fade-enter-active,
.fb-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fb-fade-enter-from,
.fb-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes fb-pop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
