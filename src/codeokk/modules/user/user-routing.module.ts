import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./component/account/account.component";
import { UserProfileComponent } from "./component/user-profile/user-profile.component";
import { DashboardComponent } from "./component/dashboard/dashboard.component";

const routes: Routes = [
  // { path: "account", component: AccountComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      { path: "my-profile", component: UserProfileComponent },
      { path: "account", component: AccountComponent },
      { path: "", redirectTo: "my-profile", pathMatch: "full" }, // Default route
    ],
  },
  // { path: "my-profile", component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
