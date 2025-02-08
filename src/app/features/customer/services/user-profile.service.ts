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

  setUserAvatar(avatarUrl: string) {
    const currentProfile = this.userProfileSubject.value;
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, avatar: avatarUrl };
      this.userProfileSubject.next(updatedProfile);
    }
  }
}
