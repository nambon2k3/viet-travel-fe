import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class AdminService {
    constructor(private http: HttpClient) { }
    uploadImage(formData: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}public/upload-file`, formData);
    }
}