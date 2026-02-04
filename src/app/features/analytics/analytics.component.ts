import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrdersStore } from '../../core/store/orders.store';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatCardModule,
    CurrencyPipe,
    DatePipe,
    EmptyStateComponent,
    TranslateModule,
  ],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent {
  private readonly store = inject(OrdersStore);

  readonly dailyRevenue = this.store.dailyRevenue;
  readonly displayedColumns = ['date', 'orderCount', 'totalRevenue'];
}
