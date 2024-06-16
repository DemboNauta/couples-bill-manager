import { Component } from '@angular/core';
import { ItemFormComponent } from './item-form/item-form.component';
import { TicketManagerComponent } from './ticket-manager/ticket-manager.component';
import { LastBillsComponent } from './last-bills/last-bills.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ItemFormComponent, TicketManagerComponent, LastBillsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
