import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-details-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatTableModule, CurrencyPipe],
  templateUrl: './order-details-dialog.component.html',
  styleUrl: './order-details-dialog.component.scss',
})
export class OrderDetailsDialogComponent {
  readonly data: Order = inject(MAT_DIALOG_DATA);

  readonly displayedColumns = ['name', 'quantity', 'price', 'lineTotal'];
}
