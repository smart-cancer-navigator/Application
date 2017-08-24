/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */
import { Component, OnInit } from "@angular/core";
import { SMARTClient } from "./smart-initialization/smart-reference.service";
import {Router} from "@angular/router";

@Component({
  selector: "header",
  template: `
    <div id="ehrInfo">
      <p *ngIf="patientData !== ''">Patient: {{patientData}} ----- User: {{practitionerData}}</p>
      <a id="ehrLink" *ngIf="patientData === ''" href="javascript:void(0)" (click)="viewEHRInstructions()">EHR Link Instructions</a>
      
      <a href="https://www.github.com/smart-co/Application">
        <img src="/assets/github-icon.png"  ngbPopover="Fork us on GitHub!" triggers="mouseenter:mouseleave" placement="left">
      </a>
    </div>
  `,
  styles: [`
    #ehrInfo {
      background-color: black;
      height: 40px;
      overflow: hidden;
    }
    
    #ehrInfo * {
      float: left;
    }

    p, #ehrLink {
      text-align: center;
      color: white;
      width: calc(100% - 55px);
      margin: 5px 7.5px;
      height: calc(100% - 15px);
      font-size: 20px;
    }
    
    img {
      height: 30px; 
      width: 30px; 
      margin: 5px;
      float: right;
    }
  `]
})

export class HeaderComponent implements OnInit {
  constructor (private router: Router) {}

  patientData: string = "";
  practitionerData: string = "";

  ngOnInit(): void {
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

  viewEHRInstructions() {
    this.router.navigate(["ehr-instructions"]);
  }
}
