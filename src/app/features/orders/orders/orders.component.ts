import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { OrdersStore } from '../../../core/store/orders.store';
import { Order } from '../../../core/models/order.model';
import { OrdersFiltersComponent } from '../orders-filters/orders-filters.component';
import { OrdersTableComponent } from '../orders-table/orders-table.component';
import { OrderDetailsDialogComponent } from '../order-details-dialog/order-details-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    OrdersFiltersComponent,
    OrdersTableComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  readonly store = inject(OrdersStore);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.store.loadOrders();
  }

  openOrderDetails(order: Order): void {
    this.dialog.open(OrderDetailsDialogComponent, {
      data: order,
      width: '500px',
    });
  }
}
