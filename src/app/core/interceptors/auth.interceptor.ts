import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Exclude specific routes from the interceptor logic
  if (req.url.includes('/confirm-email')) {
    // Bypass the interceptor for /confirm-email route
    return next(req);
  }

  // Retrieve the token from localStorage
  const token = localStorage.getItem('authToken');

  // Clone the request and add the Authorization header if a token exists
  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Handle the request and catch errors
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Handle unauthorized access (e.g., clear token and redirect to login)
        localStorage.removeItem('authToken');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Handle forbidden access
        console.error('Access denied:', error.message);
      }
      // Re-throw the error to propagate it further
      return throwError(() => new Error(error.message));
    })
  );
};