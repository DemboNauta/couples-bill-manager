import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Expense } from '../../../interfaces/expense';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Api, Config } from 'datatables.net';

import { DatePipe } from '@angular/common';
import { ExpensesService } from '../../../services/expenses/expenses.service';

@Component({
  selector: 'app-last-bills',
  standalone: true,
  imports: [DataTablesModule],
  templateUrl: './last-bills.component.html',
  styleUrls: ['./last-bills.component.css'],
  providers: [DatePipe]

})
export class LastBillsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  bills: Expense[] = [];
  dtOptions: Config={}
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private datePipe: DatePipe, private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
      }
    };

    this.loadBills();
  }

  loadBills(): void {
    this.expensesService.gastos.subscribe(res => {
      this.bills = res;

      // Destruir la tabla si ya está inicializada
      if (this.datatableElement && this.datatableElement.dtInstance) {
        this.datatableElement.dtInstance.then((dtInstance: Api) => {
          dtInstance.destroy(); // Destruir la tabla
          this.dtTrigger.next(this.bills); // Volver a inicializar la tabla con los nuevos datos
        });
      } else {
        this.dtTrigger.next(this.bills); // Inicializar la tabla por primera vez
      }
    });
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

  ngOnDestroy(): void {
    // Destruir la instancia de DataTables cuando el componente se destruye
    this.dtTrigger.unsubscribe();
  }
}
