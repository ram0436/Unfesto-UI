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
    const userRole = localStorage.getItem("role");
    const allowedAdminRoutes = ["admin", "admin/dashboard"];
    const allowedUserRoutes = [""];
    const commonRoutes = [
      "user",
      "user/login",
      "account",
      "account/personal",
      "account/security",
    ];
    const requestedRoute = route.routeConfig?.path || "";
    if (userRole == "Admin") {
      if (allowedAdminRoutes.includes(requestedRoute)) {
        return true;
      } else if (commonRoutes.includes(requestedRoute)) return true;
      else {
        this.router.navigate(["/login"]);
        return false;
      }
    } else if (userRole == "User") {
      if (allowedUserRoutes.includes(requestedRoute)) {
        return true;
      } else if (commonRoutes.includes(requestedRoute)) return true;
      else {
        this.router.navigate(["/login"]);
        return false;
      }
    } else if (userRole == "AppSupport") {
      if (allowedUserRoutes.includes(requestedRoute)) {
        return true;
      } else if (commonRoutes.includes(requestedRoute)) return true;
      else {
        this.router.navigate(["/login"]);
        return false;
      }
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
