import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketingService {

  private uploadUrl = 'http://127.0.0.1:8000/upload/'; // Update this with your actual endpoint
  
  private gastosSubject = new BehaviorSubject<any[]>([]);
  gastos = this.gastosSubject.asObservable();
  constructor(private http: HttpClient) { }

  uploadTicket(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.uploadUrl, formData);
  }

  updateGastos(newArray: any[]): void {
    this.gastosSubject.next(newArray);
  }
}
