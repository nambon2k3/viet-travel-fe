import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  forgotPassword(email: string) {
    return this.http.post(`${BASIC_URL}forgot-password`, { email });
  }

  resetPassword(token: string, email: string, password: string) {
    return this.http.post(`${BASIC_URL}reset-password`, { token, email, password });
  }
}
