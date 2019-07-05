import { Pipe, PipeTransform } from '@angular/core';

import { Timetable } from '../../interfaces';

/**
 * Filter week for timetable.
 */
@Pipe({ name: 'theweek' })
export class TheWeekPipe implements PipeTransform {
  /**
   * Filter timetable by week.
   *
   * @param tt - timetable
   * @param date - filter week if exists
   */
  transform(tt: Timetable[], date: Date): Timetable[] {
    const nextDate = new Date(date.getTime());  // do not modify date
    nextDate.setDate(nextDate.getDate() + 7);
    return tt.filter(t => new Date(t.DATESTAMP_ISO) < nextDate);
  }
}
