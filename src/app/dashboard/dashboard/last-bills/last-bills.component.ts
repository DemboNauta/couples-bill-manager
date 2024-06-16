import { Component } from '@angular/core';

@Component({
  selector: 'app-last-bills',
  standalone: true,
  imports: [],
  templateUrl: './last-bills.component.html',
  styleUrl: './last-bills.component.css'
})
export class LastBillsComponent {
  bills=[{name: 'Tomates', price: 1.68}, {name: 'Limones', price: 2.58}]
}
