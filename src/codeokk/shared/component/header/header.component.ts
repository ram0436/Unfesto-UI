import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

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

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem("role") || "User";
    this.firstName = localStorage.getItem("firstName") || "User";
    this.email = localStorage.getItem("email") || "Email";
    this.checkAuthToken();
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

  logout() {
    // Remove the relevant items from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_Id");
    localStorage.removeItem("role");

    // Navigate to the home page
    this.router.navigate(["/"]).then(() => {});
  }

  login() {
    this.router.navigate(["/login"]);
  }
}
