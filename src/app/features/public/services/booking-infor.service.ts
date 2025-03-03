import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingInfoService {
  private tourId?: number;
  private scheduleId?: number;
  private bookingData: any;

  constructor(private http: HttpClient) { }

  setTourData(tourId: number, scheduleId: number) {
    this.tourId = tourId;
    this.scheduleId = scheduleId;
  }

  getTourData() {
    return { tourId: this.tourId, scheduleId: this.scheduleId };
  }


  getTourDetails(tourId: number, scheduleId: number): Observable<any> {
      return this.http.get<any[]>(`${environment.apiUrl}public/booking/details/${tourId}/${scheduleId}`);
    }


    submitBooking(bookingData: any): Observable<any> {
      this.bookingData = bookingData;
      return this.http.post<any>(`${environment.apiUrl}public/booking/submit`, bookingData);
    }


    
  public getUserInformation(userId: number): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}public/booking/details/user/${userId}`);
  }


}
