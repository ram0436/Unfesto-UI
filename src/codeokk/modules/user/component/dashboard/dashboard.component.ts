import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
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

  isCollaborator: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem("role");
    this.firstName = localStorage.getItem("firstName") || "User";
    this.email = localStorage.getItem("email") || "Email";

    // Fetch isCollaborator and convert it to a boolean
    const isCollaboratorValue = localStorage.getItem("isCollaborator");
    this.isCollaborator = isCollaboratorValue === "true";
    // this.isCollaborator = true;

    this.route.queryParams.subscribe((params) => {
      if (params["isCollaborator"] === "true") {
        this.activeMenuItem = "collaborator-listings";
      }
    });

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
