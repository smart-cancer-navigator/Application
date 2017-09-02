import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { VariantEntryAndVisualizationComponent } from "./entry-and-visualization/variant-entry-and-visualization.component";
import { EHRInstructionsComponent } from "./ehr-instructions/ehr-instructions.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "smart-launch", component: SMARTLaunchComponent },
  { path: "token-reception", component: SMARTTokenReceptionComponent },
  { path: "app", component: VariantEntryAndVisualizationComponent },
  { path: "ehr-link", component: EHRInstructionsComponent },
  { path: "home", component: LandingPageComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
