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
import { DataEntryComponent } from './data-entry.component';
import { SMARTLaunchComponent } from './smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-token-reception.component';
import { FilterableSearchComponent } from './filterable-search.component';
import { DataEntryRowComponent } from './data-entry-row.component';

// Services
import { CancerTypeSearchService } from './cancertype-search.service';
import { SMARTReferenceService } from './smart-reference.service';
import { GeneSearchService } from './gene-search.service';
import { VariantSearchService } from './variant-search.service';
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
    DataEntryComponent,
    CancerTypeSelectionComponent,
    SMARTLaunchComponent,
    SMARTTokenReceptionComponent,
    FilterableSearchComponent,
    DataEntryRowComponent
  ],
  providers: [
    CancerTypeSearchService,
    SMARTReferenceService,
    GeneSearchService,
    VariantSearchService,
    CIViCSearchService,
    MyGeneInfoSearchService,
    MyVariantInfoSearchService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
