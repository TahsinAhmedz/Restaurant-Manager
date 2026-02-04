import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, OrdersResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly dataUrl = '/data/mockdata.json';

  getOrders(): Observable<Order[]> {
    return this.http.get<OrdersResponse>(this.dataUrl).pipe(
      map((res) => (res.success && res.data ? res.data : []))
    );
  }
}
