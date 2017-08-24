// Modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header.component";
import { VariantSelectorComponent } from "./primary-functionality/variant-selector/variant-selector.component";
import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { FilterableSearchComponent } from "./primary-functionality/filterable-search/filterable-search.component";
import { ClinicalTrialsComponent } from "./primary-functionality/variant-visualization/clinical-trials/clinical-trials.component";
import { DrugDetailsModalComponent } from "./primary-functionality/variant-visualization/drugs/drug-details-modal.component";
import { GeneInformationComponent } from "./primary-functionality/variant-visualization/gene/gene-information.component";
import { VariantInformationComponent } from "./primary-functionality/variant-visualization/variant/variant-information.component";
import { VariantVisualizationComponent } from "./primary-functionality/variant-visualization/visualization.component";

// Services
import { SMARTReferenceService } from "./smart-initialization/smart-reference.service";
import { MyVariantInfoSearchService } from "./primary-functionality/variant-selector/providers/myvariantinfo-search.service";
import { ClinicalTrialsService } from "./primary-functionality/variant-visualization/clinical-trials/clinical-trials.service";
import { VariantSelectorService } from "./primary-functionality/variant-selector/variant-selector.service";
import { DrugsSearchService } from "./primary-functionality/variant-visualization/drugs/drugs-search.service";
import { MyGeneInfoSearchService } from "./primary-functionality/variant-selector/providers/mygeneinfo-search.service";
import { JSONNavigatorService } from "./primary-functionality/variant-selector/providers/utilities/json-navigator.service";
import { ClassificationsModalComponent } from "./primary-functionality/variant-visualization/variant/classifications-modal.component";
import {PrimaryFunctionalityComponent} from "./primary-functionality/primary-functionality.component";

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    PrimaryFunctionalityComponent,
    VariantVisualizationComponent,
    VariantSelectorComponent,
    SMARTLaunchComponent,
    SMARTTokenReceptionComponent,
    FilterableSearchComponent,
    VariantInformationComponent,
    ClinicalTrialsComponent,
    GeneInformationComponent,
    DrugDetailsModalComponent,
    ClassificationsModalComponent
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
