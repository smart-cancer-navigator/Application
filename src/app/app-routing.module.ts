import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { VariantEntryAndVisualizationComponent } from "./routes/entry-and-visualization/variant-entry-and-visualization.component";
import { EHRInstructionsComponent } from "./routes/ehr-instructions/ehr-instructions.component";
import { LandingPageComponent } from "./routes/home/home.component";
import { TeamComponent } from "./routes/team/team.component";
import { DBAnalysisComponent } from "./routes/db-analysis/db-analysis.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "smart-launch", component: SMARTLaunchComponent },
  { path: "token-reception", component: SMARTTokenReceptionComponent },
  { path: "app", component: VariantEntryAndVisualizationComponent },
  { path: "ehr-link", component: EHRInstructionsComponent },
  { path: "home", component: LandingPageComponent },
  { path: "team", component: TeamComponent },
  { path: "db-analysis", component: DBAnalysisComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
