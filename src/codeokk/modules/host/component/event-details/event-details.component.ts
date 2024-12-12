import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../../user/service/user.service";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../host/service/event.service";
import { Subscription } from "rxjs";

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

  private subscriptions = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private snackBar: MatSnackBar
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
