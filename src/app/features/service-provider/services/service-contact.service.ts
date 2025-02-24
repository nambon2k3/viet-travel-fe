import { HttpClient, HttpParams } from "@angular/common/http";
import { UserStorageService } from "../../../core/services/user-storage/user-storage.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ServiceContact } from "../../../core/models/service-contact.model";


@Injectable({
    providedIn: 'root',
})

export class ServiceContactService {   

    getServiceProviderByServiceContactId(id: number) {
        throw new Error('Method not implemented.');
      } 

    constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

    getServiceContactByPage(page: number = 0, size: number = 10, keyword?: string, isDeleted?: boolean): Observable<any> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (keyword) {
            params = params.set('keyword', keyword);
        }
        if (isDeleted !== undefined) {
            params = params.set('isDeleted', isDeleted);
        }

        return this.http.get(`${environment.apiUrl}service-provider/service-contacts`, { params });
    }

    updateServiceContactStatus(id: number, isDeleted: boolean): Observable<any> {
        return this.http.post(`${environment.apiUrl}service-provider/service-contacts/change-status/${id}`,  isDeleted);
    }

    getServiceContactById(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}service-provider/service-contacts/details/${id}`);
    }

    updateServiceContact(formData: any, id: number): Observable<any> {
        return this.http.put(`${environment.apiUrl}service-provider/service-contacts/update/${id}`, formData);
    }

    addServiceContact(): Observable<any> {
        return this.http.post(`${environment.apiUrl}service-provider/service-contacts`, {});
    }

    getAllServiceProvider(): Observable<any> {
        return this.http.get(`${environment.apiUrl}ceo/service-provider/list`);
    }

}