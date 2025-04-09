import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// Không cần import Observable, first, map từ 'rxjs/operators' nữa
import { UserStorageService } from '../services/user-storage/user-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userStorageService: UserStorageService) { }

  // Thêm async và đổi kiểu trả về thành Promise<boolean | UrlTree>
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    console.log('AuthGuard: Running async canActivate...');

    try {
      if (typeof document !== 'undefined' && document.readyState !== 'complete') {
        await new Promise<void>(resolve => {
          window.addEventListener('load', () => resolve(), { once: true });
        });
      }
      const token = await this.userStorageService.getTokenAsync();
      
      console.log('AuthGuard: Token received:', token ? '******' : token); // Log token (che token nếu có)

      // Check if token is null, undefined, or empty
      if (!token || token.trim() === '') {
        console.log('AuthGuard: No valid token found, redirecting to /login');
        return this.router.createUrlTree(['/login']); // Điều hướng bằng UrlTree
      }

      // Token hợp lệ, kiểm tra roles nếu cần
      console.log('AuthGuard: Token found. Checking roles...');

      // Get the required roles from the route data (if any)
      const expectedRoles: string[] = route.data['expectedRoles'] || [];

      // If no specific roles are required, allow access
      if (expectedRoles.length === 0) {
        console.log('AuthGuard: No specific roles required. Access granted.');
        return true; // Cho phép truy cập
      }

      // Get the user's roles (hàm này vẫn đồng bộ theo code bạn cung cấp)
      const userRoles = this.userStorageService.getUserRoles();
      console.log('AuthGuard: User roles:', userRoles);
      console.log('AuthGuard: Expected roles:', expectedRoles);


      // Check if user has any of the required roles
      // Đảm bảo userRoles luôn là mảng để .includes hoạt động
      const hasRequiredRole = Array.isArray(userRoles) && expectedRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        console.log('AuthGuard: User does not have the required roles. Redirecting to 403.');
        return this.router.createUrlTree(['/error/403-unauthorized']); // Điều hướng đến trang không có quyền
      }

      // Có token và có quyền truy cập
      console.log('AuthGuard: User has required roles. Access granted.');
      return true; // Cho phép truy cập

    } catch (error) {
      // Xử lý lỗi nếu Promise từ getTokenAsync bị reject (ít khả năng xảy ra với 'of()')
      console.error('AuthGuard: Error during token retrieval or processing:', error);
      // Chuyển hướng đến trang lỗi chung hoặc login
      return this.router.createUrlTree(['/login']);
    }
  }
}