import { Component, ChangeDetectionStrategy, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { OrdersStore } from '../../../core/store/orders.store';
import {
  OrderStatus,
  PaymentMethod,
  DEFAULT_FILTERS,
} from '../../../core/models/order.model';
import { debounceTime, startWith } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

const STATUS_OPTIONS: (OrderStatus | 'ALL')[] = [
  'ALL',
  'COMPLETED',
  'PENDING',
  'CANCELLED',
  'REFUNDED',
];
const PAYMENT_OPTIONS: (PaymentMethod | 'ALL')[] = ['ALL', 'CASH', 'CARD', 'ONLINE'];

@Component({
  selector: 'app-orders-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './orders-filters.component.html',
  styleUrl: './orders-filters.component.scss',
})
export class OrdersFiltersComponent {
  private readonly store = inject(OrdersStore);
  private readonly fb = inject(FormBuilder);

  readonly statusOptions = STATUS_OPTIONS;
  readonly paymentOptions = PAYMENT_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    dateFrom: this.fb.control<Date | null>(null),
    dateTo: this.fb.control<Date | null>(null),
    status: this.fb.nonNullable.control<OrderStatus | 'ALL'>(DEFAULT_FILTERS.status),
    paymentMethod: this.fb.nonNullable.control<PaymentMethod | 'ALL'>(
      DEFAULT_FILTERS.paymentMethod
    ),
    searchOrderId: this.fb.nonNullable.control(DEFAULT_FILTERS.searchOrderId),
  });

  private readonly formValueSignal = toSignal(
    this.form.valueChanges.pipe(
      debounceTime(300),
      startWith(this.form.getRawValue())
    ),
    { initialValue: this.form.getRawValue() }
  );

  constructor() {
    effect(() => {
      const v = this.formValueSignal();
      this.store.setFilters({
        dateFrom: v.dateFrom ?? null,
        dateTo: v.dateTo ?? null,
        status: v.status ?? 'COMPLETED',
        paymentMethod: v.paymentMethod ?? 'ALL',
        searchOrderId: (v.searchOrderId ?? '').trim(),
      });
    });
  }

  reset(): void {
    this.form.reset({
      dateFrom: null,
      dateTo: null,
      status: DEFAULT_FILTERS.status,
      paymentMethod: DEFAULT_FILTERS.paymentMethod,
      searchOrderId: DEFAULT_FILTERS.searchOrderId,
    });
    this.store.setFilters({ ...DEFAULT_FILTERS });
  }
}
