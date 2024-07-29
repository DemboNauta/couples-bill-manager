import { Component } from '@angular/core';
import { TicketingService } from '../../../services/ticketing/ticketing.service';

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
  constructor(private ticketService: TicketingService) {}

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
      this.ticketService.uploadTicket(this.ticketInput).subscribe(
        response => {
          console.log('Upload successful', response)
          this.gastos = response.gastos
          this.ticketService.updateGastos(response.gastos)
        },
        
        error => console.error('Upload error', error)
      );
    } else {
      console.error('No file selected');
    }
    event.preventDefault()
    console.log('test')
  }
}
