import { Component, OnInit } from '@angular/core';
import {SMARTReferenceService} from './smart-reference.service';

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
      margin: 50px;
      width: calc(100% - 100px);
    }
  `]
})

export class AppComponent implements OnInit {
  title = 'SMART EHR Module (Angular)';

  ngOnInit(): void {
  }
}
