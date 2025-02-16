import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../../core/models/homepage.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private http: HttpClient) { }

  getHomepageData(numberTour: number, numberBlog: number, numberActivity: number): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('numberTour', numberTour)
      .set('numberBlog', numberBlog)
      .set('numberActivity', numberActivity);
      return this.http.get<ApiResponse>(`${environment.apiUrl + 'public/homepage'}`, { params });
  }
}
