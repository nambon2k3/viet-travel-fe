import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  constructor(private http: HttpClient) { }

  getTourByPage(
    page: number = 0,
    size: number = 10,
    keyword?: string,
    isDeleted?: boolean,
    isOpen?: boolean,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (isDeleted !== undefined) {
      params = params.set('isDeleted', isDeleted.toString());
    }
    if (isOpen !== undefined) {
      params = params.set('isOpen', isOpen.toString());
    }

    return this.http.get(`${environment.apiUrl}head-of-business/tour/list`, { params });
  }

  getTourById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/detail/${id}`);
  }

  getTourScheduleById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/detail-schedule/${id}`);
  }

  getTourDayById(tourId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/${tourId}/tour-days/list`);
  }

  updateTour(formData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}head-of-business/tour/update/${formData.id}`, formData);
  }

  createTour(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}head-of-business/tour/create`, formData);
  }

  deleteTour(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}head-of-business/tour/change-status/${id}` + '?isDeleted=true');
  }

  recoverTour(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}head-business/tour/change-status/${id}` + '?isDeleted=false');
  }

  getAllTags(): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-of-business/tour/list-tag`);
  }

  createTourDay(tourId: string, formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}head-of-business/tour/${tourId}/tour-days/create`, formData);
  }

  updateTourDay(tourId: string, id: string, formData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}head-of-business/tour/${tourId}/tour-days/update/${id}`, formData);
  }

  changeTourDayStatus(tourId: string, tourDayId: string, isDeleted: boolean): Observable<any> {
    const params = new HttpParams().set('isDeleted', isDeleted.toString());
    return this.http.put(`${environment.apiUrl}head-of-business/tour/${tourId}/tour-days/${tourDayId}/status`, params );
  }

  calculateEndDates(tourId: string, startDate: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}head-of-business/tour/schedule/calculate-end-dates/${tourId}`, { params: { startDate }});
  }

  getAvailableOperators(tourId: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}head-of-business/tour/schedule/available-operators`, { params: { tourId, startDate, endDate }});
  }

  getTourPax(tourId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}head-of-business/tour/${tourId}/tour-pax`);
  }

  createTourSchedule(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}head-of-business/tour/schedule/set`, formData);
  }

  updateTourSchedule(formData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}head-of-business/tour/schedule/update`, formData);
  }

  cancelTourSchedule(scheduleId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}head-of-business/tour/schedule/cancel/${scheduleId}`, {});
  }
}