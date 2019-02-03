import { Component, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Role, StaffProfile, StudentPhoto, StudentProfile } from '../../interfaces';
import { SettingsProvider, WsApiProvider, AppAnimationProvider } from '../../providers';
import { tap } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile>;
  staffProfile$: Observable<StaffProfile[]>;
  visa$: Observable<any>;

  local: boolean = false;


  pages = [
    { title: 'Password Recovery', component: 'PasswordRecoveryPage', icon: 'lock' },
  ];

  constructor(
    private ws: WsApiProvider,
    private settings: SettingsProvider,
    private appAnimationProvider: AppAnimationProvider,
    private elRef: ElementRef
  ) { }

  ionViewDidLoad() {
    this.appAnimationProvider.addAnimationsToSections(this.elRef);
    const role = this.settings.get('role');
    if (role & Role.Student) {
      this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo', true);
      this.profile$ = this.ws.get<StudentProfile>('/student/profile', true);
      this.getProfile();      
    } else if (role & (Role.Lecturer | Role.Admin)) {
      this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile', true);
    }
  }

  getProfile() {
    this.ws
      .get<StudentProfile>("/student/profile")
      .pipe(
        tap(p => {
          if (p.COUNTRY === "Malaysia") {
            this.local = true;
          } else {
            this.local = false;
            this.visa$ = this.getVisaStatus();
          }
        })
      )
      .subscribe();
  }

  getVisaStatus() {
    return this.ws.get<any>("/student/visa_status");
  }

}
