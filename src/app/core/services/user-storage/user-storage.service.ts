import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const TOKEN = "vietravel-token";
const USER = "vietravel-user";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  constructor() {}

  // Set a cookie with optional expiration in days
  private setCookie(name: string, value: string, days?: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  }

  // Retrieve a cookie by name
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }

  // Delete a cookie by setting its expiration to a past date
  private deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
  }

  public saveToken(token: string): void {
    this.setCookie(TOKEN, token, 1); 
  }

  public saveTokenRemembered(token: string): void {
    this.setCookie(TOKEN, token, 30); 
  }

  public saveUser(user: any): void {
    this.setCookie(USER, JSON.stringify(user), 1);
  }
  

  public saveUserRemembered(user: any): void {
    this.setCookie(USER, JSON.stringify(user), 30); 
  }

  // Retrieve the authentication token
  public getToken(): string | null {
    return this.getCookie(TOKEN);
  }

  // Retrieve the authentication token as an Observable
  public getTokenAsync(): Observable<string | null> {
    return of(this.getToken());
  }

  // Retrieve the user object
  public getUser(): any {
    const userJson = this.getCookie(USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Retrieve the user ID
  public getUserId(): string {
    const user = this.getUser();
    return user?.userId || '';
  }

  // Retrieve the user role
  public getUserRole(): string {
    const user = this.getUser();
    return user?.role || '';
  }

  // Check if the admin is logged in
  public isAdminLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  // Check if the customer is logged in
  public isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'CUSTOMER';
  }

  // Clear all authentication-related cookies
  public static signOut(): void {
    const storage = new UserStorageService();
    storage.deleteCookie(TOKEN);
    storage.deleteCookie(USER);
  }
}