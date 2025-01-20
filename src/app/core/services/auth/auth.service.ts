import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UserStorageService } from '../user-storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) { }
  
  // register(signupRequest: any) : Observable<any> {
  //   return this.http.post(BASIC_URL + 'signup', signupRequest);
  // }

  login(username: string, password: string) : any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = {username, password};

    return this.http.post(BASIC_URL + 'auth', body, { headers, observe: 'response' }).pipe(
      map((response: any) => {
        const token = response.body.data.token;
        const user = response.body.data.username;
        if (token && user) {
          this.userStorageService.saveToken(token);
          this.userStorageService.saveUser(user);
          return true;
        }
    
        return false;
      })
    );    
  }
}
