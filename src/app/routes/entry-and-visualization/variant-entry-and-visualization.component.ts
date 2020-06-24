import { Component, OnInit } from "@angular/core";
import { Variant } from "./genomic-data";
import { SMARTClient } from "../../smart-initialization/smart-reference.service";
import { VariantSelectorService } from "./variant-selector/variant-selector.service";
import { trigger, state, style, animate, transition } from "@angular/animations";
import {Router} from "@angular/router";
import {FeedbackFormModalComponent} from "../feedback-form/feedback-form-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {isNullOrUndefined} from "util";
import { Patient, Condition } from "./patient";
import { CMSService } from "../login-services/cms.service";
import { VAService } from "../login-services/va.service";
import { ActivatedRoute } from "@angular/router";

class VariantWrapper {
  constructor(_index: number, _variant: Variant) {
    this.index = _index;
    this.variant = _variant;
    this.drawerState = "closed";
    this.saved = false;
  }

  variant: Variant;
  index: number;
  drawerState: string; // Open or closed.
  saved: boolean;

  public toggleDrawer = () => {
    this.drawerState = this.drawerState === "closed" ? "open" : "closed";
  }
}

@Component({
  selector: "variant-entry-and-visualization",
  template: `
    <div id="patientLinkState">
      <!-- If an EHR link is NOT detected -->
      <div id="suggestEHRLink" *ngIf="offerToLinkToEHRInstructions">
        <div id="suggestions">
          <img src="/assets/entry-and-visualization/info-icon.png">
          <p class="thick" style="color:#fff">SMART Cancer Navigator is not connected to an EHR. <a style="color:#891924" href="javascript:void(0)" (click)="routeToInstructions()">Learn how to connect.</a></p>
        </div>
        <button class="btn btn-danger" (click)="offerToLinkToEHRInstructions = false"><div style="margin-top:-3px; margin-right:-2px">&times;</div></button>
      </div>

      <!-- If an EHR link is detected -->
      <div id="patientInfo" *ngIf="patientExists" [style.background-color]="patient.gender === 'male' ? '#27384f' : '#ff45f7'">
        <img [src]="patient.gender === 'male' ? '/assets/entry-and-visualization/male-icon.png' : '/assets/entry-and-visualization/female-icon.png'">

        <!-- Patient Details -->
        <p style="color: white">
        <b>Name: </b> {{patient.firstName}} {{patient.lastName}} |
          <b>Zip Code:</b> {{patient.zipCode}} | <b>Age:</b> {{patient.age}} | 
          <b>Condition:</b> 
          <select style="font-size: 15px;">
            <option *ngFor="let condition of patient.conditions">{{condition.display}}</option>
          </select>
        </p>

        <div id="autosyncToggle">
          <div>
            <ui-switch [ngModel]="autosync" (ngModelChange)="onToggleAutosync($event)"></ui-switch>
            <p class="thick" style="color: white">Auto-Sync</p>
          </div>
        </div>
      </div>
    </div>

    <div id="variantVisualizations">
      <div class="variantWrapper" *ngFor="let variant of variants; let i = index">
        <div class="variantSelector">
          <div [style.width]="i === variants.length - 1 ? '100%' : 'calc(100% - 38px)'">
            <variant-selector [ngModel]="variant.variant"
                              (ngModelChange)="variant.variant = $event; addRowMaybe(i); saveEHRVariant(variant);"></variant-selector>
          </div>
          <button style="font-size:200%" class="removeRowButton btn btn-danger" (click)="removeRow(i)" *ngIf="i !== variants.length - 1"><div style="margin-top:-8px; margin-right:-2px;">&times;</div>
          </button>
        </div>
        <div>
          <div class="visualizationContent" [@drawerAnimation]="variant.drawerState">
            <variant-visualization [(ngModel)]="variant.variant"></variant-visualization>
          </div>
          <div *ngIf="variant.variant !== undefined && variant.variant !== null" class="informationToggle"
               (click)="variant.toggleDrawer()">
            <img src="/assets/entry-and-visualization/dropdown.svg">
          </div>
        </div>
      </div>
    </div>

    <!-- Review form question -->
    <div id="askForReviewDiv" *ngIf="userInteractionPoints >= 3 && askForReview">
      <a href="javascript:void(0)" (click)="openFeedbackForm()">
        <ngb-alert [type]="'primary'" (close)="askForReview = false">Please review our service!</ngb-alert>
      </a>
    </div>
  `,
  styles: [`
    p {
      margin: 0;
    }

    #patientLinkState {
      margin-left: 6%;
      margin-right: 6%;
    }

    #suggestEHRLink {
      height: 80px;
      width: 100%;

      background-color: #dc3545;
      overflow: hidden;
    }

    #suggestEHRLink > * {
      float: left;
    }

    #suggestEHRLink > #suggestions {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% - 60px);
      height: 100%;
    }

    #suggestEHRLink img {
      width: 60px;
      height: 60px;
      margin: 1% 10px;
    }

    #suggestEHRLink p {
      width: calc(96% - 80px);
      margin: 1%;
      font-size: 20px;
      color: black;
    }

    #suggestEHRLink button {
      width: 30px;
      height: 30px;
      color: white;
      font-size: 130%;
      border-radius: 0px 0px 0px 10px;
      padding: 0;
      float: right;
    }

    #patientLinkState > div {
      border-bottom-left-radius: 30px;
      border-bottom-right-radius: 30px;
    }

    #patientInfo {
      display: flex;
      justify-content: center;
      align-items: center;

      height: 80px;
      width: 100%;

      overflow: hidden;

      text-align: center;
    }

    #patientInfo img {
      width: 60px;
      height: 60px;
      margin: 10px;
    }

    #patientInfo p {
      width: calc(96% - 280px);
      margin: 1%;
      font-size: 20px;
      color: black;
    }
    
    #autosyncToggle {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 200px;
      height: 100%;
    }

    #autosyncToggle > div {
      width: 100%;
    }

    #autosyncToggle > div > p {
      width: 100%;
    }

    #variantVisualizations {
      padding: 15px;
      margin-top: 2%;
      margin-left: 4%;
      margin-right: 4%;
      background-color: white;
    }

    .variantWrapper {
      margin-bottom: 5px;
    }

    .variantSelector {
      height: 38px;
    }

    .variantSelector > * {
      float: left;
      height: 100%;
    }

    .removeRowButton {
      width: 38px;
      font-size: 20px;
      color: white;
      padding: 0;
    }

    .informationToggle {
      width: 100%;
      background-color: #e2e2e2;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      text-align: center;
      height: 30px;
    }

    .visualizationContent {
      overflow: scroll;
    }

    .informationToggle:hover {
      background-color: #b2b2b2;
    }

    .informationToggle img {
      height: 10px;
      width: 10px;
      margin: 10px;
    }

    #askForReviewDiv {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
    }
  `],
  animations: [
    trigger("drawerAnimation", [
      state("closed", style({
        height: "0"
      })),
      state("open", style({
        height: "700px"
      })),
      transition("closed => open", animate("400ms ease-in-out")),
      transition("open => closed", animate("400ms ease-in-out"))
    ])
  ]
})
export class VariantEntryAndVisualizationComponent implements OnInit {
  constructor(
    private selectorService: VariantSelectorService,
    private router: Router,
    private modalService: NgbModal,
    private cmsService: CMSService,
    private vaService: VAService,
    private activatedRoute: ActivatedRoute) {}

