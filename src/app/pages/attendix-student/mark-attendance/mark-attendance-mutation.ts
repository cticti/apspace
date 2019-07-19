import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class MarkAttendanceMutation extends Mutation {
  document = gql`
    mutation markAttendance($schedule: String!) {
      markAttendance(schedule: $schedule otp: "123456" student: "TP100340") {
        id
        userArn
        attendance
        lastModified
        modifiedBy
        internapIP
        externalIP
      }
    }
  `;
}
