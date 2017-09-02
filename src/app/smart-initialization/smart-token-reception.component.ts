/**
 * After being directed here as per the redirect_uri in smart-launch, this route receives the token
 * data and then applies the token as necessary.
 */

// Modules required to access URL parameters.
import { Router } from "@angular/router";
import { OnInit, Component } from "@angular/core";
import { SMARTReferenceService } from "./smart-reference.service";

@Component({
  selector: "smart-launch",
  template: `
    <p>{{state}}</p>
  `
})

export class SMARTTokenReceptionComponent implements OnInit {
  constructor(private smartReferenceService: SMARTReferenceService, private router: Router) {}

  state = "Receiving token...";

  ngOnInit() {
    // Set up the client reference.
    this.smartReferenceService.ready();

    // Redirect to the disease selection.
    setTimeout(() => this.router.navigate(["/app"]), 100);
  }
}
