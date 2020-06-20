import { Component } from "@angular/core";

@Component({
  selector: "team",
  templateUrl: 'team.component.html'
})
export class TeamComponent {
  contributors: string[] = ["Gil Alterovitz, PhD", "Jeremy Warner, MD, MS", "Makiah Bennett", "Ishaan Prasad", "Monica Arniella", "Alicia Beeghly-Fadiel, PhD", "Varun Suraj"];

  emailDisplay: string = "(Click to reveal)";
  updateEmail(): void
  {
    this.emailDisplay = "ga@alum.mit.edu";
  }
}
