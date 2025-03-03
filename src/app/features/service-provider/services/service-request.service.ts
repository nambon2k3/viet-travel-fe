import { HttpClient, HttpParams } from "@angular/common/http";
import { UserStorageService } from "../../../core/services/user-storage/user-storage.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class ServiceRequestService {   

    getServiceProviderByServiceContactId(id: number) {
        throw new Error('Method not implemented.');
      } 

    constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

    

}