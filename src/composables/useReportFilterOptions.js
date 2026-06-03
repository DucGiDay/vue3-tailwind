import { ref } from 'vue';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { employeeService } from '@/api/services/employee/employee.service';
import { useGlobalStore } from '@/stores/global.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';

// Global cache state outside the composable (acts as a singleton)
const globalCreatorsPage1 = ref([]);
const globalSerialsPage1 = ref([]);
const globalPatterns = ref([]);
let isPatternsLoaded = false;

export function useReportFilterOptions() {
  const globalStore = useGlobalStore();
  const invoiceStore = useEInoiveStore();

  // Creators state
  const creatorOptions = ref([...globalCreatorsPage1.value]);
  const creatorPage = ref(1);
  const isLoadingCreators = ref(false);
  const hasMoreCreators = ref(globalCreatorsPage1.value.length === 20);
  const searchKeywordCreator = ref('');
  let filterTimeoutCreator = null;
  const CREATOR_PAGE_SIZE = 20;

  // Serials state
  const serialOptions = ref([...globalSerialsPage1.value]);
  const serialPage = ref(1);
  const isLoadingSerials = ref(false);
  const hasMoreSerials = ref(globalSerialsPage1.value.length === 20);
  const searchKeywordSerial = ref('');
  let filterTimeoutSerial = null;
  const SERIAL_PAGE_SIZE = 20;

  // Patterns state
  const patternOptions = ref(globalPatterns.value);
  const isLoadingPatterns = ref(false);

  // Creators Logic
  const getCreators = async (isLoadMore = false) => {
    if (isLoadingCreators.value || (!hasMoreCreators.value && isLoadMore)) return;

    // Cache check for page 1 without search keyword
    const isFirstPageNoSearch = creatorPage.value === 1 && !searchKeywordCreator.value;
    if (isFirstPageNoSearch && globalCreatorsPage1.value.length > 0 && !isLoadMore) {
      creatorOptions.value = [...globalCreatorsPage1.value];
      hasMoreCreators.value = globalCreatorsPage1.value.length >= CREATOR_PAGE_SIZE;
      return;
    }

    isLoadingCreators.value = true;
    try {
      const payload = {
        company_uid: globalStore?.currentUser?.company_uid,
        active: 1,
        page: creatorPage.value,
        results_per_page: CREATOR_PAGE_SIZE,
      };

      if (searchKeywordCreator.value) {
        payload.search = searchKeywordCreator.value;
      }

      const res = await employeeService.getUsers(payload);
      const users = res?.data || [];
      const newOptions = users.map((u) => ({
        label: u?.full_name || u?.email || '',
        value: u.email,
      }));

      if (isLoadMore) {
        creatorOptions.value = [...creatorOptions.value, ...newOptions];
      } else {
        creatorOptions.value = newOptions;
      }

      if (isFirstPageNoSearch) {
        globalCreatorsPage1.value = [...creatorOptions.value];
      }

      if (users.length < CREATOR_PAGE_SIZE) {
        hasMoreCreators.value = false;
      } else {
        hasMoreCreators.value = true;
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      isLoadingCreators.value = false;
    }
  };

  const onLazyLoadCreators = (event) => {
    const { last } = event;
    if (last >= creatorOptions.value.length && hasMoreCreators.value && !isLoadingCreators.value) {
      creatorPage.value++;
      getCreators(true);
    }
  };

  const onFilterCreators = (event) => {
    searchKeywordCreator.value = event.value;
    if (filterTimeoutCreator) clearTimeout(filterTimeoutCreator);
    filterTimeoutCreator = setTimeout(() => {
      creatorPage.value = 1;
      hasMoreCreators.value = true;
      getCreators(false);
    }, 500);
  };

  // Serials Logic
  const getSerials = async (isLoadMore = false) => {
    if (isLoadingSerials.value || (!hasMoreSerials.value && isLoadMore)) return;

    // Cache check for page 1 without search keyword
    const isFirstPageNoSearch = serialPage.value === 1 && !searchKeywordSerial.value;
    if (isFirstPageNoSearch && globalSerialsPage1.value.length > 0 && !isLoadMore) {
      serialOptions.value = [...globalSerialsPage1.value];
      hasMoreSerials.value = globalSerialsPage1.value.length >= SERIAL_PAGE_SIZE;
      return;
    }

    isLoadingSerials.value = true;
    try {
      const payload = {
        company_uid: globalStore?.currentUser?.company_uid,
        brand_uid: globalStore?.brandUid,
        tax_code: invoiceStore.currentTaxCode,
        page: serialPage.value,
        perpage: SERIAL_PAGE_SIZE,
      };

      if (searchKeywordSerial.value) {
        payload.serial = searchKeywordSerial.value;
      }

      const res = await invoiceService.getSerialInvoice(payload);
      const items = res?.data?.items || [];
      const newOptions = items.map((u) => ({
        label: u.serial || '',
        value: u.serial,
      }));

      if (isLoadMore) {
        serialOptions.value = [...serialOptions.value, ...newOptions];
      } else {
        serialOptions.value = newOptions;
      }

      if (isFirstPageNoSearch) {
        globalSerialsPage1.value = [...serialOptions.value];
      }

      if (items.length < SERIAL_PAGE_SIZE) {
        hasMoreSerials.value = false;
      } else {
        hasMoreSerials.value = true;
      }
    } catch (error) {
      console.error('Error fetching serials:', error);
    } finally {
      isLoadingSerials.value = false;
    }
  };

  const onLazyLoadSerials = (event) => {
    const { last } = event;
    if (last >= serialOptions.value.length && hasMoreSerials.value && !isLoadingSerials.value) {
      serialPage.value++;
      getSerials(true);
    }
  };

  const onFilterSerials = (event) => {
    searchKeywordSerial.value = event.value;
    if (filterTimeoutSerial) clearTimeout(filterTimeoutSerial);
    filterTimeoutSerial = setTimeout(() => {
      serialPage.value = 1;
      hasMoreSerials.value = true;
      getSerials(false);
    }, 500);
  };

  // Patterns Logic
  const getPatterns = async () => {
    if (isLoadingPatterns.value) return;

    if (isPatternsLoaded && globalPatterns.value.length > 0) {
      patternOptions.value = globalPatterns.value;
      return;
    }

    isLoadingPatterns.value = true;
    try {
      const res = await invoiceService.getSerialInvoiceTemplate({
        tax_code: invoiceStore.currentTaxCode,
      });
      const templates = res?.data || [];
      const uniqueDescriptions = [...new Set(templates.map((t) => t.Description).filter(Boolean))];
      globalPatterns.value = uniqueDescriptions.map((desc) => ({
        label: desc,
        value: desc,
      }));
      patternOptions.value = globalPatterns.value;
      isPatternsLoaded = true;
    } catch (error) {
      console.error('Error fetching patterns:', error);
    } finally {
      isLoadingPatterns.value = false;
    }
  };

  const loadAllFilterOptions = () => {
    getCreators();
    getSerials();
    getPatterns();
  };

  return {
    creatorOptions,
    isLoadingCreators,
    onLazyLoadCreators,
    onFilterCreators,

    serialOptions,
    isLoadingSerials,
    onLazyLoadSerials,
    onFilterSerials,

    patternOptions,
    isLoadingPatterns,

    loadAllFilterOptions,
  };
}
