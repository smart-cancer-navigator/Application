import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';

// Custom Components
import { FilterableDropdownComponent } from './filterable-dropdown.component';
import { InfoHeaderComponent } from './info-header.component';

// Custom Services
import { GeneDatabaseManager } from './gene-database-manager.service';
import { GeneDatabaseService } from './gene-database.service';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    FilterableDropdownComponent,
    InfoHeaderComponent
  ],
  providers: [
    GeneDatabaseManager,
    GeneDatabaseService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
