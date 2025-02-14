import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../../core/services/user-storage/user-storage.service';
import { environment } from '../../../../environments/environment';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'user-profile');
  }  

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.post(`${BASIC_URL + 'user-profile/update'}/${userId}`, profileData);
  }

  changeAvatar(userId: string | null, avatar: FormData): Observable<any> {
    return this.http.post(`${BASIC_URL}user-profile/avatar/${userId}`, avatar);
  }
}
