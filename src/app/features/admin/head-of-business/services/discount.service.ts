import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourDiscountService {
  constructor(private http: HttpClient) {}

  getTourPaxById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/${id}/tour-pax`);
  }

  getTourPaxDetailById(id: number, paxId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/${id}/tour-pax/${paxId}`);
  }

  createTourPax(id: number, data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}head-of-business/tour/${id}/tour-pax`, data);
  }

  updateTourPax(id: number, paxId: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}head-of-business/tour/${id}/tour-pax/${paxId}`, data);
  }

  deleteTourPax(id: number, paxId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}head-of-business/tour/${id}/tour-pax/${paxId}`);
  }
}