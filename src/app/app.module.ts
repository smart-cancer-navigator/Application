// Modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UiSwitchModule } from "../../node_modules/angular2-ui-switch/src";

// Components
import { AppComponent } from "./app.component";
import { VariantSelectorComponent } from "./routes/entry-and-visualization/variant-selector/variant-selector.component";
import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { FilterableSearchComponent } from "./routes/entry-and-visualization/filterable-search/filterable-search.component";
import { ClinicalTrialsComponent } from "./routes/entry-and-visualization/variant-visualization/clinical-trials/clinical-trials.component";
import { DrugDetailsModalComponent } from "./routes/entry-and-visualization/variant-visualization/drugs/drug-details-modal.component";
import { GeneInformationComponent } from "./routes/entry-and-visualization/variant-visualization/gene/gene-information.component";
import { VariantInformationComponent } from "./routes/entry-and-visualization/variant-visualization/variant/variant-information.component";
import { VariantVisualizationComponent } from "./routes/entry-and-visualization/variant-visualization/variant-visualization.component";
import { EHRInstructionsComponent } from "./routes/ehr-instructions/ehr-instructions.component";
import { FeedbackFormModalComponent } from "./routes/feedback-form/feedback-form-modal.component";
import { HeaderComponent } from "./universal-components/header.component";
import { ClassificationsModalComponent } from "./routes/entry-and-visualization/variant-visualization/variant/classifications-modal.component";
import { VariantEntryAndVisualizationComponent } from "./routes/entry-and-visualization/variant-entry-and-visualization.component";
import { LandingPageComponent } from "./routes/home/home.component";
import { GithubForkUsComponent } from "./universal-components/github-fork-us.component";
import { TeamComponent } from "./routes/team/team.component";

// Services
import { SMARTReferenceService } from "./smart-initialization/smart-reference.service";
import { MyVariantInfoSearchService } from "./routes/entry-and-visualization/genomic-data-providers/myvariantinfo-search.service";
import { ClinicalTrialsService } from "./routes/entry-and-visualization/variant-visualization/clinical-trials/clinical-trials.service";
import { VariantSelectorService } from "./routes/entry-and-visualization/variant-selector/variant-selector.service";
import { DrugsSearchService } from "./routes/entry-and-visualization/variant-visualization/drugs/drugs-search.service";
import { MyGeneInfoSearchService } from "./routes/entry-and-visualization/genomic-data-providers/mygeneinfo-search.service";
import { JSONNavigatorService } from "./routes/entry-and-visualization/genomic-data-providers/utilities/json-navigator.service";
import { DBAnalysisComponent } from "./routes/db-analysis/db-analysis.component";

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    UiSwitchModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
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
    GithubForkUsComponent,
    FeedbackFormModalComponent,
    TeamComponent,
    DBAnalysisComponent
  ],
  entryComponents: [
    DrugDetailsModalComponent, // Since it enters later on in the flow.
    ClassificationsModalComponent,
    FeedbackFormModalComponent
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
