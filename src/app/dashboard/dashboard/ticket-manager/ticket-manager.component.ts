import { Component } from '@angular/core';
import { ExpensesService } from '../../../services/expenses/expenses.service';

@Component({
  selector: 'app-ticket-manager',
  standalone: true,
  imports: [],
  templateUrl: './ticket-manager.component.html',
  styleUrl: './ticket-manager.component.css'
})
export class TicketManagerComponent {
  ticketInput: File | null = null;
  gastos: [] = [];
  constructor(private expensesService: ExpensesService) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.ticketInput = input.files[0];
    }
    console.log('Cambio')
  }

  onSubmit(event: Event): void {
    if (this.ticketInput) {
      console.log('File to upload:', this.ticketInput);
      this.expensesService.uploadTicket(this.ticketInput)
      // .subscribe(
      //   (response) => {
      //     console.log('Upload successful', response)
      //     this.gastos = response.gastos
      //     this.expensesService.updateGastos(response.gastos)
      //   },
        
      //   error => console.error('Upload error', error)
      // );
    } else {
      console.error('No file selected');
    }
    event.preventDefault()
    console.log('test')
  }
}
