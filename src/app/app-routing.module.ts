import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SMARTLaunchComponent } from "./smart-initialization/smart-launch.component";
import { SMARTTokenReceptionComponent } from "./smart-initialization/smart-token-reception.component";
import {PrimaryFunctionalityComponent} from "./primary-functionality/primary-functionality.component";

const routes: Routes = [
  { path: "", redirectTo: "/primary", pathMatch: "full" },
  { path: "smart-launch", component: SMARTLaunchComponent },
  { path: "token-reception", component: SMARTTokenReceptionComponent },
  { path: "primary", component: PrimaryFunctionalityComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
