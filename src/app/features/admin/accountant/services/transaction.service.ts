import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

    constructor(private http: HttpClient) { }

    getTransactionByPage(
        page: number = 0,
        size: number = 10,
        keyword?: string,
        sortField: string = 'createdAt',
        sortDirection: string = 'desc',
        transactionType?: string,
    ): Observable<any> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sortField', sortField)
            .set('sortDirection', sortDirection)
            .set('transactionType', transactionType || '');

        if (keyword) {
            params = params.set('keyword', keyword);
        }

        return this.http.get(`${environment.apiUrl}accountant/transactions/list`, { params });
    }


    getTranscationById(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}accountant/transactions/${id}`);
    }

    updateTransaction(data: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}accountant/transactions/update`, data);
    }

}