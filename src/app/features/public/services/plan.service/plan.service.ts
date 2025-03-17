import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  getHomepageData(numberTour: number, numberBlog: number, numberActivity: number, numberLocation: number): Observable<any> {
    let params = new HttpParams()
      .set('numberTour', numberTour)
      .set('numberBlog', numberBlog)
      .set('numberActivity', numberActivity)
      .set('numberLocation', numberLocation);
      return this.http.get<any>(`${environment.apiUrl}public/homepage`, { params });
  }
}