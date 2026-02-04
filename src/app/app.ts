import { Component } from '@angular/core';
import { OrdersComponent } from './features/orders/orders/orders.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';

@Component({
  selector: 'app-root',
  imports: [OrdersComponent, AnalyticsComponent],
  templateUrl: './app.component.html',
})
export class App {}
