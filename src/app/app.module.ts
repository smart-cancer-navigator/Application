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

// Services
import { DataEntryService } from './data-entry.service';
import { SingleDatabaseService } from './single-database.service';
import { CancerTypeSearchService } from './cancertype-search.service';
import { SMARTReferenceService } from './smart-reference.service';

import { GeneDataRowComponent } from './gene-data-row.component';

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    InfoHeaderComponent,
    DataEntryComponent,
    CancerTypeSelectionComponent,
    SMARTLaunchComponent,
    SMARTTokenReceptionComponent,
    FilterableSearchComponent,
    GeneDataRowComponent
  ],
  providers: [
    SingleDatabaseService,
    DataEntryService,
    CancerTypeSearchService,
    SMARTReferenceService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
