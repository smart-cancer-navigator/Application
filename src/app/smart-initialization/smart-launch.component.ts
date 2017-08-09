/**
 * Since the SMART on FHIR framework is not built to work with Angular2, this component controls the
 * redirects involved in authentication for fhir-client.js.
 */

// Modules required to access URL parameters.
import {Router, ActivatedRoute, Params} from '@angular/router';
import {OnInit, Component} from '@angular/core';
import {SMARTModule, SMARTReferenceService} from './smart-reference.service';

@Component({
  selector: 'smart-launch',
  template: `    
    <p>{{state}}</p>
  `
})
export class SMARTLaunchComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  state = 'Launching...';

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['iss'] !== null && params['launch'] !== null) {
        SMARTModule.oauth2.authorize({
          // client_id: '1e7af332-b27a-4de2-8c51-728ae3ed25c2',
          client_id: '90453bbe-ba81-492b-b1bb-bcac626d5eef',
          scope: 'launch patient/*.* openid profile',
          redirect_uri: 'http://127.0.0.1:4200/token-reception'
        });
      } else {
        this.state = 'Required URL params were not provided! :(';
        setTimeout(() => { this.router.navigate(['/data-entry']); }, 100); // Wait a second before redirecting.
      }
    });
  }
}
