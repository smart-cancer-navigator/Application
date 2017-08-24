/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */
import { Component, OnInit } from "@angular/core";
import { SMARTClient } from "../smart-initialization/smart-reference.service";
import { Http } from "@angular/http";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: "info-header",
  template: `
    <div id="ehrInfo">
      <div style="float: left">
        <label for="patientHeader">Patient Context:</label>
        <p id="patientHeader">{{patientData}}</p>
      </div>
      <div style="float: right">
        <label for="userHeader">User Context:</label>
        <p id="userHeader">{{practitionerData}}</p>
      </div>
    </div>

    <div id="routingInfo">
      <div style="background-color: #3e5cff;" (click)="navigateToRoute('ehr-entry')" (mouseover)="hovering[0] = true" (mouseleave)="hovering[0] = false" [style.opacity]="currentRoute === '/ehr-entry' || hovering[0] ? 1 : 0.6">
        <img src="/assets/browser-icon.png"><br>
        <p class="thinFont1">Link to EHR</p>
      </div>
      <div style="background-color: #ff3a3c;" (click)="navigateToRoute('data-entry')" (mouseover)="hovering[1] = true" (mouseleave)="hovering[1] = false" [style.opacity]="currentRoute === '/data-entry' || hovering[1] ? 1 : 0.6">
        <img src="/assets/pen-icon.png">
        <p class="thinFont1">Enter Genomic Data</p>
      </div>
      <div style="background-color: #378053;" (click)="navigateToRoute('visualize-results')" (mouseover)="hovering[2] = true" (mouseleave)="hovering[2] = false" [style.opacity]="currentRoute === '/visualize-results' || hovering[2] ? 1 : 0.6">
        <img src="/assets/thumbs-up-icon.png">
        <p class="thinFont1">Result Visualization</p>
      </div>
    </div>
  `,
  styles: [`
    #ehrInfo {
      background-color: black;
      height: 40px;
      overflow: hidden;
    }

    #ehrInfo label, p {
      color: white;
      margin: 5px 7.5px;
      font-size: 20px;
      float: left;
    }
    
    #routingInfo {
      overflow: hidden;
    }
    
    #routingInfo>div {
      float: left;
      width: calc(100% / 3);
      padding: 15px;
      text-align: center;
    }
    
    #routingInfo>div>* {
      width: 100%;
    }
    
    #routingInfo>div>img {
      height: 50px;
      width: 50px;
     }
  `]
})

export class InfoHeaderComponent implements OnInit {

  constructor (private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url.indexOf("?") >= 0) {
          this.currentRoute = val.url.substring(0, val.url.indexOf("?"));
        } else {
          this.currentRoute = val.url;
        }
      }
    });
  }

  patientData: string = "";
  practitionerData: string = "";
  currentRoute: string = "";

  hovering: boolean[] = [false, false, false];

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

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }
}
