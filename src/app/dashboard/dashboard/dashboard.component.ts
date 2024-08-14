import { Component, OnInit } from '@angular/core';
import { ItemFormComponent } from './item-form/item-form.component';
import { TicketManagerComponent } from './ticket-manager/ticket-manager.component';
import { LastBillsComponent } from './last-bills/last-bills.component';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ItemFormComponent, TicketManagerComponent, LastBillsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private authService:AuthService){}
  loggedInUser: User | null =null;
  ngOnInit(): void {
      this.loggedInUser=this.authService.loggedInUser
      console.log(this.loggedInUser)
  }
}
