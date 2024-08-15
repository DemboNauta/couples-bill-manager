import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExpensesService } from '../../../services/expenses/expenses.service';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { Expense } from '../../../interfaces/expense';


@Component({
  selector: 'app-last-bills',
  standalone: true,
  imports: [DataTablesModule],
  templateUrl: './last-bills.component.html',
  styleUrls: ['./last-bills.component.css'],
  providers: [DatePipe]
})
export class LastBillsComponent implements OnInit {

  bills: Expense[] = [];
  dtOptions: Config={}
  dtTrigger: Subject<any> = new Subject<any>()

  constructor(private datePipe: DatePipe, private expensesService: ExpensesService){
  }

  ngOnInit(): void {
    this.loadBills()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 25,
      language: {
      "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
      }
    }
    
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  loadBills(){
    this.expensesService.gastos.subscribe(res=>{
      this.bills=res
      console.log('aaaaaaaaaaa')
      console.log(this.bills)
      this.dtTrigger.next(this.bills);
    })
  }
}
