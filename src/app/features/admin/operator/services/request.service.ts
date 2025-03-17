import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  getRequestByPage(
    page: number = 0,
    size: number = 10,
    keyword?: string,
    isDeleted?: boolean,
    sortField: string = 'createdAt',
    sortDirection: string = 'desc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);

    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (isDeleted !== undefined) {
      params = params.set('isDeleted', isDeleted);
    }

    return this.http.get(`${environment.apiUrl}marketing/blog/list`, { params });
  }

  updateRequestStatus(id: number, isDeleted: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}marketing/blog/change-status/${id}`, isDeleted);
  }

  getRequestById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}marketing/blog/details/${id}`);
  }

  update(formData: any, id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}marketing/blog/update/${id}`, formData);
  }
}
