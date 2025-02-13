import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../../core/services/user-storage/user-storage.service';
import { environment } from '../../../../environments/environment';

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

    return this.http.post<any>(environment.apiUrl + 'user-profile', token);
  }

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl + 'user-profile/update'}/${userId}`, profileData);
  }

  changeAvatar(userId: string | null, avatar: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}user-profile/avatar/${userId}`, avatar);
  }
}
