import { Injectable } from "@angular/core"
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { VAService } from "./va.service"
import { CMSService } from "./cms.service"

@Injectable()
export class DownloadZipsService {
    constructor(
        private vaService: VAService,
        private cmsService: CMSService
    ) {}

    // downloadVA() {
    //     var vaUser = this.vaService.getLocalStorageToken();
    //     this.vaService.accessToken = vaUser['access_token'];
    //     var patientId = vaUser['patient']
    //     var zip = new JSZip();
    //     this.vaService.patientInfo(patientId).subscribe(patientInfo => {
    //         zip.file("Patient.json", JSON.stringify(patientInfo,null,"    "));
    //         this.vaService.conditionInfo(patientId).subscribe(conditionInfo => {
    //             zip.file("Condition.json", JSON.stringify(conditionInfo,null,"    "));
    //             zip.generateAsync({ type: "blob" }).then(function (content) {
    //                 FileSaver.saveAs(content, "VA.zip");
    //             });
    //         })
            
    //     })
        
    // }

    downloadVA() {
        var zip = new JSZip();
        var vaUser = this.vaService.getLocalStorageToken();
        this.vaService.accessToken = vaUser['access_token'];
        var patientId = vaUser['patient']
        this.vaService.allergyIntoleranceInfo(patientId).subscribe(allergyIntoleranceInfo => {
            console.log("patient/AllergyIntolerance.read")
            console.log(allergyIntoleranceInfo);
            zip.file("AllergyIntolerance.json", JSON.stringify(allergyIntoleranceInfo,null,"    "))
            this.vaService.conditionInfo(patientId).subscribe(conditionInfo => {
                console.log("patient/Condition.read")
                console.log(conditionInfo);
                zip.file("Condition.json", JSON.stringify(conditionInfo,null,"    "))
                this.vaService.diagnosticReportInfo(patientId).subscribe(diagnosticReportInfo => {
                    console.log("patient/DiagnosticReport.read")
                    console.log(diagnosticReportInfo);
                    zip.file("DiagnosticReport.json", JSON.stringify(diagnosticReportInfo,null,"    "))
                    this.vaService.immunizationInfo(patientId).subscribe(immunizationInfo => {
                        console.log("patient/Immunization.read")
                        console.log(immunizationInfo);
                        zip.file("Immunization.json", JSON.stringify(immunizationInfo,null,"    "))
                        this.vaService.medicationOrderInfo(patientId).subscribe(medicationOrderInfo => {
                            console.log("patient/MedicationOrder.read")
                            console.log(medicationOrderInfo);
                            zip.file("MedicationOrder.json", JSON.stringify(medicationOrderInfo,null,"    "))
                            this.vaService.medicationStatementInfo(patientId).subscribe(medicationStatementInfo => {
                                console.log("patient/MedicationStatement.read")
                                console.log(medicationStatementInfo);
                                zip.file("MedicationStatement.json", JSON.stringify(medicationStatementInfo,null,"    "))
                                this.vaService.observationInfo(patientId).subscribe(observationInfo => {
                                    console.log("patient/Observation.read")
                                    console.log(observationInfo)
                                    zip.file("Observation.json", JSON.stringify(observationInfo,null,"    "))
                                    this.vaService.patientInfo(patientId).subscribe(patientInfo => {
                                        console.log("patient/Patient.read")
                                        console.log(patientInfo)
                                        zip.file("Patient.json", JSON.stringify(patientInfo,null,"    "))
                                        this.vaService.procedureInfo(patientId).subscribe(procedureInfo => {
                                            console.log("patient/Procedure.read")
                                            console.log(procedureInfo)
                                            zip.file("Procedure.json", JSON.stringify(allergyIntoleranceInfo,null,"    "))
                                            zip.generateAsync({ type: "blob" }).then(function (content) {
                                                FileSaver.saveAs(content, "VA.zip");
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    downloadCMS() {
        var zip = new JSZip();
        var cmsUser = this.cmsService.getLocalStorageToken();
        this.cmsService.accessToken = cmsUser['access_token'];
        var patientId = cmsUser['patient']


        this.cmsService.patientInfo(patientId).subscribe(patientInfo => {
            console.log("patient/Patient.read")
            console.log(patientInfo);
            zip.file("Patient.json", JSON.stringify(patientInfo,null,"    "))
            this.cmsService.eobInfo(patientId).subscribe(eobInfo => {
                console.log("patient/ExplanationOfBenefit.read")
                console.log(eobInfo);
                zip.file("ExplanationOfBenefit.json", JSON.stringify(eobInfo,null,"    "))
                this.cmsService.coverageInfo(patientId).subscribe(coverageInfo => {
                    console.log("patient/Coverage.read")
                    console.log(coverageInfo);
                    zip.file("Coverage.json", JSON.stringify(coverageInfo,null,"    "))
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        FileSaver.saveAs(content, "CMS.zip");
                    });


                })
            })
        })
    }




}