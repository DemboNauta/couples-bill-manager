import { Component, OnInit } from '@angular/core';
import { Expense } from '../../interfaces/expense';
import { DatePipe } from '@angular/common';
import { ExpensesService } from '../../services/expenses/expenses.service';

@Component({
  selector: 'app-last-bills',
  standalone: true,
  templateUrl: './last-bills.component.html',
  styleUrls: ['./last-bills.component.css'],
  providers: [DatePipe]
})
export class LastBillsComponent implements OnInit {

  bills: Expense[] = [];
  filteredBills: Expense[] = [];
  paginatedBills: Expense[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchQuery: string = '';
  sortColumn: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  showIncomesTable: boolean = false
  tableShowing: string = 'Gastos'
  period: string = 'lastmonth'

  constructor(private datePipe: DatePipe, private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.loadBills('lastmonth');
  }

  selectChange(period: string): void {
    this.sortColumn='date';
    this.sortBy('date')
    this.sortDirection='desc';
    this.period= period
    this.loadBills(period);

  }
  onShowTable(){
    this.showIncomesTable = !this.showIncomesTable
  
    if(this.showIncomesTable) this.tableShowing = 'Ingresos'
    else this.tableShowing = 'Gastos'
    this.loadBills(this.period)
  }

  loadBills(period: string): void {
    this.currentPage=1
    this.expensesService.getGastos(period).subscribe(res => {
      this.expensesService.updateGastos(res)
      if(!this.showIncomesTable){
        this.bills = res;
        this.applyFilters();
      }
      
    });
    this.expensesService.getIncomes(period).subscribe((incomes)=>{
      if(this.showIncomesTable){
        this.bills = incomes;
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    this.filteredBills = this.bills;

    if (this.searchQuery) {
      this.filteredBills = this.filteredBills.filter(bill =>
        bill.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        bill.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        bill.amount.toString().includes(this.searchQuery) ||
        this.formatDate(bill.date).includes(this.searchQuery)
      );
    }

    if (this.sortColumn) {
      this.filteredBills.sort((a, b) => {
        let valueA = a[this.sortColumn as keyof Expense];
        let valueB = b[this.sortColumn as keyof Expense];

        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalPages = Math.ceil(this.filteredBills.length / this.itemsPerPage);
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedBills = this.filteredBills.slice(start, end);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
    this.paginatedBills=this.filteredBills
    this.paginate()
    this.currentPage=1
  }

  sortBy(column: keyof Expense): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.filteredBills.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];
      
      // Si estamos ordenando por la columna de fecha, convertir a Date
      if (column === 'date') {
        valueA = new Date(valueA as string | Date);
        valueB = new Date(valueB as string | Date);
      }
  
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.paginatedBills=this.filteredBills
    this.paginate()
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
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

  trackByBill(index: number, bill: Expense): number {
    return bill.id;
  }
}
