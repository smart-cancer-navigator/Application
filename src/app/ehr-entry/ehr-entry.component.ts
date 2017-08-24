/**
 * Used to link to some EHR, by entering client ID, redirect URI, iss param, etc.
 */
import {Component} from "@angular/core";
import {Router} from "@angular/router";

export let CLIENT_ID = "";

@Component({
  selector: "ehr-entry",
  template: `
    <h1 class="display-1">Enter EHR Information</h1>
    <form (ngSubmit)="onSubmitEHRInfo()" ngNativeValidate>
      <div class="form-group">
        <input class="form-control" type="text" placeholder="EHR Metadata Endpoint" name="metadata" [(ngModel)]="metadataEndpoint" required>
      </div>
      <div class="form-group">
        <input class="form-control" type="text" placeholder="Client ID" name="clientID" [(ngModel)]="clientID" required>
        <input class="form-control" type="text" placeholder="Scope(s) (Default: launch patient/*.* openid profile)" name="scopes" [(ngModel)]="scopes">
        <button class="btn btn-success" type="submit">Establish EHR Link</button>
      </div>
    </form>
  `,
  styles: [`
    input {
      text-align: center;
      margin: 5px;
    }
  `]
})
export class EHREntryComponent {
  constructor (private router: Router) {}

  metadataEndpoint: string = "";
  scopes: string = "";
  clientID: string = "";

  onSubmitEHRInfo() {
    console.log("Got submit");
    console.log("Is currently " + window.location.href);
    const originRoute = window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/data-entry";
    const params = "?iss=" + this.metadataEndpoint + "&state=" + this.makeid();
    CLIENT_ID = this.clientID;
    window.location.href = originRoute + params;
  }

  makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
