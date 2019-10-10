import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Apcard } from '../../interfaces';
import { WsApiService } from 'src/app/services';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-apcard',
  templateUrl: './apcard.page.html',
  styleUrls: ['./apcard.page.scss'],
})
export class ApcardPage implements OnInit {
  transaction$: Observable<Apcard[]>;

  skeletonConfig = [
    { numOfTrans: new Array(4) },
    { numOfTrans: new Array(1) },
    { numOfTrans: new Array(7) },
    { numOfTrans: new Array(2) },
    { numOfTrans: new Array(6) }
  ];
  isLoading: boolean;


  constructor(
    private ws: WsApiService,
    private router: Router,
  ) { }


  ngOnInit() {
    this.doRefresh();
  }
  /** Generating header value (virtual scroll) */
  seperatebyMonth(record: Apcard, recordIndex: number, records: Apcard[]) {
    if (recordIndex === 0) { // first header value - current month
      return moment(record.SpendDate).format('MMMM YYYY').toUpperCase();
    }
    const previousRecordDate = moment(records[recordIndex - 1].SpendDate).format('MMMM YYYY');
    const currentRecordDate = moment(record.SpendDate).format('MMMM YYYY');

    if (previousRecordDate !== currentRecordDate) {
      return currentRecordDate.toUpperCase();
    }
    return null;
  }

  /** Negate spend value for top ups. */
  signTransactions(transactions: Apcard[]): Apcard[] {
    transactions.forEach(transaction => {
      if (transaction.ItemName !== 'Top Up') {
        // always make it negative (mutates cached value)
        transaction.SpendVal = -Math.abs(transaction.SpendVal);
      }
    });
    return transactions;
  }

  getAbsoluteValue(num: number): number {
    return Math.abs(num);
  }

  doRefresh(refresher?) {
    this.isLoading = true;
    this.transaction$ = this.ws.get<Apcard[]>('/apcard/', refresher).pipe(
      map(transactions => this.signTransactions(transactions)),
      finalize(() => refresher && refresher.target.complete()),
      finalize(() => (this.isLoading = false))
    );
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }

}
