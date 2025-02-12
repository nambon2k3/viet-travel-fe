import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../../core/services/user-storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(BASIC_URL + 'user-profile');
  }

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.post(`${BASIC_URL + 'user-profile/update'}/${userId}`, profileData);
  }

  changeAvatar(userId: string | null, avatar: FormData): Observable<any> {
    return this.http.post(`${BASIC_URL}user-profile/avatar/${userId}`, avatar);
  }
}
