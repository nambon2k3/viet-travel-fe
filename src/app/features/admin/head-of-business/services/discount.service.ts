import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourDiscountService {
  constructor(private http: HttpClient) {}

  getTourDiscount(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/${id}/discount/list`);
  }

  getLocations(page: number = 0, size: number = 51, keyword: string = '', isDeleted: boolean = false, orderDate: string = 'desc'): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/discount/list-location`, {
      params: { page, size, keyword, isDeleted, orderDate }
    });
  }

  getServiceProviders(tourId: number, locationId: number, categoryName: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/${tourId}/discount/providers`, {
      params: { tourId, locationId, categoryName }
    });
  }

  getServiceDetails(tourId: number, serviceId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/${tourId}/discount/${serviceId}`);
  }

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

  addService(tourId: number, data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}head-of-business/tour/${tourId}/discount/create`, data);
  }

  updateService(tourId: number, serviceId: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}head-of-business/tour/${tourId}/discount/${serviceId}`, data);
  }
}