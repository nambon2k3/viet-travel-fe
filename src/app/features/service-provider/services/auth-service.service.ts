// src/app/features/service-provider/services/auth-service.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService { // Đổi tên class thành AuthService (theo chuẩn Angular, không cần "Service" trong tên class)
  constructor(private jwtHelper: JwtHelperService) {}

  getToken(): string | null {
    return localStorage.getItem('token'); // Giả định token được lưu trong localStorage
  }

  getProviderName(): string | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Giả định token chứa 'providerName' hoặc 'name'. Điều chỉnh key dựa trên token thực tế
      return decodedToken?.providerName || decodedToken?.name || null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }
}