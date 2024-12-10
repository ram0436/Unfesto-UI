import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./component/account/account.component";
import { UserProfileComponent } from "./component/user-profile/user-profile.component";

const routes: Routes = [
  { path: "account", component: AccountComponent },
  { path: "my-profile", component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
