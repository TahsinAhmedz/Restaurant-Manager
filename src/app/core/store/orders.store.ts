import { Injectable, inject, computed, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Order,
  OrderFilters,
  PaginationState,
  DEFAULT_FILTERS,
} from '../models/order.model';
import { OrdersService } from '../services/orders.service';
import { AnalyticsService } from '../services/analytics.service';

function toDateOnly(d: Date | null): string | null {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Injectable({ providedIn: 'root' })
export class OrdersStore {
  private readonly ordersService = inject(OrdersService);
  private readonly analyticsService = inject(AnalyticsService);

  private readonly _orders = signal<Order[]>([]);
  private readonly _filters = signal<OrderFilters>({ ...DEFAULT_FILTERS });
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 20 });

  readonly orders = this._orders.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loadError = this._error.asReadonly();
  readonly pagination = this._pagination.asReadonly();

  readonly filteredOrders = computed(() => {
    const orders = this._orders();
    const filters = this._filters();
    return this.applyFilters(orders, filters);
  });

  readonly completedOrdersForAnalytics = computed(() =>
    this.filteredOrders().filter((o) => o.status === 'COMPLETED')
  );

  readonly dailyRevenue = computed(() => {
    const completed = this.completedOrdersForAnalytics();
    return this.analyticsService.calculateDailyRevenue(completed);
  });

  readonly totalCount = computed(() => this.filteredOrders().length);

  setOrders(orders: Order[]): void {
    this._orders.set(orders);
  }

  setLoadError(error: string | null): void {
    this._error.set(error);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  loadOrders(): Observable<Order[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.ordersService.getOrders();
  }

  setFilters(filters: Partial<OrderFilters>): void {
    this._filters.update((prev) => ({ ...prev, ...filters }));
    this._pagination.update((p) => ({ ...p, pageIndex: 0 }));
  }

  setPagination(pageIndex: number, pageSize?: number): void {
    this._pagination.update((p) => ({
      ...p,
      pageIndex,
      ...(pageSize !== undefined ? { pageSize } : {}),
    }));
  }

  private applyFilters(orders: Order[], filters: OrderFilters): Order[] {
    let result = orders;

    const fromStr = toDateOnly(filters.dateFrom);
    const toStr = toDateOnly(filters.dateTo);
    if (fromStr) {
      result = result.filter((o) => o.orderDate >= fromStr);
    }
    if (toStr) {
      result = result.filter((o) => o.orderDate <= toStr);
    }

    if (filters.status !== 'ALL') {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters.paymentMethod !== 'ALL') {
      result = result.filter((o) => o.paymentMethod === filters.paymentMethod);
    }

    const search = (filters.searchOrderId || '').trim().toLowerCase();
    if (search) {
      result = result.filter((o) => o.orderId.toLowerCase().includes(search));
    }

    return result;
  }
}
