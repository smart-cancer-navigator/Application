// Modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { InfoHeaderComponent } from './info-header.component';
import { CancerTypeSelectionComponent } from './cancertype-selection.component';
import { DataEntryComponent } from './data-entry.component';
import { SMARTLaunchComponent } from './smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-token-reception.component';

// Services
import { GeneSearchService } from './gene-search.service';
import { SingleDatabaseService } from './single-database.service';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    InfoHeaderComponent,
    DataEntryComponent,
    CancerTypeSelectionComponent,
    SMARTLaunchComponent,
    SMARTTokenReceptionComponent
  ],
  providers: [
    SingleDatabaseService,
    GeneSearchService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
