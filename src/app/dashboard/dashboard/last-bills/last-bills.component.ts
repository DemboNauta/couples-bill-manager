import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-last-bills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './last-bills.component.html',
  styleUrls: ['./last-bills.component.css'],
  providers: [DatePipe]
})
export class LastBillsComponent {

  bills: {name: string, price: number, date: string|null}[];

  constructor(private datePipe: DatePipe){
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy');
    this.bills = [
      { name: 'Tomates', price: 1.68, date: formattedDate },
      { name: 'Limones', price: 2.58, date: formattedDate }
    ];
  }
}
