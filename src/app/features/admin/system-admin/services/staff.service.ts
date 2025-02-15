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

    getStaffById(id: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}admin/staffs/${id}`);
    }

    getStaffRoles(): Observable<any> {
        return this.http.get(`${environment.apiUrl}auth/roles`);
    }

    updateStaff(formData: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}admin/staffs/${formData.id}`, formData);
    }

    createStaff(formData: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}admin/staffs`, formData);
    }

    deleteStaff(id: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}admin/staffs/change-status/${id}?isDeleted=true`, {});
    }
    
    recoverStaff(id: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}admin/staffs/change-status/${id}?isDeleted=false`, {});
    }
}