import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <info-header></info-header>
    <div id="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`    
    #content {
      display: block;
      margin: 0 20px;
      width: calc(100% - 40px);
    }
  `]
})

export class AppComponent {
  title = "SMART EHR Module (Angular)";
}
