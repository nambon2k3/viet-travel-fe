import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Injectable({
  providedIn: 'root',
})
export class ConfirmEmailService {

  constructor(private http: HttpClient) {}

  confirmEmail(token: string): Observable<any> {
    return this.http.get(`${BASIC_URL + 'auth/confirm-email'}?token=${token}`);
  }
}
