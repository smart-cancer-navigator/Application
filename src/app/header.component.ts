/**
 * This component contains the HTML involved in the construction of the header for the application,
 * and is available in every route of the app (since it contains important data for the user to view).
 * The three components of this header, from left to right, should be the SMART logo, the patient
 * data, and the user name.
 */
import { Component, OnInit } from "@angular/core";
import { SMARTClient } from "./smart-initialization/smart-reference.service";
import { Http } from "@angular/http";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: "header",
  template: `
    <div id="ehrInfo">
      <div id="patientInfoDiv">
        <label for="patientHeader">Patient Context:</label>
        <p id="patientHeader">{{patientData}}</p>
      </div>
      <div id="loadingDiv">
        <!-- Loading stuff will go here -->
        <p></p>
      </div>
      <div id="userInfoDiv">
        <label for="userHeader">User Context:</label>
        <p id="userHeader">{{practitionerData}}</p>
      </div>
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
      overflow: hidden;
    }
    
    #patientInfoDiv {
      width: 40%;
    }

    #userInfoDiv {
      width: 40%;
    }

    #loadingDiv {
      width: 20%;
    }

    label, p {
      color: white;
      margin: 5px 7.5px;
      height: calc(100% - 15px);
      font-size: 20px;
    }
  `]
})

export class HeaderComponent implements OnInit {
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
