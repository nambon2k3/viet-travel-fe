import { HttpClient, HttpParams } from "@angular/common/http";
import { UserStorageService } from "../../../core/services/user-storage/user-storage.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ServiceProvided } from "../../../core/models/service-provided.model";

@Injectable({
    providedIn: 'root',
})

export class ServiceProvidedService {    

    constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

    getServiceProvidedByPage(page: number = 0, size: number = 10, keyword?: string, isDeleted?: boolean): Observable<any> {
        const token = this.userStorageService.getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }


        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (keyword) {
            params = params.set('keyword', keyword);
        }
        if (isDeleted !== undefined) {
            params = params.set('isDeleted', isDeleted);
        }

        return this.http.get(`${environment.apiUrl}ceo/service-provider/list`, { params });
    }

    getServiceProvidedById(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}ceo/service-provider/details/${id}`);
    }

    updateServiceProvided(id: number, data: ServiceProvided): Observable<ServiceProvided> {
        return this.http.put<ServiceProvided>(`${environment.apiUrl}ceo/service-provider/updates/${id}`, data); 
      }


    // updateServiceProvidedStatus(id: number, isDeleted: boolean): Observable<any> {
    //     const token = this.userStorageService.getToken();

    //     if (!token) {
    //         throw new Error('No authentication token found');
    //     }

    //     return this.http.post(`${BASIC_URL}/${id}`,  isDeleted);
    // }

}