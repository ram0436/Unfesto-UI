import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../../user/service/user.service";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../event/service/event.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-all-events",
  templateUrl: "./all-events.component.html",
  styleUrls: ["./all-events.component.css"],
})
export class AllEventsComponent {
  events: any[] = [];
  eventDetails: any | null = null;
  selectedEventGuid: string | null = null;
  isLoading: boolean = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.eventService.getAllEvent().subscribe((data: any) => {
      this.events = data.reverse();
      if (this.events.length > 0) {
        this.selectEvent(this.events[0].tabRefGuid); // Select the first event by default
      }
    });
  }

  selectEvent(tabRefGuid: string) {
    this.selectedEventGuid = tabRefGuid;
    this.getEventDetails(tabRefGuid);
  }

  getEventDetails(guid: string) {
    this.eventService.getEventDetail(guid).subscribe((data: any) => {
      this.eventDetails = data[0] || null;
      this.isLoading = false;
    });
  }

  addEventRegisteration() {
    // Fetch the userId from localStorage
    const userId = localStorage.getItem("user_Id");
    if (!userId) {
      this.showNotification("User not logged in");
      return;
    }

    if (!this.eventDetails?.eventId) {
      this.showNotification("Cannot register event at the moment");
      return;
    }

    const payload = {
      createdBy: Number(userId),
      createdOn: new Date().toISOString(),
      modifiedBy: Number(userId),
      modifiedOn: new Date().toISOString(),
      id: 0,
      eventId: this.eventDetails.eventId,
      userId: Number(userId),
    };

    this.eventService.addEventUserRegisteration(payload).subscribe({
      next: (response) => {
        this.showNotification("Event Registered Successfully");
      },
      error: (err) => {
        // console.error(err);
      },
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
