import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const authToken = localStorage.getItem("authToken");
    const allowedAdminRoutes = ["admin", "admin/dashboard"];
    const allowedUserRoutes = [""];
    const commonRoutes = [
      "user",
      "user/login",
      "host",
      "host/workshops",
      "dashboard",
      "account",
      "account/personal",
      "account/security",
    ];
    const requestedRoute = route.routeConfig?.path || "";
    if (authToken) {
      if (commonRoutes.includes(requestedRoute)) {
        return true;
      } else {
        this.router.navigate(["/dashboard"]);
        return false;
      }
    } else {
      this.router.navigate(["/login"]); // Redirect to login if not authenticated
      return false;
    }
  }
}
