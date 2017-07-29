import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CancerTypeSelectionComponent } from './cancertype-selection/cancertype-selection.component';
import { DataEntryFormComponent } from './data-entry/data-entry-form.component';
import { SMARTLaunchComponent } from './smart-initialization/smart-launch.component';
import { SMARTTokenReceptionComponent } from './smart-initialization/smart-token-reception.component';
import { VisualizeResultsComponent } from './visualize-results/visualize-results.component';

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
