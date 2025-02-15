import { HttpClient, HttpParams } from "@angular/common/http";
import { UserStorageService } from "../../../../../core/services/user-storage/user-storage.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class BlogService {
    getTagsByBlogId(id: number) {
      throw new Error('Method not implemented.');
    }
    getAuthorById(authorId: number) {
      throw new Error('Method not implemented.');
    }

    constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

    getBlogByPage(page: number = 0, size: number = 10, keyword?: string, isDeleted?: boolean): Observable<any> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (keyword) {
            params = params.set('keyword', keyword);
        }
        if (isDeleted !== undefined) {
            params = params.set('isDeleted', isDeleted);
        }

        return this.http.get(`${environment.apiUrl}marketing/blog/list`, { params });
    }


    updateBlogStatus(id: number, isDeleted: boolean): Observable<any> {
        return this.http.post(`${environment.apiUrl}marketing/blog/change-status/${id}`,  isDeleted);
    }

    getBlogById(id: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}marketing/blog/details/${id}`);
    }

    update(formData: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}marketing/blog/update`, formData);
    }
}