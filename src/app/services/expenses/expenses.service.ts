import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expense } from '../../interfaces/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  
  private gastosSubject = new BehaviorSubject<Expense[]>([]);
  gastos = this.gastosSubject.asObservable();
  constructor(private http: HttpClient) { }

  uploadTicket(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(`${environment.apiUrl}/expense/upload`, formData).subscribe((res: {token:string, gastos: Expense[], ingresos: Expense[]})=>{
      console.log(res.gastos)
      this.updateGastos(res.gastos)
    });
  }

  updateGastos(newArray: any[]): void {
    this.gastosSubject.next(newArray);
  }

  getGastos(period: string = "month"){
    this.http.get<Expense[]>(`${environment.apiUrl}/expense/expenses/${period}`).subscribe(
      (gastos)=>this.updateGastos(gastos)
    )
  }
}
