import { Injectable } from '@angular/core';
import { log } from 'console';

const TOKEN = "vietravel-token";
const USER = "vietravel-user";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  private setCookie(name: string, value: string, days?: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  }

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

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
  }

  public saveToken(token: string): void {
    this.setCookie(TOKEN, token, 7); 
  }

  public saveUser(user: any): void {
    this.setCookie(USER, JSON.stringify(user), 7);
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return new UserStorageService().getCookie(TOKEN);
    }
    return null;
  }
  
  static getUser(): any {
    if (typeof window !== "undefined") {
      const userJson = new UserStorageService().getCookie(USER);
      if (userJson) {
        return JSON.parse(userJson);
      }
    }
    return null;
  }
  

  static getUserId(): string {
    const user = this.getUser();
    return user?.userId || '';
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user?.role || '';
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'CUSTOMER';
  }

  static signOut(): void {
    const storage = new UserStorageService();
    storage.deleteCookie(TOKEN);
    storage.deleteCookie(USER);
  }
}
