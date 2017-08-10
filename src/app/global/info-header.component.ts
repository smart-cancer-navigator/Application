/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */

import { Component, OnInit } from "@angular/core";
import { SMARTClient } from "../smart-initialization/smart-reference.service";
import {Http} from "@angular/http";

@Component({
  selector: "info-header",
  template: `
    <div class="root">
      <div style="float: left">
        <label for="patientHeader">Patient Context:</label>
        <p id="patientHeader">{{patientData}}</p>
      </div>
      <div style="float: right">
        <label for="userHeader">User Context:</label>
        <p id="userHeader">{{practitionerData}}</p>
      </div>
    </div>
  `,
  styles: [`
    .root {
      background-color: black;
      height: 40px;
    }

    .root label, p {
      color: white;
      margin: 5px 7.5px;
      font-size: 20px;
      float: left;
    }
  `]
})

export class InfoHeaderComponent implements OnInit {
  constructor (private http: Http) {}

  patientData: string = "";
  practitionerData: string = "";

  ngOnInit(): void {
    this.patientData = "Undefined";
    this.practitionerData = "Undefined";

    // Once set, the function will be called.
    SMARTClient.subscribe(smart => this.setHeaderData(smart));
  }

  setHeaderData = (smartClient: any) => {
    if (smartClient === null) {
      return;
    }

    console.log("SMART Client", smartClient);

    smartClient.patient.read().then((p) => {
      console.log("SMART Patient", p);

      this.patientData = p.name[0].given[0] + " " + p.name[0].family;
    });

    smartClient.user.read().then((u) => {
      console.log("SMART User", u);

      this.practitionerData = u.name[0].given[0] + " " + u.name[0].family;
    });
  }
}
