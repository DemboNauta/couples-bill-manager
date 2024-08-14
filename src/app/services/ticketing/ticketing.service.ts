import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketingService {

  
  private gastosSubject = new BehaviorSubject<any[]>([]);
  gastos = this.gastosSubject.asObservable();
  constructor(private http: HttpClient) { }

  uploadTicket(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(`${environment.apiUrl}/expense/upload`, formData).subscribe((res: {gastos: []})=>{
      console.log(res.gastos)
      this.updateGastos(rep.gastos)
    });
  }

  updateGastos(newArray: any[]): void {
    this.gastosSubject.next(newArray);
  }
}
