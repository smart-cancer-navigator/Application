// Modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent }  from './app.component';
import { InfoHeaderComponent } from './info-header.component';
import { DiseaseSelectionComponent } from './disease-selection.component';
import { DataEntryComponent } from './data-entry.component';

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
    DiseaseSelectionComponent
  ],
  providers: [
    SingleDatabaseService,
    GeneSearchService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
