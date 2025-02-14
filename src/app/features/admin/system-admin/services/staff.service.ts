import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class StaffService {
    constructor(private http: HttpClient) { }

    getStaffByPage(page: number = 0, size: number = 10, keyword?: string, isDeleted?: boolean): Observable<any> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (keyword) {
            params = params.set('keyword', keyword);
        }
        if (isDeleted !== undefined) {
            params = params.set('isDeleted', isDeleted);
        }

        return this.http.get(`${environment.apiUrl}admin/staffs`, { params });
    }

    getStaffById(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}admin/staffs/${id}`);
    }

    deleteStaff(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}admin/staffs/delete/${id}`);
    }

    update(formData: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}admin/staffs/update/${formData.id}`, formData);
    }
    
    recoverStaff(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}admin/staffs/delete/${id}`);
    }
}