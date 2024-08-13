import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../../interfaces/userLogin';
import { environment } from '../../../environments/environment';
import { UserRegister } from '../../interfaces/userRegister';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(userLogin: UserLogin): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, userLogin);
  }

  register(userRegister: UserRegister): Observable<User>{
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, userRegister);
  }

  refreshToken(): Observable<string>{
    return this.http.get<string>(`${environment.apiUrl}/auth/refreshToken`)  
  }
  resetPassword(userLogin: UserLogin){
    this.http.put(`${environment.apiUrl}/auth/resetPassword`, userLogin)
  }
}
