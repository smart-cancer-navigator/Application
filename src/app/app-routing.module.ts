import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiseaseSelectionComponent } from './disease-selection.component';
import { DataEntryComponent } from './data-entry.component';
import { SMARTLaunchComponent } from './smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-token-reception.component';

const routes: Routes = [
  { path: '', redirectTo: '/disease-selection', pathMatch: 'full' },
  { path: 'disease-selection', component: DiseaseSelectionComponent },
  { path: 'data-entry/:disease-type', component: DataEntryComponent },
  { path: 'smart-launch', component: SMARTLaunchComponent },
  { path: 'token-reception', component: SMARTTokenReceptionComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
