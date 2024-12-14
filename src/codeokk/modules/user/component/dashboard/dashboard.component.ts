import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NavigationEnd, Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { UserPayload } from "../../../../shared/model/user.payload";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  dialogRef: MatDialogRef<any> | null = null;

  isSidebarVisible: boolean = false;

  userRole: String | null = null;

  firstName: string = "";
  email: string = "";

  activeMenuItem: string = "";

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem("role");
    this.firstName = localStorage.getItem("firstName") || "User";
    this.email = localStorage.getItem("email") || "Email";

    // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenuItemFromRoute(event.urlAfterRedirects);
      }
    });

    // Initialize active menu item based on current route
    this.setActiveMenuItemFromRoute(this.router.url);
  }

  // Set active menu item based on the route
  private setActiveMenuItemFromRoute(url: string): void {
    const routeFragment = url.split("/").pop() || "";
    this.activeMenuItem = routeFragment;
  }

  // Method to set the active menu item
  setActiveMenuItem(item: string): void {
    this.activeMenuItem = item;
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
