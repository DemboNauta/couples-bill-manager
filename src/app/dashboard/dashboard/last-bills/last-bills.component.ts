import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TicketingService } from '../../../services/ticketing/ticketing.service';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-last-bills',
  standalone: true,
  imports: [DataTablesModule],
  templateUrl: './last-bills.component.html',
  styleUrls: ['./last-bills.component.css'],
  providers: [DatePipe]
})
export class LastBillsComponent implements OnInit {

  bills: string[] = [];
  dtOptions: Config={}
  dtTrigger: Subject<any> = new Subject<any>()

  constructor(private datePipe: DatePipe, private ticketingService: TicketingService){
  }

  ngOnInit(): void {
    this.loadBills()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 25
    }
    
  }

  loadBills(){
    this.ticketingService.gastos.subscribe(res=>{
      this.bills=res
      console.log('aaaaaaaaaaa')
      console.log(this.bills)
      this.dtTrigger.next(this.bills);
    })
  }
}
