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
import { DrugsComponent } from "./visualize-results/drugs/drugs.component";

// Services
import { SMARTReferenceService } from "./smart-initialization/smart-reference.service";
import { MyVariantInfoSearchService } from "./data-entry/providers/myvariantinfo-search.service";
import { ClinicalTrialsService } from "./visualize-results/clinical-trials/clinical-trials.service";
import { DataEntryService } from "./data-entry/data-entry.service";


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
    DrugsComponent
  ],
  providers: [
    SMARTReferenceService,
    MyVariantInfoSearchService,
    ClinicalTrialsService,
    DataEntryService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
