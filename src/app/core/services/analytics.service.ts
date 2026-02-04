import { Injectable } from '@angular/core';
import { Order, DailyRevenue } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  /**
   * Groups completed orders by date (YYYY-MM-DD) and calculates total revenue per day.
   * Returns entries sorted by date descending.
   */
  calculateDailyRevenue(orders: Order[]): DailyRevenue[] {
    const byDate = new Map<string, { totalRevenue: number; orderCount: number }>();

    for (const order of orders) {
      const date = order.orderDate.slice(0, 10);
      const existing = byDate.get(date) ?? { totalRevenue: 0, orderCount: 0 };
      existing.totalRevenue += order.totalAmount;
      existing.orderCount += 1;
      byDate.set(date, existing);
    }

    const result: DailyRevenue[] = Array.from(byDate.entries()).map(([date, agg]) => ({
      date,
      totalRevenue: agg.totalRevenue,
      orderCount: agg.orderCount,
    }));

    result.sort((a, b) => b.date.localeCompare(a.date));
    return result;
  }
}
