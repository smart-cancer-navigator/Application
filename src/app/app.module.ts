// Modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent }  from './app.component';
import { FilterableDropdownComponent } from './filterable-dropdown.component';
import { InfoHeaderComponent } from './info-header.component';
import { DiseaseSelectionComponent } from './disease-selection.component';
import { DataEntryComponent } from './data-entry.component';

// Services
import { GeneDatabaseManager } from './gene-database-manager.service';
import { GeneDatabaseService } from './gene-database.service';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    FilterableDropdownComponent,
    InfoHeaderComponent,
    DataEntryComponent,
    DiseaseSelectionComponent
  ],
  providers: [
    GeneDatabaseManager,
    GeneDatabaseService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
