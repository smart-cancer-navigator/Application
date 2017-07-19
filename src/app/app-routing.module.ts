import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiseaseSelectionComponent } from './disease-selection.component';
import { DataEntryComponent } from './data-entry.component';

const routes: Routes = [
  { path: '', redirectTo: '/disease-selection', pathMatch: 'full' },
  { path: 'disease-selection', component: DiseaseSelectionComponent },
  { path: 'data-entry/:disease-type', component: DataEntryComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
