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
import { CurrencyPipe } from '@angular/common';
import { Order, PaginationState } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CurrencyPipe,
  ],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss',
})
export class OrdersTableComponent {
  readonly orders = input.required<Order[]>();
  readonly totalCount = input.required<number>();
  readonly pageSize = input<number>(20);
  readonly pageIndex = input<number>(0);

  readonly orderSelected = output<Order>();
  readonly pageChange = output<PaginationState>();

  readonly displayedColumns = ['orderId', 'orderDate', 'status', 'paymentMethod', 'totalAmount'];

  private readonly sortState = signal<{ active: string; direction: 'asc' | 'desc' }>({
    active: 'orderDate',
    direction: 'desc',
  });

  readonly dataSource = computed(() => {
    const list = this.orders();
    const sort = this.sortState();
    const pageIndex = this.pageIndex();
    const pageSize = this.pageSize();
    const sorted = [...list].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sort.active];
      const bVal = (b as unknown as Record<string, unknown>)[sort.active];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sort.direction === 'asc' ? 1 : -1;
      if (bVal == null) return sort.direction === 'asc' ? -1 : 1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    const start = pageIndex * pageSize;
    return sorted.slice(start, start + pageSize);
  });

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
    this.sortState.set({
      active: event.active || 'orderDate',
      direction: (event.direction as 'asc' | 'desc') || 'desc',
    });
  }

  onPage(event: { pageIndex: number; pageSize: number }): void {
    this.pageChange.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }
}
