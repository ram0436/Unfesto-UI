import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EventService } from "../../../modules/event/service/event.service";
import { data } from "jquery";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  dialogRef: MatDialogRef<any> | null = null;

  isSidebarOpen = false;

  userRole: string | null = null;

  firstName: string = "";
  email: string = "";
  currentActiveItem = "";
  isLoggedIn = false;
  eventTypes: any[] = [];
  eventSubTypes: any[] = [];
  isCollaborator: boolean = false;
  eventSubTypesByType: { [key: number]: any[] } = {};
  showSubMenu: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem("role") || "User";
    this.firstName = localStorage.getItem("firstName") || "User";
    this.email = localStorage.getItem("email") || "Email";

    const isCollaboratorValue = localStorage.getItem("isCollaborator");
    this.isCollaborator = isCollaboratorValue === "true";
    // this.isCollaborator = true;
    this.checkAuthToken();
    this.getAllEventTypes();
  }

  getAllEventTypes() {
    this.eventService.getEventType().subscribe((data: any) => {
      this.eventTypes = data;
      this.eventTypes.forEach((eventType) => {
        this.getEventSubTypebyEventType(eventType.id);
      });
    });
  }

  getEventSubTypebyEventType(eventId: any) {
    this.eventService
      .getEventSubTypeByEventType(eventId)
      .subscribe((data: any) => {
        this.eventSubTypesByType[eventId] = data;
      });
    console.log(this.eventSubTypesByType);
  }
  checkAuthToken() {
    this.isLoggedIn = !!localStorage.getItem("authToken");
  }

  authAction() {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.login();
    }
  }

  setActiveItem(item: string) {
    this.currentActiveItem = item;
  }

  // Listener for clicks anywhere on the document
  @HostListener("document:click", ["$event"])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Check if the click is outside the sidebar or the profile icon
    const isClickInsideSidebar = target.closest(".sidebar");
    const isClickOnProfileIcon = target.closest(".user-profile");

    if (!isClickInsideSidebar && !isClickOnProfileIcon) {
      this.isSidebarOpen = false; // Close the sidebar
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateToCollaboratorListing(): void {
    this.router.navigate(["/user/dashboard/manage-listings"], {
      queryParams: { isCollaborator: "true" },
    });
  }

  logout() {
    // Remove the relevant items from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_Id");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("isCollaborator");
    localStorage.removeItem("email");
    localStorage.removeItem("mobileNo");
    localStorage.removeItem("firstName");

    // Navigate to the home page
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
      // console.log("Window reloaded");
    });
  }

  login() {
    this.router.navigate(["/login"]);
  }
}
