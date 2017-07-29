import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CancerTypeSelectionComponent } from './cancertype-selection.component';
import { DataEntryFormComponent } from './data-entry-form.component';
import { SMARTLaunchComponent } from './smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-token-reception.component';
import { VisualizeResultsComponent } from './visualize-results.component';

const routes: Routes = [
  { path: '', redirectTo: '/cancertype-selection', pathMatch: 'full' },
  { path: 'cancertype-selection', component: CancerTypeSelectionComponent },
  { path: 'data-entry/:cancertype', component: DataEntryFormComponent },
  { path: 'smart-launch', component: SMARTLaunchComponent },
  { path: 'token-reception', component: SMARTTokenReceptionComponent },
  { path: 'visualize-results', component: VisualizeResultsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
