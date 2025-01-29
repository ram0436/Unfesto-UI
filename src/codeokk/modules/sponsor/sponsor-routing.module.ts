import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllSponsorsComponent } from "./component/all-sponsors/all-sponsors.component";
import { SendProposalComponent } from "./component/send-proposal/send-proposal.component";

const routes: Routes = [
  {
    path: "all-sponsors",
    component: AllSponsorsComponent,
  },
  {
    path: "send-proposal",
    component: SendProposalComponent,
  },
  // { path: "my-profile", component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SponsorRoutingModule {}
