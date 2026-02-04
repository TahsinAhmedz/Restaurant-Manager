import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { OrdersStore } from '../../core/store/orders.store';
import { DailyRevenue } from '../../core/models/order.model';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';

@Component({
  selector: 'app-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatCardModule, CurrencyPipe, EmptyStateComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  private readonly store = inject(OrdersStore);

  readonly dailyRevenue = this.store.dailyRevenue;
  readonly displayedColumns = ['date', 'orderCount', 'totalRevenue'];

  protected trackByDate(_index: number, row: DailyRevenue): string {
    return row.date;
  }
}
