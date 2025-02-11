import { HttpClient, HttpParams } from "@angular/common/http";
import { UserStorageService } from "../../../../../core/services/user-storage/user-storage.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

const BASIC_URL = "http://localhost:8080/api/v1/marketing/blog";

@Injectable({
    providedIn: 'root',
})

export class BlogService {

    constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

    getBlogByPage(page: number = 0, size: number = 10, keyword?: string, isDeleted?: boolean): Observable<any> {
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

        return this.http.get(`${BASIC_URL}/list`, { params });
    }

}