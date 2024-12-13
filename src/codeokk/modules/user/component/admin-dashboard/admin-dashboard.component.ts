import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { UserPayload } from "../../../../shared/model/user.payload";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../host/service/event.service";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrl: "./admin-dashboard.component.css",
})
export class AdminDashboardComponent {
  dialogRef: MatDialogRef<any> | null = null;

  events: any[] = [];
  userRole: String | null = null;
  isLoading: boolean = true;
  userId: number | null = null;
  users: any[] = [];
  selectedTab: string = "events";

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem("user_Id");
    this.getAllEvents();
    this.getAllUsers();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  getAllEvents() {
    this.eventService.getAllEvent().subscribe((data: any) => {
      this.events = data;
      this.isLoading = false;
    });
  }

  getAllUsers() {
    this.userService.getAllUser().subscribe((data: any) => {
      this.users = data;
      this.isLoading = false;
    });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
