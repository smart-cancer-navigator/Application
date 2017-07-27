/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */

import { Component, OnInit } from '@angular/core';
import {SMARTClient} from './smart-reference.service';

@Component({
  selector: 'info-header',
  template: `
    <div id="header">
      <img id="smartLogo" src="assets/smart-logo.png">
      <p id="patientHeader">{{patientData}}</p>
      <p id="userHeader">{{practitionerData}}</p>
    </div>
  `,
  styles: [`
    #header {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;

      background-color: #dbdbdb;
      padding: 5px;
      text-align: center;
    }

    #header * {
      margin: 0;
      float: left;
    }

    #header p {
      font-size: 30px;
    }

    #smartLogo {
      width: auto;
      height: 75%;
    }

    #patientHeader {
      width: 60%;
      color: black;
    }

    #userHeader {
      width: 30%;
      color: black;
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
