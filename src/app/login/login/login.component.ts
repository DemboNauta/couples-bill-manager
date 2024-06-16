import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) { }

  onLogin(ev: Event) {
    // Aquí iría la lógica de autenticación
    ev.preventDefault()
    // const loginSuccessful = true; // Simula una autenticación exitosa

    // if (loginSuccessful) {
      this.router.navigate(['/dashboard']);
    // } else {
    //   // Maneja el error de inicio de sesión
    //   console.error('Login failed');
    // }
  }
}
