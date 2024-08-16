import { Component, OnInit } from '@angular/core';
import { ItemFormComponent } from './item-form/item-form.component';
import { TicketManagerComponent } from './ticket-manager/ticket-manager.component';
import { LastBillsComponent } from './last-bills/last-bills.component';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { Expense } from '../../interfaces/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ItemFormComponent, TicketManagerComponent, LastBillsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private authService:AuthService, private expensesService: ExpensesService){}
  total: number = 0
  loggedInUser: User | null =null;
  ngOnInit(): void {
      this.loggedInUser=this.authService.loggedInUser
      this.expensesService.gastos.subscribe((gastos)=>{
        this.total=0
        for(let gasto of gastos){
          this.total += gasto.amount
        }
      })
  }
}
