import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Please Login First!',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.router.navigate(['login']);
      return false;
    }
  }
}
