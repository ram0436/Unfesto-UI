import { Component, HostListener } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrl: "./user-profile.component.css",
})
export class UserProfileComponent {
  dialogRef: MatDialogRef<any> | null = null;

  isEditSidebarOpen: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  // Listener for clicks anywhere on the document
  @HostListener("document:click", ["$event"])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Check if the click is outside the sidebar or the profile icon
    const isClickInsideSidebar = target.closest(".sidebar-popup");
    const isClickOnProfileIcon = target.closest(".user-profile");

    if (!isClickInsideSidebar && !isClickOnProfileIcon) {
      this.isEditSidebarOpen = false; // Close the sidebar
    }
  }

  toggleSidebar() {
    console.log("Called");
    this.isEditSidebarOpen = !this.isEditSidebarOpen;
    console.log(this.isEditSidebarOpen);
  }
}
