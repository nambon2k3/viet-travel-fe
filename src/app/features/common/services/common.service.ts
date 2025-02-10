import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  constructor(private http: HttpClient) { }

  forgotPassword(email: any): Observable<any> {
    return this.http.post(BASIC_URL + 'forgot-password', email);
  }

  resetPassword(token: string, email: string, password: any) {
    return this.http.put(`${BASIC_URL}reset-password?token=${token}&email=${email}`, password);
  }
  
  changePassword(passwordData: any): Observable<any> {
    return this.http.post(BASIC_URL + 'user-profile/change-password', passwordData);
  }
}
