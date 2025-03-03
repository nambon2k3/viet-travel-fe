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
    orderDate: string = 'desc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('orderDate', orderDate)

    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (isDeleted !== undefined) {
      params = params.set('isDeleted', isDeleted);
    }

    return this.http.get(`${environment.apiUrl}head-business/tour/list`, { params });
  }

  getTourExampleByPage(page: number, size: number, keyword: string, isDeleted: boolean | undefined, sortDirection: string): Observable<any> {
    const mockData = [
      {
        id: 1,
        tourName: 'Hà Nội - Hạ Long 3N2Đ',
        authorName: 'Nguyễn Văn A',
        duration: 3,
        slot: 20,
        price: 5000000,
        status: 'available',
        deleted: false
      },
      {
        id: 2,
        tourName: 'Đà Nẵng - Hội An 4N3Đ',
        authorName: 'Trần Thị B',
        duration: 4,
        slot: 15,
        price: 6500000,
        status: 'available',
        deleted: false
      },
      {
        id: 3,
        tourName: 'Sapa - Fansipan 2N1Đ',
        authorName: 'Lê Văn C',
        duration: 2,
        slot: 10,
        price: 4000000,
        status: 'full',
        deleted: true
      },
      {
        id: 2,
        tourName: 'Đà Nẵng - Hội An 4N3Đ',
        authorName: 'Trần Thị B',
        duration: 4,
        slot: 15,
        price: 6500000,
        status: 'available',
        deleted: false
      },
      {
        id: 3,
        tourName: 'Sapa - Fansipan 2N1Đ',
        authorName: 'Lê Văn C',
        duration: 2,
        slot: 10,
        price: 4000000,
        status: 'full',
        deleted: true
      },
      {
        id: 2,
        tourName: 'Đà Nẵng - Hội An 4N3Đ',
        authorName: 'Trần Thị B',
        duration: 4,
        slot: 15,
        price: 6500000,
        status: 'available',
        deleted: false
      },
      {
        id: 3,
        tourName: 'Sapa - Fansipan 2N1Đ',
        authorName: 'Lê Văn C',
        duration: 2,
        slot: 10,
        price: 4000000,
        status: 'full',
        deleted: true
      },
      {
        id: 2,
        tourName: 'Đà Nẵng - Hội An 4N3Đ',
        authorName: 'Trần Thị B',
        duration: 4,
        slot: 15,
        price: 6500000,
        status: 'available',
        deleted: false
      },
      {
        id: 3,
        tourName: 'Sapa - Fansipan 2N1Đ',
        authorName: 'Lê Văn C',
        duration: 2,
        slot: 10,
        price: 4000000,
        status: 'full',
        deleted: true
      }
    ];

    return of({
      data: {
        items: mockData,
        total: mockData.length,
        page: page,
        size: size
      }
    }).pipe(delay(500)); // Giả lập độ trễ API
  }



  getTourById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}head-business/tour/details/${id}`);
  }

  updateTour(formData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}head-business/tour/update/${formData.id}`, formData);
  }

  createTour(formData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}head-business/tour`, formData);
  }

  deleteTour(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}head-business/tour/change-status/${id}` + '?isDeleted=true');
  }

  recoverTour(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}head-business/tour/change-status/${id}` + '?isDeleted=false');
  }
}
