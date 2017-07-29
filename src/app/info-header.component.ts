/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */

import { Component, OnInit } from '@angular/core';
import { SMARTClient } from './smart-reference.service';

@Component({
  selector: 'info-header',
  template: `
    <div id="dataHeading">
      <div id="patientData" class="headingData">
        <label for="patientHeader">Patient Context:</label>
        <p id="patientHeader">{{patientData}}</p>
      </div>
      <div id="userData" class="headingData">
        <label for="userHeader">User Context:</label>
        <p id="userHeader">{{practitionerData}}</p>
      </div>
    </div>
  `,
  styles: [`
    #dataHeading {
      height: 40px;
      width: 100%;

      background-color: #000000;
      padding: 5px;
      text-align: center;
    }

    #patientData {
      float: left;
      width: 65%;
      height: 30px;
      margin: 0;
    }

    #userData {
      float: left;
      width: 35%;
      height: 30px;
      margin: 0;
    }

    .headingData * {
      float: left;
      font-size: 22px;
      margin: 9px 0;
      color: white;
    }

    .headingData label {
      margin-right: 15px;
    }
  `]
})

export class InfoHeaderComponent implements OnInit {
  patientData: string = '';
  practitionerData: string = '';

  ngOnInit(): void {
    this.patientData = 'Undefined';
    this.practitionerData = 'Undefined';

    // Once set, the function will be called.
    SMARTClient.subscribe(smart => this.setHeaderData(smart));
  }

  setHeaderData = (smartClient: any) => {
    if (smartClient === null) {
      return;
    }

    console.log('Got ', smartClient);

    smartClient.patient.read().then((p) => {
      console.log('SMART Patient', p);

      this.patientData = p.name[0].given[0] + ' ' + p.name[0].family;
    });

    smartClient.user.read().then((u) => {
      console.log('SMART User', u);

      this.practitionerData = u.name[0].given[0] + ' ' + u.name[0].family;
    });
  }
}
