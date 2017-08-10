import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DataEntryFormComponent } from "./data-entry/data-entry.component";
import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { VisualizeResultsComponent } from "./visualize-results/visualize-results.component";

const routes: Routes = [
  { path: "", redirectTo: "/data-entry", pathMatch: "full" },
  { path: "data-entry", component: DataEntryFormComponent },
  { path: "smart-launch", component: SMARTLaunchComponent },
  { path: "token-reception", component: SMARTTokenReceptionComponent },
  { path: "visualize-results", component: VisualizeResultsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