  // This is what we're using to determine whether the user is worthy to rate our service (has interacted enough with the service).
  userInteractionPoints: number = 0;
  askForReview: boolean = true;

  variants: VariantWrapper[] = [];

  offerToLinkToEHRInstructions = true;
  patientExists = false;
  patientObject: Object = null;
  patientAge: number = -1;
  patientConditions: string[] = [];
  patient: Patient = null;

  // Toggled by the user depending on whether they want to sync to the EHR their changes right away (as soon as they make them)
  autosync: boolean = true;

  ngOnInit()
  {
    this.addRow();
    this.offerToLinkToEHRInstructions = true;
    this.patientExists = false;
    
    // everything inside this activatedRoute statement is going towards getting VA/CMS API data
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code']; // necessary for both logins
      const state = params['state']; // necessary for VA logim
      
      // va trying to log on for the first time
      if (localStorage.getItem("vaUser") == "attempt") {
        this.vaService.getToken("User", code, state).subscribe(data => {
          this.vaService.accessToken = data.access_token;
          localStorage.setItem("vaUser", "in");
          location.reload();
        });
      }
      // cms log on for first time
      if (localStorage.getItem("cmsUser") == "attempt") {
        this.cmsService.getToken("User", code).subscribe(data => {
          this.cmsService.accessToken = data.access_token;
          localStorage.setItem("cmsUser", "in");
          location.reload();
        });
      }

      // can occur after the auto-refresh, or if the user refreshes/navigates to another page
      if (localStorage.getItem("vaUser") == 'in' && localStorage.getItem("cmsUser") == null) {
        var currentUser = this.vaService.getLocalStorageToken();
        this.vaService.accessToken = currentUser['access_token'];
        this.getVAInfo(currentUser['patient']);
      }
      if (localStorage.getItem("cmsUser") == 'in' && localStorage.getItem("vaUser") == null) {
        var currentUser = this.cmsService.getLocalStorageToken();
        console.log(currentUser);
        this.cmsService.accessToken = currentUser['access_token'];
        this.getCMSInfo(currentUser['patient']);
      }
      // if we have the access token for both VA and CMS, then we run a different function to combine their informations
      if (localStorage.getItem("vaUser") == 'in' && localStorage.getItem("cmsUser") == "in") {
        var vaUser = this.vaService.getLocalStorageToken();
        var cmsUser = this.cmsService.getLocalStorageToken();
        this.vaService.accessToken = vaUser['access_token'];
        this.cmsService.accessToken = cmsUser['access_token'];
        this.getBothInfo(vaUser['patient'], cmsUser['patient']);
      }

    },
    error => {
    });

    // As soon as the smart client is loaded from the SMART JS library, this creates the patient info header and populates the patient variants.
    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      this.offerToLinkToEHRInstructions = false;

      // Get all patient information.
      smartClient.patient.read().then(p => {
        console.log("Patient read is ", p);
        this.patientObject = p;
        if (p.birthDate && p.active) {
          const birthDateValues = p.birthDate.split("-");
          const timeDiff = Math.abs(Date.now() - new Date(parseInt(birthDateValues[0]), parseInt(birthDateValues[1]), parseInt(birthDateValues[2])).getTime());
          // Used Math.floor instead of Math.ceil so 26 years and 140 days would be considered as 26, not 27.
          this.patientAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
        }
        this.patientExists = true;
      });

      // Get all genomic variants (LOINC 69548-6) attached to this patient carrying HGVS component (LOINC 81290-9)
      smartClient.patient.api.search({type: "Observation", query: {"code": "69548-6"}, count: 10})
        .then(results => {
          console.log("Successfully got variants!", results);

          if (!results.data.entry) {
            return;
          }
          if (results.data.entry.length > 0) {
            this.removeRow(0); // Start at the first index if we find other variants.
          }
          // For every variant in the query, loop through components and codings to find HGVS = "81290-9"
          let resultIndex = 0;
          for (const result of results.data.entry) {
          	let hgvsID = "0";
          	for (const myComponent of result.resource.component) {
          	  for (const myCoding of myComponent.code.coding) {
          	  	if (myCoding.code === "81290-9") {
          	  	  console.log("found HGVS");
          	  	  let index = myComponent.code.coding.indexOf(myCoding);
          	  	  hgvsID = myComponent.valueCodeableConcept.coding[index].code;
          	  	}
          	  }          		
          	}
          	
          console.log("Will now add " + hgvsID);
          this.selectorService.search(hgvsID).subscribe(variants => {
            if (variants.length === 0) {
              console.log("NOT GOOD: Couldn't find any search results for " + result.resource.code.text);
              return;
            }
            // Add the first search result to the list (the one with the correct HGVS ID).
            console.log("Adding", variants[0]);

            this.selectorService.getByReference(variants[0])
              .subscribe(variant => {
                const newWrapper = new VariantWrapper(resultIndex, variant);
                if (this.variants.length === resultIndex) {
                  this.variants.push(newWrapper);
                } else {
                  this.variants[resultIndex] = newWrapper;
                }
                resultIndex++;
              });
            });  
          }
        })
        .fail(err => {
          console.log("Couldn't query genomic variants error!", err);
        });


      smartClient.patient.api.search({type: "Condition"})
        .then(results => {
          console.log("Got patient conditions:", results);

          if (!isNullOrUndefined(results.data.entry) && results.data.entry.length > 0) {
            for (const entry of results.data.entry) {
              if (!isNullOrUndefined(entry.resource)) {
                if (!isNullOrUndefined(entry.resource.code)) {
                  if (!isNullOrUndefined(entry.resource.code.text)) {
                    this.patientConditions.push(entry.resource.code.text);
                    console.log("Added " + entry.resource.code.text);
                  }
                }
              }
            }
          }
        })
        .fail(err => {
          console.log("The query for patient conditions failed!", err);
        });
    });
  }

  // create a patient using information gotten from files, and put that into the class patient object
  createPatient(first: string, last: string, zip: string, gender: string, age: number, conditionsArray: Condition[], codesInArray: string[]) {
    var patient = new Patient(first, last, zip, gender, age, conditionsArray, codesInArray);
    this.patient = patient;
  }
  
  // age calculator given birthdate and current date
  calculateAge(birthDateString: string) {
    var birthDate = birthDateString.split("-");
    var timeDiff = Math.abs(Date.now() - new Date(parseInt(birthDate[0]), parseInt(birthDate[1]), parseInt(birthDate[2])).getTime());
    var age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    return age;
  }


  // runs if just CMS is logged in
  getCMSInfo(patientId: string) {
    this.offerToLinkToEHRInstructions = false;
    this.patientExists = true;
    // patient info file reading
    this.cmsService.patientInfo(patientId).subscribe(patient => {
      var parsing = JSON.parse(patient);
      var justPatient = JSON.stringify(parsing.entry);
      var bigResource = JSON.stringify(JSON.parse(justPatient)[0]);
      var justResource = JSON.stringify(JSON.parse(bigResource).resource)
      var bigName = JSON.stringify(JSON.parse(justResource).name);
      var given = JSON.parse(bigName)[0].given;
      var last = JSON.parse(bigName)[0].family;
      var first = given[0];
      
      var fullAddress = JSON.stringify(JSON.parse(justResource).address);
      var justAddress = JSON.stringify(JSON.parse(fullAddress)[0]);
      var zipCode = JSON.parse(justAddress).postalCode;
      
      var gender = JSON.parse(justResource).gender;

      var birthDate = JSON.parse(justResource).birthDate;
      var age = this.calculateAge(birthDate);
      // EOB info file reading
      this.cmsService.eobInfo(patientId).subscribe(eob => {
        var entry = JSON.parse(eob).entry;
        var entryString = JSON.stringify(entry);
        var conditionsArray: Condition[] = [];
        var codesInArray: string[] = [];
        for (var i = 0; i < entry.length; i++) { // looping through all entries to find 
          var entryHere = JSON.stringify(JSON.parse(entryString)[i]);
          
          var resource = JSON.stringify(JSON.parse(entryHere).resource);
          var allDiagnoses = JSON.parse(resource).diagnosis;

          for (var j = 0; j < allDiagnoses.length; j++) {
            var diagnosisHere = allDiagnoses[j];
            var diagnosisHereString = JSON.stringify(diagnosisHere);
            var diagnosisCodeableConcept = JSON.stringify(JSON.parse(diagnosisHereString).diagnosisCodeableConcept);
            var coding = JSON.parse(diagnosisCodeableConcept).coding;
            var indexHere = JSON.stringify(coding[0]);
            var code = JSON.parse(indexHere).code;
            var display = JSON.parse(indexHere).display;
            if (code != "9999999") {
              if (!codesInArray.includes(code)) {
                var condition = new Condition(code, display, "CMS");
                conditionsArray.push(condition);
                codesInArray.push(code);
              }
              
            }
          }
        }
        // create patient based on information collected in the files
        this.createPatient(first, last, zipCode, gender, age, conditionsArray, codesInArray);
      }); 
    });
  }
  

  // same as the getCMSInfo function, but instead this is for VA.
  getVAInfo(patientId: string) {
    this.vaService.patientInfo(patientId).subscribe(patient =>  {
      this.offerToLinkToEHRInstructions = false;
      this.patientExists = true;
      var stringified = JSON.stringify(patient);
      var name = JSON.stringify((JSON.parse(stringified).name)[0]);
      var lastName = (JSON.parse(name).family)[0];
      var firstName = (JSON.parse(name).given)[0];

      var birthDate = JSON.parse(stringified).birthDate;
      var age = this.calculateAge(birthDate);
      
      var address = JSON.stringify((JSON.parse(stringified).address)[0]);
      var zipCode = JSON.parse(address).postalCode;
      
      var gender = JSON.parse(stringified).gender;
      this.vaService.conditionInfo(patientId).subscribe(patient => {
        this.offerToLinkToEHRInstructions = false;
        this.patientExists = true;
        var stringified = JSON.stringify(patient);
        var entry = JSON.parse(stringified).entry;
        var conditionsArray: Condition[] = [];
        var codesInArray: string[] = [];
        for (var i = 0; i < entry.length; i++) {
          var thisIndex = JSON.stringify(entry[i]);
          var resource = JSON.stringify(JSON.parse(thisIndex).resource);
          var clinicalStatus = JSON.parse(resource).clinicalStatus; // has a tracker of active vs resolved
          var codeOutside = JSON.stringify(JSON.parse(resource).code);
          var coding = JSON.stringify((JSON.parse(codeOutside).coding)[0]);
          var code = JSON.parse(coding).code;
          var display = JSON.parse(coding).display;
          if (!codesInArray.includes(code) && clinicalStatus == "active") { // not already listed, and still an ongoing issue
            var condition = new Condition(code, display, "VA");
            conditionsArray.push(condition);
            codesInArray.push(code);
          } 
        }
        this.createPatient(firstName, lastName, zipCode, gender, age, conditionsArray, codesInArray);
      });
      
    });
  }

  // if both are logged in, here are the steps that we follow:
  //    - get patient demographics from VA
  //    - get patient conditions from VA
  //    - get patient conditions from CMS (we only get demographics from VA)
  //    - put it all into a Patient object and sent it away
  getBothInfo(vaPatientId: string, cmsPatientId: string) {
    // VA demographics
    this.vaService.patientInfo(vaPatientId).subscribe(patient =>  {
      this.offerToLinkToEHRInstructions = false;
      this.patientExists = true;
      var stringified = JSON.stringify(patient);
      var name = JSON.stringify((JSON.parse(stringified).name)[0]);
      var lastName = (JSON.parse(name).family)[0];
      var firstName = (JSON.parse(name).given)[0];

      var birthDate = JSON.parse(stringified).birthDate;
      var age = this.calculateAge(birthDate);
      
      var address = JSON.stringify((JSON.parse(stringified).address)[0]);
      var zipCode = JSON.parse(address).postalCode;
      
      var gender = JSON.parse(stringified).gender;
      // VA conditions
      this.vaService.conditionInfo(vaPatientId).subscribe(patient => {
        this.offerToLinkToEHRInstructions = false;
        this.patientExists = true;
        var stringified = JSON.stringify(patient);
        var entry = JSON.parse(stringified).entry;
        var conditionsArray: Condition[] = [];
        var codesInArray: string[] = [];
        for (var i = 0; i < entry.length; i++) {
          var thisIndex = JSON.stringify(entry[i]);
          var resource = JSON.stringify(JSON.parse(thisIndex).resource);
          var clinicalStatus = JSON.parse(resource).clinicalStatus; // has a tracker of active vs resolved
          var codeOutside = JSON.stringify(JSON.parse(resource).code);
          var coding = JSON.stringify((JSON.parse(codeOutside).coding)[0]);
          var code = JSON.parse(coding).code;
          var display = JSON.parse(coding).display;
          if (!codesInArray.includes(code) && clinicalStatus == "active") { // not already listed, and still an ongoing issue
            var condition = new Condition(code, display, "VA");
            conditionsArray.push(condition);
            codesInArray.push(code);
          } 
        }
        // CMS conditions
        this.cmsService.eobInfo(cmsPatientId).subscribe(eob => {
          var entry = JSON.parse(eob).entry;
          var entryString = JSON.stringify(entry);
          for (var i = 0; i < entry.length; i++) { // looping through all entries to find 
            var entryHere = JSON.stringify(JSON.parse(entryString)[i]);
            
            var resource = JSON.stringify(JSON.parse(entryHere).resource);
            var allDiagnoses = JSON.parse(resource).diagnosis;
  
            for (var j = 0; j < allDiagnoses.length; j++) {
              var diagnosisHere = allDiagnoses[j];
              var diagnosisHereString = JSON.stringify(diagnosisHere);
              var diagnosisCodeableConcept = JSON.stringify(JSON.parse(diagnosisHereString).diagnosisCodeableConcept);
              var coding = JSON.parse(diagnosisCodeableConcept).coding;
              var indexHere = JSON.stringify(coding[0]);
              var code = JSON.parse(indexHere).code;
              var display = JSON.parse(indexHere).display;
              if (code != "9999999") {
                if (!codesInArray.includes(code)) {
                  var condition = new Condition(code, display, "CMS");
                  conditionsArray.push(condition);
                  codesInArray.push(code);
                }
              }
            }
          }
        }); 
        this.createPatient(firstName, lastName, zipCode, gender, age, conditionsArray, codesInArray);
      });
    });
  }


  // Row management.
  addRow() {
    this.variants.push(new VariantWrapper(this.variants.length, null));
  }
  addRowMaybe(indexInQuestion: number) {
    if (this.variants.length === indexInQuestion + 1) {
      this.addRow();
    }

    this.userInteractionPoints++;
  }
  removeRow(index: number) {
    const variantToRemove = this.variants[index].variant;

    this.variants.splice(index, 1);

    for (let i = 0; i < this.variants.length; i++) {
      this.variants[i].index = i;
    }

    this.removeEHRVariant(variantToRemove);

    this.userInteractionPoints++;
  }

  routeToInstructions() {
    this.router.navigate(["ehr-link"]);
  }

  onToggleAutosync(newVal: boolean) {
    this.autosync = newVal;

    if (this.autosync) {
      for (const variant of this.variants) {
        if (!variant.saved) {
          this.saveEHRVariant(variant);
        }
      }
    }
  }

  openFeedbackForm() {
    this.modalService.open(FeedbackFormModalComponent, {size: "lg"});
    this.askForReview = false;
  }

  // Remove and save EHR variants.
  saveEHRVariant(variant: VariantWrapper) {
  	
    if (!this.autosync) {
      return;
    }

    console.log("saving variant");

    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      smartClient.patient.read().then((p) => {
        const dataToTransmit = {
          "resource": {
            "resourceType": "Observation",
            "id": "SMART-Observation-" + p.identifier[0].value + "-variation-" + variant.variant.hgvsID.replace(/[.,\/#!$%\^&\*;:{}<>=\-_`~()]/g, ""),
            "meta": {
              "versionId": "1" // ,
              // "lastUpdated": Date.now().toString()
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Variation at " + variant.variant.getLocation() + "</div>"
            },
            "status": "final",
            "category": [
              {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/observation-category",
                    "code": "laboratory",
                    "display": "Laboratory"
                  }
                ],
                "text": "Genomic Variant"
              }
            ],
            "code": {
              "coding": [
                {
                  "system": "http://loinc.org",
                  "code": "69548-6",
                  "display": "Genetic variant assessment"
                }
              ],
              "text": "Genetic variant assessment"
            },
            "valueCodeableConcept": {
          	  "coding": [
                {
                  "system": "http://loinc.org",
                  "code": "LA9633-4",
                  "display": "Present"
                }
              ]
            },
			"component": [
          	  {
            	"code": {
              	  "coding": [
                	{
                  	  "system": "http://loinc.org",
                      "code": "81290-9",
                      "display": "Genomic DNA change (gHGVS)"
                	}
              	  ]
            	},
            	"valueCodeableConcept" : {
              	  "coding" : [
                	{
                  	  "system" : "http://varnomen.hgvs.org",
                  	  "code": variant.variant.hgvsID,
                  	  "display": variant.variant.hgvsID
                	}
              	  ],
              	  "text": variant.variant.hgvsID
            	}
              },
              {
              "code": {
                  "coding": [
                  {
                      "system": "http://loinc.org",
                      "code": "48018-6",
                      "display": "Gene studied ID (HGNC)"
                  }
                  ]
              },
              "valueCodeableConcept" : {
                  "coding" : [
                  {
                      "system" : "http://hl7.org/fhir/uv/genomics-reporting/ValueSet/hgnc",
                      "code": variant.variant.origin.hugoSymbol,
                      "display": variant.variant.origin.hugoSymbol
                  }
                  ],
                  "text": variant.variant.origin.hugoSymbol
              }
              }
            ],
            "subject": {
              "reference": "Patient/" + p.id
            },
            // "effectiveDateTime": Date.now().toString(),
            // "valueQuantity": {
            //   "value": 41.1,
            //   "unit": "weeks",
            //   "system": "http://unitsofmeasure.org",
            //   "code": "wk"
            // },
            // "context": {}
          }
        };

        console.log("Adding variant with", dataToTransmit);
        smartClient.api.update(dataToTransmit)
          .then(result => {
            console.log("Added EHR variant successfully!", result);
            variant.saved = true;
          })
          .fail(err => {
            console.log("Failed to add EHR variant", err);
          });
      });
    });
  }
  removeEHRVariant(variant: Variant) {
    if (!this.autosync || variant === null)
      return;

    SMARTClient.subscribe(smartClient => {
      // We can't do anything without a smartClient!
      if (smartClient === null)
        return;

      smartClient.patient.read().then((p) => {
        const dataToTransmit = {
          "resource": {
            "resourceType": "Observation",
            "id": "SMART-Observation-" + p.identifier[0].value + "-variation-" + variant.hgvsID.replace(/[.,\/#!$%\^&\*;:{}<>=\-_`~()]/g, ""),
            "meta": {
              "versionId": "1" // ,
              // "lastUpdated": Date.now().toString()
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Variation at " + variant.getLocation() + "</div>"
            },
            "status": "final",
            "category": [
              {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/observation-category",
                    "code": "laboratory",
                    "display": "Laboratory"
                  }
                ],
                "text": "Genomic Variant"
              }
            ],
            "code": {
              "coding": [
                {
                  "system": "http://loinc.org",
                  "code": "69548-6",
                  "display": "Genetic variant assessment"
                }
              ],
              "text": "Genetic variant assessment"
            },
            "valueCodeableConcept" : {
          	  "coding" : [
                {
                  "system" : "http://loinc.org",
                  "code" : "LA9633-4",
                  "display" : "Present"
                }
              ]
            },
			"component" : [
          	  {
            	"code" : {
              	  "coding" : [
                	{
                  	  "system" : "http://loinc.org",
                      "code" : "81290-9",
                      "display" : "Genomic DNA change (gHGVS)"
                	}
              	  ]
            	},
            	"valueCodeableConcept" : {
              	  "coding" : [
                	{
                  	  "system" : "http://varnomen.hgvs.org",
                  	  "code": variant.hgvsID,
                  	  "display": variant.hgvsID
                	}
              	  ],
              	  "text": variant.hgvsID
            	}
              },
              {
              "code": {
                  "coding": [
                  {
                      "system": "http://loinc.org",
                      "code": "48018-6",
                      "display": "Gene studied ID (HGNC)"
                  }
                  ]
              },
              "valueCodeableConcept" : {
                  "coding" : [
                  {
                      "system" : "http://hl7.org/fhir/uv/genomics-reporting/ValueSet/hgnc",
                      "code": variant.origin.hugoSymbol,
                      "display": variant.origin.hugoSymbol
                  }
                  ],
                  "text": variant.origin.hugoSymbol
              }
              }
            ],
            "subject": {
              "reference": "Patient/" + p.id
            },
            // "effectiveDateTime": Date.now().toString(),
            // "valueQuantity": {
            //   "value": 41.1,
            //   "unit": "weeks",
            //   "system": "http://unitsofmeasure.org",
            //   "code": "wk"
            // },
            // "context": {}
          }
        };

        console.log("Removing variant with", dataToTransmit);
        smartClient.api.delete(dataToTransmit)
          .then(result => {
            console.log("Removed EHR variant successfully!", result);
          })
          .fail(err => {
            console.log("Failed to remove EHR variant", err);
          });
      });
    });
  }
}
