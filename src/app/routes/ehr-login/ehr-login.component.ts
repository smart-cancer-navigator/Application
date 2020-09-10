import { Component } from "@angular/core";
import { CMSService } from "../login-services/cms.service"
import { VAService } from "../login-services/va.service"
import { DownloadZipsService } from "../login-services/download-zips.service"


@Component({templateUrl: 'ehr-login.component.html'})

export class EHRLoginComponent {
    constructor(
        private cmsService: CMSService,
        private vaService: VAService,
        private downloadZipsService: DownloadZipsService
    ) {}
    // called when the "Login to CMS" button is clicked.
    public cmsSignIn() {
        localStorage.setItem("cmsUser", "attempt");
        let auth:string = 
            `https://sandbox.bluebutton.cms.gov/v1/o/authorize/?client_id=${this.cmsService.clientId}&redirect_uri=http://localhost:4200/app&response_type=code&state=test1`;
        location.href = auth;
    }

    public cmsDownload() {
        this.downloadZipsService.downloadCMS();
    }

    // called when the "Login to VA" button is clicked.
    public vaSignIn() {
        localStorage.setItem("vaUser", "attempt");
        var scope = encodeURIComponent("openid offline_access profile email launch/patient veteran_status.read patient/Patient.read patient/AllergyIntolerance.read patient/Condition.read patient/CoverageEligibilityResponse.read patient/CommunityCareEligibility.read patient/DiagnosticReport.read patient/Immunization.read patient/Medication.read patient/MedicationOrder.read patient/MedicationStatement.read patient/Observation.read patient/Procedure.read");
        var auth: string = `https://sandbox-api.va.gov/oauth2/authorization/?client_id=${this.vaService.clientId}&redirect_uri=http://localhost:4200/app&response_type=code&scope=${scope}&state=test1`;
        location.href = auth;
    }
    public vaDownload() {
        this.downloadZipsService.downloadVA();
    }

    
    
}
