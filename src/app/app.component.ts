import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <github-fork-us></github-fork-us>
    <header></header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
}
