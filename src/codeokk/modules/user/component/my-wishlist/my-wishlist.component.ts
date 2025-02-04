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
  selector: "app-my-wishlist",
  templateUrl: "./my-wishlist.component.html",
  styleUrl: "./my-wishlist.component.css",
})
export class MyWishlistComponent {
  dialogRef: MatDialogRef<any> | null = null;

  events: any[] = [];
  eventTypes: any[] = [];
  selectedEventType: string | null = null;

  userRole: String | null = null;
  isLoading: boolean = true;
  userId: number | null = null;
  isCollaborator: boolean = false;
  userString: String | null = "";

  wishlistItems: Set<number> = new Set();

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
    this.userString = localStorage.getItem("userId");
    const user_Id = localStorage.getItem("user_Id");

    this.getAllEventTypes();

    if (user_Id) {
      this.userId = Number(user_Id);
      this.getMyWishlist(this.userId);
    }
  }

  getAllEventTypes() {
    this.eventService.getEventType().subscribe((data: any) => {
      this.eventTypes = data;
    });
  }

  addToWishlist(eventId: number) {
    const userId = localStorage.getItem("user_Id");
    const timestamp = new Date().toISOString();

    const wishlistPayload = {
      createdBy: userId ? parseInt(userId) : 0,
      createdOn: timestamp,
      modifiedBy: userId ? parseInt(userId) : 0,
      modifiedOn: timestamp,
      id: 0, // If API requires an ID, it should be provided accordingly
      eventId: eventId,
    };

    this.eventService.addToWishlist(wishlistPayload).subscribe(
      (data: any) => {
        this.showNotification("Event Removed From Wishlist");
        window.location.reload();
        if (this.wishlistItems.has(eventId)) {
          this.wishlistItems.delete(eventId);
        } else {
          this.wishlistItems.add(eventId);
        }
      },
      (error: any) => {}
    );
  }

  getMyWishlist(userId: any) {
    this.eventService.getMyWishlist(userId).subscribe((data: any) => {
      const events = data.reverse();

      if (events.length > 0) {
        const detailRequests = events.map((event: any) =>
          this.eventService.getEventDetailById(event.eventId).pipe(
            map((details: any) => ({
              ...event,
              eventType: details.eventType,
              eventRegistrationList: details.eventRegistrationList || [],
              eventCollaboratorList: details.eventCollaboratorList || [],
            }))
          )
        );

        // Use forkJoin to execute all detail requests in parallel
        forkJoin(detailRequests).subscribe(
          (detailedEvents: any) => {
            this.events = detailedEvents;
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
      } else {
        // If no events, just reset the lists
        this.events = [];
        this.isLoading = false;
      }
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
