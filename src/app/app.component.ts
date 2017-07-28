import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <info-header></info-header>
    <div id="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    #content {
      margin: 0 50px;
      width: calc(100% - 100px);
    }
  `]
})

export class AppComponent implements OnInit {
  title = 'SMART EHR Module (Angular)';

  ngOnInit(): void {
  }
}
