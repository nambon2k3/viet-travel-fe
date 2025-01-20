import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserStorageService } from '../services/user-storage/user-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    const token = UserStorageService.getToken();

    if (token) {
      return true; 
    }

    this.router.navigate(['/login']); 
    return false;
  }
}
