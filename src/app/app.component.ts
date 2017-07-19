import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <info-header></info-header>
    <router-outlet></router-outlet>
  `,
})

export class AppComponent {
  title = 'SMART EHR Module (Angular)';
}
