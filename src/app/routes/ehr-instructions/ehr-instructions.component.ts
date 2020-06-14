import {Component} from "@angular/core";
import { CMSService } from "../login-services/cms.service"
import { ActivatedRoute } from "@angular/router";

@Component({templateUrl: 'ehr-instructions.component.html'})

export class EHRInstructionsComponent {
    constructor(
        private cmsService: CMSService
    ) {}

    public cmsSignIn() {
        let auth:string = 
            `https://sandbox.bluebutton.cms.gov/v1/o/authorize/?client_id=${this.cmsService.clientId}&redirect_uri=http://localhost:4200/app&response_type=code&state=test1`;
        location.href = auth;
    }
}
