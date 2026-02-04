import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CurrencyPipe, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  Order,
  OrderSortColumn,
  PaginationState,
} from '../../../core/models/order.model';

@Component({
  selector: 'app-orders-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CurrencyPipe,
    NgClass,
    TranslateModule,
  ],
  templateUrl: './orders-table.component.html',
})
export class OrdersTableComponent {
  readonly orders = input.required<Order[]>();
  readonly totalCount = input.required<number>();
  readonly pageSize = input<number>(20);
  readonly pageIndex = input<number>(0);

  readonly orderSelected = output<Order>();
  readonly pageChange = output<PaginationState>();

  readonly displayedColumns = ['orderId', 'orderDate', 'status', 'paymentMethod', 'totalAmount'];

  private readonly sortState = signal<{
    active: OrderSortColumn;
    direction: 'asc' | 'desc';
  }>({
    active: 'orderDate',
    direction: 'desc',
  });

  readonly dataSource = computed(() => {
    const list = this.orders();
    const sort = this.sortState();
    const pageIndex = this.pageIndex();
    const pageSize = this.pageSize();
    const sorted = [...list].sort((a, b) => {
      const aVal = this.getSortValue(a, sort.active);
      const bVal = this.getSortValue(b, sort.active);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sort.direction === 'asc' ? 1 : -1;
      if (bVal == null) return sort.direction === 'asc' ? -1 : 1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    const start = pageIndex * pageSize;
    return sorted.slice(start, start + pageSize);
  });

  private getSortValue(order: Order, column: OrderSortColumn): string | number | null {
    switch (column) {
      case 'orderId':
        return order.orderId;
      case 'orderDate':
        return order.orderDate;
      case 'status':
        return order.status;
      case 'paymentMethod':
        return order.paymentMethod;
      case 'totalAmount':
        return order.totalAmount;
      default:
        return null;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'completed';
      case 'PENDING':
        return 'pending';
      case 'CANCELLED':
        return 'cancelled';
      case 'REFUNDED':
        return 'refunded';
      default:
        return 'default';
    }
  }

  onSort(event: Sort): void {
    const active: OrderSortColumn =
      (event.active as OrderSortColumn) ?? 'orderDate';
    const direction = (event.direction as 'asc' | 'desc') ?? 'desc';
    this.sortState.set({ active, direction });
  }

  onPage(event: { pageIndex: number; pageSize: number }): void {
    this.pageChange.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }
}
