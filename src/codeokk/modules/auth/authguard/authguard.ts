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
      "/user/dashboard/add-skill",
      "/user/dashboard/admin-panel",
      "/user/dashboard/add-category",
      "/user/dashboard/add-organization",
      "/event/add-workshops",
      "/event/host",
    ];
    const allowedParticipantRoutes = [
      "/user/dashboard/my-registerations",
      "/user/dashboard/certificates",
      "/user/dashboard/wishlist",
    ];
    const allowedOrganizerRoutes = [
      "/user/dashboard/manage-listings",
      "/event/host",
      "/event/add-workshops",
      "/event/edit",
      "/event/edit/:id",
    ];
    const commonRoutes = [
      "/user",
      "/login",
      "/signup",
      "/event",
      "/event/details/:id",
      "/event/compete",
      "/event/all-events",
      "/dashboard",
      "/user/dashboard/settings",
      "/user/dashboard/my-profile",
    ];

    // Add dynamic routes using regex
    const dynamicRoutes = [/^\/event\/details\/[a-f0-9-]+$/i];

    const editEventRoute = [/^\/event\/edit\/[a-f0-9-]+$/i];

    const registerEventRoute = [/^\/event\/register-event\/[a-f0-9-]+$/i];

    const requestedRoute = state.url;

    if (authToken) {
      // Common routes accessible to all roles
      if (commonRoutes.includes(requestedRoute)) {
        return true;
      }

      if (
        dynamicRoutes.some((pattern) => pattern.test(requestedRoute)) ||
        registerEventRoute.some((pattern) => pattern.test(requestedRoute))
      ) {
        return true;
      }

      // Check if role is Organizer and route matches /event/edit/:id
      if (
        role === "Organizer" &&
        editEventRoute.some((pattern) => pattern.test(requestedRoute))
      ) {
        return true;
      }

      // Role-specific routing
      switch (role) {
        case "SuperAdmin":
          if (allowedAdminRoutes.includes(requestedRoute)) {
            return true;
          }
          break;

        case "Participant":
          if (allowedParticipantRoutes.includes(requestedRoute)) {
            return true;
          }
          break;

        case "Organizer":
          if (allowedOrganizerRoutes.includes(requestedRoute)) {
            return true;
          }
          break;

        default:
          break;
      }

      this.router.navigate(["/"]);
      return false;
    } else {
      // Redirect to login if no auth token
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
