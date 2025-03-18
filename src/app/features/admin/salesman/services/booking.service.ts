import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class BookingService {

    constructor(private http: HttpClient) { }

    getTourBookingByPage(
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

        return this.http.get(`${environment.apiUrl}salesman/bookings/list`, { params });
    }



    getBookingCustomers(tourBookingId: number) : Observable<any> {
        return this.http.get(`${environment.apiUrl}salesman/bookings/customers/list/${tourBookingId}`);
    }

    updateCustomerStatus(customerId: number) : Observable<any> {
        return this.http.post(`${environment.apiUrl}salesman/bookings/customers/change-status`, customerId);
    }


    updateCustomers(customerFormData: any) : Observable<any> {
        return this.http.post(`${environment.apiUrl}salesman/bookings/customers/update`, customerFormData);
    }


}