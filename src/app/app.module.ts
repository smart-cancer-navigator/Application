// Modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UiSwitchModule } from "../../node_modules/angular2-ui-switch/src";

// Components
import { AppComponent } from "./app.component";
import { VariantSelectorComponent } from "./entry-and-visualization/variant-selector/variant-selector.component";
import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { FilterableSearchComponent } from "./entry-and-visualization/filterable-search/filterable-search.component";
import { ClinicalTrialsComponent } from "./entry-and-visualization/variant-visualization/clinical-trials/clinical-trials.component";
import { DrugDetailsModalComponent } from "./entry-and-visualization/variant-visualization/drugs/drug-details-modal.component";
import { GeneInformationComponent } from "./entry-and-visualization/variant-visualization/gene/gene-information.component";
import { VariantInformationComponent } from "./entry-and-visualization/variant-visualization/variant/variant-information.component";
import { VariantVisualizationComponent } from "./entry-and-visualization/variant-visualization/variant-visualization.component";
import { EHRInstructionsComponent } from "./ehr-instructions/ehr-instructions.component";

// Services
import { SMARTReferenceService } from "./smart-initialization/smart-reference.service";
import { MyVariantInfoSearchService } from "./entry-and-visualization/genomic-data-providers/myvariantinfo-search.service";
import { ClinicalTrialsService } from "./entry-and-visualization/variant-visualization/clinical-trials/clinical-trials.service";
import { VariantSelectorService } from "./entry-and-visualization/variant-selector/variant-selector.service";
import { DrugsSearchService } from "./entry-and-visualization/variant-visualization/drugs/drugs-search.service";
import { MyGeneInfoSearchService } from "./entry-and-visualization/genomic-data-providers/mygeneinfo-search.service";
import { JSONNavigatorService } from "./entry-and-visualization/genomic-data-providers/utilities/json-navigator.service";
import { ClassificationsModalComponent } from "./entry-and-visualization/variant-visualization/variant/classifications-modal.component";
import {VariantEntryAndVisualizationComponent} from "./entry-and-visualization/variant-entry-and-visualization.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {GithubForkUsComponent} from "./universal-components/github-fork-us.component";

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    UiSwitchModule
  ],
  declarations: [
    AppComponent,
    VariantEntryAndVisualizationComponent,
    VariantVisualizationComponent,
    VariantSelectorComponent,
    SMARTLaunchComponent,
    SMARTTokenReceptionComponent,
    FilterableSearchComponent,
    VariantInformationComponent,
    ClinicalTrialsComponent,
    GeneInformationComponent,
    DrugDetailsModalComponent,
    ClassificationsModalComponent,
    EHRInstructionsComponent,
    LandingPageComponent,
    GithubForkUsComponent
  ],
  entryComponents: [
    DrugDetailsModalComponent, // Since it enters later on in the flow.
    ClassificationsModalComponent
  ],
  providers: [
    SMARTReferenceService,
    VariantSelectorService,
    MyVariantInfoSearchService,
    MyGeneInfoSearchService,
    ClinicalTrialsService,
    DrugsSearchService,
    JSONNavigatorService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
