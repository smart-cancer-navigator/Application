// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { InfoHeaderComponent } from './info-header.component';
import { CancerTypeSelectionComponent } from './cancertype-selection.component';
import { DataEntryFormComponent } from './data-entry-form.component';
import { SMARTLaunchComponent } from './smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-token-reception.component';
import { FilterableSearchComponent } from './filterable-search.component';
import { DataEntryRobustComponent } from './data-entry-robust.component';
import { DataEntryIntelligentComponent } from './data-entry-intelligent.component';

// Services
import { CancerTypeSearchService } from './cancertype-search.service';
import { SMARTReferenceService } from './smart-reference.service';
import { RobustGeneSearchService } from './robust-gene-search.service';
import { RobustVariantSearchService } from './robust-variant-search.service';
import { CIViCSearchService } from './civic-search.service';
import { MyGeneInfoSearchService } from './mygeneinfo-search.service';
import { MyVariantInfoSearchService } from './myvariantinfo-search.service';

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
    DataEntryIntelligentComponent
  ],
  providers: [
    CancerTypeSearchService,
    SMARTReferenceService,
    RobustGeneSearchService,
    RobustVariantSearchService,
    CIViCSearchService,
    MyGeneInfoSearchService,
    MyVariantInfoSearchService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
