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
    const role = localStorage.getItem("role");

    const allowedAdminRoutes = [
      "user/dashboard/add-skill",
      "user/dashboard/admin",
      "user/dashboard/add-category",
      "user/dashboard/add-organization",
    ];
    const allowedParticipantRoutes = [
      "user/dashboard/my-registerations",
      "user/dashboard/certificates",
      "user/dashboard/wishlist",
      "user/dashboard/settings",
    ];
    const allowedOrganizerRoutes = ["user/dashboard/manage-listings"];
    const commonRoutes = [
      "user",
      "login",
      "host",
      "host/workshops",
      "dashboard",
      "user/dashboard/settings",
      "user/dashboard/my-profile",
    ];

    const requestedRoute = route.routeConfig?.path || "";

    if (authToken) {
      if (commonRoutes.includes(requestedRoute)) {
        return true;
      }

      switch (role) {
        case "SuperAdmin":
          if (
            allowedAdminRoutes.includes(requestedRoute) ||
            commonRoutes.includes(requestedRoute)
          ) {
            return true;
          }
          break;

        case "Participant":
          if (
            allowedParticipantRoutes.includes(requestedRoute) ||
            commonRoutes.includes(requestedRoute)
          ) {
            return true;
          }
          break;

        case "Organizer":
          if (
            allowedOrganizerRoutes.includes(requestedRoute) ||
            commonRoutes.includes(requestedRoute)
          ) {
            return true;
          }
          break;

        default:
          break;
      }

      this.router.navigate(["/dashboard"]); // Redirect to dashboard for unauthorized access
      return false;
    } else {
      this.router.navigate(["/login"]); // Redirect to login if not authenticated
      return false;
    }
  }
}
