import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserStorageService } from '../services/user-storage/user-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Bỏ qua interceptor cho route /confirm-email
  if (req.url.includes('/confirm-email')) {
    return next(req);
  }

  // Lấy token từ cookie thông qua UserStorageService
  const token = inject(UserStorageService).getToken();

  // Nếu có token, thêm vào header Authorization
  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Xử lý lỗi
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Xóa token và chuyển hướng đến trang đăng nhập nếu bị lỗi 401
        UserStorageService.signOut();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        console.error('Access denied:', error.message);
      }
      return throwError(() => new Error(error.message));
    })
  );
};