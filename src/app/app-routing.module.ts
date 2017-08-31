import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import { VariantEntryAndVisualizationComponent } from "./entry-and-visualization/variant-entry-and-visualization.component";
import { EHRInstructionsComponent } from "./ehr-instructions/ehr-instructions.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";

const routes: Routes = [
  { path: "", redirectTo: "/landing-page", pathMatch: "full" },
  { path: "smart-launch", component: SMARTLaunchComponent },
  { path: "token-reception", component: SMARTTokenReceptionComponent },
  { path: "variant-entry-and-visualization", component: VariantEntryAndVisualizationComponent },
  { path: "ehr-instructions", component: EHRInstructionsComponent },
  { path: "landing-page", component: LandingPageComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
