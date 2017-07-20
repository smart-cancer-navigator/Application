/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'info-header',
  template: `
    <div id="header">
      <img id="smartLogo" src="assets/smart-logo.png">
      <p id="patientHeader">John Smith - Age 42 - Thyroid Cancer</p>
      <p id="userHeader">Rebecca Cohen, M.D.</p>
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
      color: #fff;
    }

    #userHeader {
      width: 30%;
      color: #fff;
    }
  `]
})

export class InfoHeaderComponent {
}
