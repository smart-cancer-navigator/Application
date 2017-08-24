// Modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// Components
import { AppComponent } from "./app.component";
import { InfoHeaderComponent } from "./global/info-header.component";
import { DataEntryFormComponent } from "./data-entry/data-entry.component";
import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { FilterableSearchComponent } from "./data-entry/filterable-search/filterable-search.component";
import { VisualizeResultsComponent } from "./visualize-results/visualize-results.component";
import { ClinicalTrialsComponent } from "./visualize-results/clinical-trials/clinical-trials.component";
import { DrugDetailsModalComponent } from "./visualize-results/drugs/drug-details-modal.component";
import { GeneVisualizationComponent } from "./visualize-results/gene/gene-visualization.component";
import { VariantVisualizationComponent } from "./visualize-results/variant/variant-visualization.component";
import { EHREntryComponent } from "./ehr-entry/ehr-entry.component";

// Services
import { SMARTReferenceService } from "./smart-initialization/smart-reference.service";
import { MyVariantInfoSearchService } from "./data-entry/providers/myvariantinfo-search.service";
import { ClinicalTrialsService } from "./visualize-results/clinical-trials/clinical-trials.service";
import { DataEntryService } from "./data-entry/data-entry.service";
import { DrugsSearchService } from "./visualize-results/drugs/drugs-search.service";
import { MyGeneInfoSearchService } from "./data-entry/providers/mygeneinfo-search.service";
import { JSONNavigatorService } from "./data-entry/providers/utilities/json-navigator.service";
import {ClassificationsModalComponent} from "./visualize-results/variant/classifications-modal.component";


@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    InfoHeaderComponent,
    DataEntryFormComponent,
    SMARTLaunchComponent,
    SMARTTokenReceptionComponent,
    FilterableSearchComponent,
    VisualizeResultsComponent,
    ClinicalTrialsComponent,
    GeneVisualizationComponent,
    VariantVisualizationComponent,
    DrugDetailsModalComponent,
    ClassificationsModalComponent,
    EHREntryComponent
  ],
  entryComponents: [
    DrugDetailsModalComponent, // Since it enters later on in the flow.
    ClassificationsModalComponent
  ],
  providers: [
    SMARTReferenceService,
    MyVariantInfoSearchService,
    MyGeneInfoSearchService,
    ClinicalTrialsService,
    DataEntryService,
    DrugsSearchService,
    JSONNavigatorService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
