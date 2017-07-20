import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CancerTypeSelectionComponent } from './cancertype-selection.component';
import { DataEntryComponent } from './data-entry.component';
import { SMARTLaunchComponent } from './smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-token-reception.component';

const routes: Routes = [
  { path: '', redirectTo: '/cancertype-selection', pathMatch: 'full' },
  { path: 'cancertype-selection', component: CancerTypeSelectionComponent },
  { path: 'data-entry/:cancertype', component: DataEntryComponent },
  { path: 'smart-launch', component: SMARTLaunchComponent },
  { path: 'token-reception', component: SMARTTokenReceptionComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
