import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  setUserProfile(profileData: any) {
    this.userProfileSubject.next(profileData);
  }

  setUserAvatar(profileData: any) {
    this.userProfileSubject.value.avatar = profileData;
  }
}
