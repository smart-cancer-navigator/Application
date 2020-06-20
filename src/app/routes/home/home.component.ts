/**
 * The landing page for the app, which tells the user what the app does, what the purpose of the appis, and why
 */
import { Component } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { Router } from "@angular/router";

@Component({
  selector: "home",
  templateUrl: 'home.component.html',
  animations: [
  ]
})
export class LandingPageComponent {
  constructor (private router: Router) {}

  navigateToVisualization() {
    this.router.navigate(["/app"]);
  }
}
