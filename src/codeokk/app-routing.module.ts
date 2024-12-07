import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./modules/home/home.component";
import { AuthGuard } from "./modules/auth/authguard/authguard";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "user",
    loadChildren: () =>
      import("./modules/user/user.module").then((m) => m.UserModule),
    // canActivate: [AuthGuard],
  },
  {
    path: "host",
    loadChildren: () =>
      import("./modules/host/host.module").then((m) => m.HostModule),
    // canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
