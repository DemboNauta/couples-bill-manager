import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { catchError, Observable } from "rxjs";
import { map } from "jquery";

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot):  boolean {
      if (!localStorage.getItem("token")) {
        this.router.navigate(['/login']);
        return false
      } 
      return true
    }
  }
  