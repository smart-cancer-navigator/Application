/**
 * Since the SMART on FHIR framework is not built to work with Angular2, this component controls the
 * redirects involved in authentication for fhir-client.js.
 */

// Modules required to access URL parameters.
import { Router, ActivatedRoute, Params } from "@angular/router";
import { OnInit, Component } from "@angular/core";
import { SMARTModule } from "./smart-reference.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: "smart-launch",
  template: `
    <div *ngIf="requiredParametersSupplied === true">
      <h3 class="display-3" style="width: 100%; text-align: center;">Enter Authorization Info</h3>
      <div class="inputPanel">
        <label class="thinFont1">Client ID: </label>
        <input class="form-control" type="text" [(ngModel)]="clientID" placeholder="Ex: 1e7af332-b27a-4de2-8c51-728ae3ed25c2">
      </div>
      <div class="inputPanel">
        <label class="thinFont1">Scopes: </label>
        <input class="form-control" type="text" [(ngModel)]="scopes">
      </div>
      <br>
      <button (click)="authorizeApp()" class="btn btn-success" style="margin: 20px 5%; width: 90%; height: 60px;">Authorize</button>
    </div>
    
    <p *ngIf="requiredParametersSupplied === false">ISS and Launch parameters were not supplied!  Redirecting in 3 seconds...</p>
  `,
  styles: [`
    div {
      padding: 10px;
      overflow: hidden;
    }
    
    div * {
      float: left;
    }
    
    .inputPanel {
      width: 100%;
    }
    
    .inputPanel>* {
      float: left;
    }

    label {
      width: 150px;
      font-size: 25px;
      margin: 0;
    }
    
    input {
      width: calc(90% - 152px);
    }
  `]
})
export class SMARTLaunchComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  requiredParametersSupplied = false;
  clientID = "";
  scopes = "launch patient/*.* openid profile";

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params["iss"] && params["launch"]) {
        this.requiredParametersSupplied = true;
      } else {
        this.requiredParametersSupplied = false;
        setTimeout(() => { this.router.navigate(["/app"]); }, 3000); // Wait a second before redirecting.
      }
    });
  }

  authorizeApp = () => {
    SMARTModule.oauth2.authorize({
      client_id: this.clientID,
      scope: this.scopes,
      redirect_uri: window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/token-reception"
    });
  }
}
