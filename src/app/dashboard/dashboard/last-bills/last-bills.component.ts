import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TicketingService } from '../../../services/ticketing/ticketing.service';

@Component({
  selector: 'app-last-bills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './last-bills.component.html',
  styleUrls: ['./last-bills.component.css'],
  providers: [DatePipe]
})
export class LastBillsComponent {

  bills: string[] = [];

  constructor(private datePipe: DatePipe, private ticketingService: TicketingService){
    // const currentDate = new Date();
    // const formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy');
    this.ticketingService.gastos.subscribe(res=>{
      this.bills=res
      console.log(this.bills)
    })
  }
}
