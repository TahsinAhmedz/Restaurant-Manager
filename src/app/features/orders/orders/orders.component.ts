import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { OrdersStore } from '../../../core/store/orders.store';
import { Order } from '../../../core/models/order.model';
import { OrdersFiltersComponent } from '../orders-filters/orders-filters.component';
import { OrdersTableComponent } from '../orders-table/orders-table.component';
import { OrderDetailsDialogComponent } from '../order-details-dialog/order-details-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatButtonModule,
    OrdersFiltersComponent,
    OrdersTableComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TranslateModule,
  ],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  readonly store = inject(OrdersStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.subscribeToLoadOrders();
  }

  retryLoadOrders(): void {
    this.subscribeToLoadOrders();
  }

  openOrderDetails(order: Order): void {
    this.dialog.open(OrderDetailsDialogComponent, {
      data: order,
      width: '500px',
    });
  }

  private subscribeToLoadOrders(): void {
    this.store.loadOrders().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.store.setOrders(data);
        this.store.setLoading(false);
        this.store.setLoadError(null);
      },
      error: () => {
        this.store.setLoadError('orders.loadError');
        this.store.setLoading(false);
      },
    });
  }
}
