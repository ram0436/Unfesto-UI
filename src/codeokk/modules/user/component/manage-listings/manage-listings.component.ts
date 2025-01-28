import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { UserPayload } from "../../../../shared/model/user.payload";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../event/service/event.service";
import { forkJoin, map } from "rxjs";

@Component({
  selector: "app-manage-listings",
  templateUrl: "./manage-listings.component.html",
  styleUrl: "./manage-listings.component.css",
})
export class ManageListingsComponent {
  dialogRef: MatDialogRef<any> | null = null;

  events: any[] = [];
  filteredEvents: any[] = [];
  eventTypes: any[] = [];
  selectedEventType: string | null = null; // Tracks the currently selected event type name

  userRole: String | null = null;
  isLoading: boolean = true;
  userId: number | null = null;
  isCollaborator: boolean = false;
  userString: String | null = "";

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isCollaborator = params["isCollaborator"] === "true";
    });

    this.userString = localStorage.getItem("userId");
    const user_Id = localStorage.getItem("user_Id");

    this.getAllEventTypes();

    if (this.isCollaborator && this.userString) {
      this.getEventsByCollaboratorId(this.userString);
    } else if (user_Id) {
      this.userId = Number(user_Id);
      this.getEventsByUserId(this.userId);
    }
  }

  getAllEventTypes() {
    this.eventService.getEventType().subscribe((data: any) => {
      this.eventTypes = data;
    });
  }

  getEventsByCollaboratorId(userId: any) {
    this.eventService
      .getEventByCollaboratorId(userId)
      .subscribe((data: any) => {
        const events = data.reverse();

        if (events.length > 0) {
          const detailRequests = events.map((event: any) =>
            this.eventService.getEventDetailById(event.eventId).pipe(
              map((details: any) => ({
                ...event,
                eventType: details.eventType,
              }))
            )
          );

          // Use forkJoin to execute all detail requests in parallel
          forkJoin(detailRequests).subscribe(
            (detailedEvents: any) => {
              this.events = detailedEvents;
              this.filteredEvents = [...this.events];
              this.isLoading = false;
            },
            (error) => {
              this.isLoading = false;
            }
          );
        } else {
          // If no events, just reset the lists
          this.events = [];
          this.filteredEvents = [];
          this.isLoading = false;
        }
      });
  }

  getEventsByUserId(userId: any) {
    this.eventService.getEventByUserId(userId).subscribe((data: any) => {
      const events = data.reverse();

      if (events.length > 0) {
        const detailRequests = events.map((event: any) =>
          this.eventService.getEventDetailById(event.eventId).pipe(
            map((details: any) => ({
              ...event,
              eventType: details.eventType,
            }))
          )
        );

        // Use forkJoin to execute all detail requests in parallel
        forkJoin(detailRequests).subscribe(
          (detailedEvents: any) => {
            this.events = detailedEvents;
            this.filteredEvents = [...this.events];
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
      } else {
        // If no events, just reset the lists
        this.events = [];
        this.filteredEvents = [];
        this.isLoading = false;
      }
    });
  }

  filterEventsByType(eventTypeName: string | null): void {
    this.selectedEventType = eventTypeName;

    if (eventTypeName === null) {
      // Show all events when 'All' is selected
      this.filteredEvents = [...this.events];
    } else {
      // Filter events by eventType
      this.filteredEvents = this.events.filter(
        (event) => event.eventType === eventTypeName
      );
    }
  }

  deleteEventById(eventId: any): void {
    if (confirm("Are you sure you want to delete this event?")) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          this.showNotification("Event deleted successfully!");
          window.location.reload();
        },
        (error) => {}
      );
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
