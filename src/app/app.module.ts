// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { InfoHeaderComponent } from './global/info-header.component';
import { CancerTypeSelectionComponent } from './cancertype-selection/cancertype-selection.component';
import { DataEntryFormComponent } from './data-entry/data-entry-form.component';
import { SMARTLaunchComponent } from './smart-initialization/smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-initialization/smart-token-reception.component';
import { FilterableSearchComponent } from './data-entry/filterable-search/filterable-search.component';
import { DataEntryRobustComponent } from './data-entry/data-entry-robust.component';
import { DataEntryIntelligentComponent } from './data-entry/data-entry-intelligent.component';
import { VisualizeResultsComponent } from './visualize-results/visualize-results.component';

// Services
import { CancerTypeSearchService } from './cancertype-selection/cancertype-search.service';
import { SMARTReferenceService } from './smart-initialization/smart-reference.service';
import { RobustGeneSearchService } from './data-entry/robust-gene-search.service';
import { RobustVariantSearchService } from './data-entry/robust-variant-search.service';
import { CIViCSearchService } from './data-entry/providers/civic-search.service';
import { MyGeneInfoSearchService } from './data-entry/providers/mygeneinfo-search.service';
import { MyVariantInfoSearchService } from './data-entry/providers/myvariantinfo-search.service';
import { IntelligentGenomicsSearchService } from './data-entry/intelligent-genomics-search.service';

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    InfoHeaderComponent,
    DataEntryFormComponent,
    CancerTypeSelectionComponent,
    SMARTLaunchComponent,
    SMARTTokenReceptionComponent,
    FilterableSearchComponent,
    DataEntryRobustComponent,
    DataEntryIntelligentComponent,
    VisualizeResultsComponent
  ],
  providers: [
    CancerTypeSearchService,
    SMARTReferenceService,
    RobustGeneSearchService,
    RobustVariantSearchService,
    CIViCSearchService,
    MyGeneInfoSearchService,
    MyVariantInfoSearchService,
    IntelligentGenomicsSearchService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
