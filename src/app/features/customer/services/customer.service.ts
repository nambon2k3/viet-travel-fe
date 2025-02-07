import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../../core/services/user-storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

  getUserProfile(): Observable<any> {
    const token = this.userStorageService.getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.http.post<any>(BASIC_URL + 'user-profile', token);
  }

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.post(`${BASIC_URL + 'user-profile/update'}/${userId}`, profileData);
  }
}
