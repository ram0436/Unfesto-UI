import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./component/account/account.component";
import { UserProfileComponent } from "./component/user-profile/user-profile.component";
import { DashboardComponent } from "./component/dashboard/dashboard.component";
import { ManageListingsComponent } from "./component/manage-listings/manage-listings.component";
import { AddSkillComponent } from "./component/add-skill/add-skill.component";
import { AddCategoryComponent } from "./component/add-category/add-category.component";
import { AddOrganizationComponent } from "./component/add-organization/add-organization.component";
import { AdminDashboardComponent } from "./component/admin-dashboard/admin-dashboard.component";
import { MyRegisterationsComponent } from "./component/my-registerations/my-registerations.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      { path: "my-profile", component: UserProfileComponent },
      { path: "account", component: AccountComponent },
      { path: "manage-listings", component: ManageListingsComponent },
      { path: "add-skill", component: AddSkillComponent },
      { path: "add-category", component: AddCategoryComponent },
      { path: "add-organization", component: AddOrganizationComponent },
      { path: "admin-panel", component: AdminDashboardComponent },
      { path: "my-registerations", component: MyRegisterationsComponent },
      { path: "", redirectTo: "my-profile", pathMatch: "full" },
    ],
  },
  // { path: "my-profile", component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
