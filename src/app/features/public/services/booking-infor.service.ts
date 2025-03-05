import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TourDetail, TourSchedule } from '../../../core/models/tour-detail.model';

@Injectable({
  providedIn: 'root',
})
export class BookingInfoService {
  private tourId?: number;
  private scheduleId?: number;
  private bookingData: any;
  private tourDetails?: TourDetail;
  private tourSchedule?: TourSchedule;

  constructor(private http: HttpClient) { }

  setTourData(tourId: number, scheduleId: number) {
    this.tourId = tourId;
    this.scheduleId = scheduleId;
  }

  setTourDetails(tourDetails: TourDetail) {
    this.tourDetails = tourDetails;
  }

  setTourSchedule(tourSchedule?: TourSchedule) {
    this.tourSchedule = tourSchedule
  }

  getTourDetails() {
    return this.tourDetails;
  }

  getTourSchedule() {
    return this.tourSchedule;
  }

  setBookingData(formData: any) {
    this.bookingData = formData;
  }

  submitBooking(bookingData: any): Observable<any> {
    this.bookingData = bookingData;
    return this.http.post<any>(`${environment.apiUrl}public/booking/submit`, bookingData);
  }



  public getUserInformation(userId: number): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}public/booking/details/user/${userId}`);
  }


}