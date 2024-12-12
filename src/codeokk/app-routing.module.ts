import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./modules/home/home.component";
import { AuthGuard } from "./modules/auth/authguard/authguard";
import { LoginComponent } from "./modules/login/login.component";
import { SignupComponent } from "./modules/signup/signup.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },

  {
    path: "user",
    loadChildren: () =>
      import("./modules/user/user.module").then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
  {
    path: "host",
    loadChildren: () =>
      import("./modules/host/host.module").then((m) => m.HostModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
