export type OrderStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  orderDate: string;
  customer: { id: number; name: string };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  meta: { totalRecords: number; page: number; pageSize: number; totalPages: number };
  data: Order[];
}

export interface OrderFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  status: OrderStatus | 'ALL';
  paymentMethod: PaymentMethod | 'ALL';
  searchOrderId: string;
}

export interface DailyRevenue {
  date: string;
  totalRevenue: number;
  orderCount: number;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

/** Column ids that can be used for table sort. */
export type OrderSortColumn =
  | 'orderId'
  | 'orderDate'
  | 'status'
  | 'paymentMethod'
  | 'totalAmount';

export const DEFAULT_FILTERS: OrderFilters = {
  dateFrom: null,
  dateTo: null,
  status: 'COMPLETED',
  paymentMethod: 'ALL',
  searchOrderId: '',
};
