import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { AuthService } from './services/auth/auth.service';
import { ExpensesService } from './services/expenses/expenses.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'couples-bills-manager';
  constructor(private authService: AuthService, private router : Router, private expenseService: ExpensesService){}
  ngOnInit(): void {
    if(localStorage.getItem("token") != null)
    {
      this.authService.verifyToken().subscribe((response)=>{
        console.log(response)
        this.authService.loggedInUser=response;
        this.expenseService.getGastos()
        this.router.navigate(['/dashboard']);
  
      })
    }
  }
}



