import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { UserPayload } from "../../../../shared/model/user.payload";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../event/service/event.service";

@Component({
  selector: "app-my-registerations",
  templateUrl: "./my-registerations.component.html",
  styleUrl: "./my-registerations.component.css",
})
export class MyRegisterationsComponent {
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
    this.getUserRegisterations();
  }

  getUserRegisterations() {
    const userId = localStorage.getItem("user_Id");
    this.eventService
      .getMyEventRegisteration(Number(userId))
      .subscribe((data: any) => {
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
