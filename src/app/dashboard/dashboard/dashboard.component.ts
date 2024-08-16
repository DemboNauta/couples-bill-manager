import { Component, OnInit } from '@angular/core';
import { ItemFormComponent } from './item-form/item-form.component';
import { TicketManagerComponent } from './ticket-manager/ticket-manager.component';
import { LastBillsComponent } from './last-bills/last-bills.component';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { Expense } from '../../interfaces/expense';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ItemFormComponent, TicketManagerComponent, LastBillsComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private authService:AuthService, private expensesService: ExpensesService){}
  totalExpense: number = 0
  totalIncomes: number = 0
  totalDifenrence: number = 0
  loggedInUser: User | null =null;

  ngOnInit(): void {
    this.authService.verifyToken().subscribe((user)=>{
      this.loggedInUser = user
    })
      this.expensesService.gastos.subscribe((gastos)=>{
        this.totalExpense=0
        for(let gasto of gastos){
          this.totalExpense += gasto.amount
        }
        this.expensesService.incomes.subscribe((incomes)=>{
          this.totalIncomes=0
          for(let income of incomes){
            this.totalIncomes += income.amount
          }
          
          this.totalDifenrence=this.totalExpense+this.totalIncomes
        })
      })
  }
}
