import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserLogin } from '../../interfaces/userLogin';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrigido el nombre de la propiedad
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) { }

  // Formulario de inicio de sesión con validadores
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Formulario de registro con validadores, incluyendo el validador personalizado aplicado al grupo
  registerForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required])
  })

  loggedInUser: User | null = null;
  registerFormControl: boolean = false;

  // Método para iniciar sesión
  onLogin(ev: Event) {
    ev.preventDefault();
    
    if (this.loginForm.valid) {
      const user: UserLogin = {
        email: this.loginForm.controls.email.value!,
        password: this.loginForm.controls.password.value!
      };
      
      this.authService.login(user).subscribe((user: User) => {
        this.loggedInUser = user;
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Login failed', error);
      });
    } else {
      console.error('Formulario de inicio de sesión no válido');
    }
  }

  // Método para alternar entre el formulario de inicio de sesión y el de registro
  loginRegister() {
    this.registerFormControl = !this.registerFormControl;
  }

  // Método para registrarse
  onRegister(ev: Event) {
    ev.preventDefault();
    
    if (this.registerForm.valid) {
      const newUser = {
        userName: this.registerForm.controls.userName.value!,
        email: this.registerForm.controls.email.value!,
        password: this.registerForm.controls.password.value!,
        passwordConfirm: this.registerForm.controls.passwordConfirm.value!
      };
      
      this.authService.register(newUser).subscribe((user: User) => {
        console.log('Registro exitoso', user);
        this.loggedInUser = user;
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Registro fallido', error);
      });
    } else {
      console.error('Formulario de registro no válido');
    }
  }


}
