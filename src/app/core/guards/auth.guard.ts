import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserStorageService } from '../services/user-storage/user-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userStorageService: UserStorageService) {}

  canActivate(): Observable<boolean> {
    return this.userStorageService.getTokenAsync().pipe(
      map((token) => {
        if (token) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}