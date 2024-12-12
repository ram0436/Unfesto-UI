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
  selector: "app-manage-listings",
  templateUrl: "./manage-listings.component.html",
  styleUrl: "./manage-listings.component.css",
})
export class ManageListingsComponent {
  dialogRef: MatDialogRef<any> | null = null;

  events: any[] = [];
  userRole: String | null = null;
  isLoading: boolean = true;
  userId: number | null = null;

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

    if (userId) {
      this.userId = Number(userId);
      this.getEventsByUserId(userId);
    }
  }

  getEventsByUserId(userId: any) {
    this.eventService.getEventByUserId(userId).subscribe((data: any) => {
      this.events = data;
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
