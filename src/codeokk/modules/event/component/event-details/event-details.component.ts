import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../../user/service/user.service";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../service/event.service";
import { Subscription } from "rxjs";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-event-details",
  templateUrl: "./event-details.component.html",
  styleUrl: "./event-details.component.css",
})
export class EventDetailsComponent {
  dialogRef: MatDialogRef<any> | null = null;

  eventDetails: any[] = [];
  userRole: String | null = null;
  isLoading: boolean = true;

  targetRoute: any;

  descriptionHtml: SafeHtml = "";

  private subscriptions = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const tableRefGuid = params.get("id");
        this.targetRoute = params.get("targetRoute");
        if (tableRefGuid != null) {
          this.getEventDetails(tableRefGuid);
        }
      })
    );
  }

  getEventDetails(guid: any) {
    this.eventService.getEventDetail(guid).subscribe((data: any) => {
      this.eventDetails = data;
      console.log(this.eventDetails);
      this.isLoading = false;
      this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.eventDetails[0]?.description || "-"
      );
    });
  }

  addEventRegisteration() {
    // Fetch the userId from localStorage
    const userId = localStorage.getItem("user_Id");

    if (!this.eventDetails[0]?.eventId) {
      this.showNotification("Cannot register event at the moment");
      return;
    }

    const payload = {
      createdBy: Number(userId),
      createdOn: new Date().toISOString(),
      modifiedBy: Number(userId),
      modifiedOn: new Date().toISOString(),
      id: 0,
      eventId: this.eventDetails[0]?.eventId,
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
