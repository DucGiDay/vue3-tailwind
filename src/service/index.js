import AuthService from './AuthService';
import CategoryService from './CategoryService';
import CountryService from './CountryService';
import CustomerService from './CustomerService';
import MenuService from './MenuService';
import NodeService from './NodeService';
import PhotoService from './PhotoService';
import ProductService from './ProductService';
import ShiftCalendarService from './ShiftCalendarService';
import StoreService from './StoreService';

export const BaseService = {
  auth: AuthService,
  country: CountryService,
  store: StoreService,
  customer: CustomerService,
  node: NodeService,
  photo: PhotoService,
  product: ProductService,
  menu: MenuService,
  shiftCalendar: ShiftCalendarService,
  category: CategoryService
};

export default BaseService;
