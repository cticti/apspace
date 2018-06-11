import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider, LoadingControllerProvider } from '../../providers';
import { Course, Subcourse, Attendance } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: []
})

export class ResultsPage {

  intakes$: Observable<Course[]>;
  results$: Observable<Subcourse>;

  selectedIntake: string;
  studentId: string;

  constructor(
    private ws: WsApiProvider,
    public loading: LoadingControllerProvider) { }

  getResults(intake: string, refresh: boolean = false): Observable<Subcourse> {
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.results$ = this.ws.get<Subcourse>(`/student/subcourses?intake=${intake}`, refresh, opt).pipe(
      finalize(() => this.loading.dismissLoading())
    )
  }

  ionViewDidLoad() {
    this.loading.presentLoading();
    this.intakes$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(i => this.selectedIntake = i[0].INTAKE_CODE),
      tap(i => this.studentId = i[0].STUDENT_NUMBER),
      tap(i => this.getResults(this.selectedIntake))
    );
  }

  doRefresh(refresher?) {
    this.loading.presentLoading();
    this.results$ = this.getResults(this.selectedIntake, true).pipe(
      finalize(() => refresher.complete() && this.loading.dismissLoading())
    )
  }
}
