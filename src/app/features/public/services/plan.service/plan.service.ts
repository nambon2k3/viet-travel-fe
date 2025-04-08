import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  getLocationData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}public/plans/locations`);
  }

  getAllLocationData(name: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}public/plans/locations/all`, {
      params: { name: name }
    });
  }

  generatePlan(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}public/plans/generate`, data);
  }
}