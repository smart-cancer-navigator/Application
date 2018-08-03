import { Component } from "@angular/core";

@Component({
  selector: "team",
  template: `
    <div style="overflow: hidden">
      <div class="cardContent" *ngFor="let contributor of contributors" style="margin: 15px 8px; width: calc(50% - 16px); min-width: 300px;">
        <div style="width: 100%;">
          <h2 class="thick">{{contributor}}</h2>
        </div>
      </div>
    </div>
    
    <hr>
    
    <div>
      <div class="cardContent" style="margin: 8px; width: calc(100% - 16px);">
        <div style="width: 100%;">
          <h2 class="thick">Questions?  You can reach us at <a href="javascript:void(0)" (click)="updateEmail()">{{emailDisplay}}</a></h2>
        </div>
      </div>
    </div>
  `,
  styles: [`    
    .cardContent {
      float: left;
    }

    .cardImage {
      float: left;
      width: 30%;
      min-width: 150px;
      max-width: 100%;
    }

    .cardImage>div, .cardContent>div {
      float: left;
      background-color: white;
      box-shadow: 1px 3px #d5d5d5;
      border: 1px solid #d1d1d1;
      padding: 15px;
      text-align: center;
    }

    .cardImage img {
      width: 100%;
      height: auto;
    }
  `]
})
export class TeamComponent {
  contributors: string[] = ["Gil Alterovitz, PhD", "Jeremy Warner, MD, MS", "Makiah Bennett", "Ishaan Prasad", "Monica Arniella", "Alicia Beeghly-Fadiel, PhD"];

  emailDisplay: string = "(Click to reveal)";
  updateEmail(): void
  {
    this.emailDisplay = "ga@alum.mit.edu";
  }
}
