import { Pipe, PipeTransform } from '@angular/core';

import { Status } from './status.interface';

/**
 * Filter type of attendance.
 */
@Pipe({
  name: 'attendance'
})
export class AttendancePipe implements PipeTransform {

  /**
   * Filter type of attendance or return everything.
   *
   * @param students - array of student
   * @param attendance - matched attendance
   * @return students - filtered students
   */
  transform(students: Status[] | null, attendance: string): Status[] {
    if (students === null) {
      return [];
    } else if (attendance) {
      return students.filter(student => student.attendance === attendance);
    } else {
      return students;
    }
  }

}
