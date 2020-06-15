import { Component } from "@angular/core";
import { CMSService } from "../login-services/cms.service"
import { VAService } from "../login-services/va.service"


@Component({templateUrl: 'ehr-instructions.component.html'})

export class EHRInstructionsComponent {
    constructor(
        private cmsService: CMSService,
        private vaService: VAService
    ) {}

    public cmsSignIn() {
        let auth:string = 
            `https://sandbox.bluebutton.cms.gov/v1/o/authorize/?client_id=${this.cmsService.clientId}&redirect_uri=http://localhost:4200/app&response_type=code&state=test1`;
        location.href = auth;
    }

    public vaSignIn() {
        var scope = encodeURIComponent("openid offline_access profile email launch/patient veteran_status.read patient/Observation.read patient/Patient.read patient/Condition.read");
        var auth: string = `https://sandbox-api.va.gov/oauth2/authorization/?client_id=${this.vaService.clientId}&redirect_uri=http://localhost:4200/app&response_type=code&scope=${scope}&state=test1`;
        location.href = auth;
    }
}
