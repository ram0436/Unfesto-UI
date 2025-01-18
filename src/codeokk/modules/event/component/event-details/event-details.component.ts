import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
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

  @ViewChild("roundsSection") roundsSection!: ElementRef;
  @ViewChild("descriptionSection") descriptionSection!: ElementRef;
  @ViewChild("datesSection") datesSection!: ElementRef;
  @ViewChild("prizesSection") prizesSection!: ElementRef;

  eventDetails: any[] = [];
  userRole: String | null = null;
  isLoading: boolean = true;

  targetRoute: any;

  descriptionHtml: SafeHtml = "";

  prizeDetails = {
    eventPrizeList: [
      {
        id: 0,
        title: "Grand Prizes",
        isParticipationCertificateProvided: true,
        prizeList: [
          {
            id: 0,
            rank: "1st",
            cash: 5000,
            perks: "Trophy and Gift Card",
            otherDetails: "",
          },
          {
            id: 1,
            rank: "2nd",
            cash: 3000,
            perks: "Gift Card",
            otherDetails: "",
          },
          {
            id: 2,
            rank: "3rd",
            cash: 2000,
            perks: "Certificate",
            otherDetails: "",
          },
        ],
      },
    ],
  };

  sections = ["Rounds & Deadlines", "Details", "Dates & Deadlines", "Prizes"];
  activeSection = 0;

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

  scrollToSection(index: number): void {
    this.activeSection = index;
    let targetElement: HTMLElement | null = null;

    // Determine which element to scroll to
    switch (index) {
      case 0:
        targetElement = this.roundsSection.nativeElement;
        break;
      case 1:
        targetElement = this.descriptionSection.nativeElement;
        break;
      case 2:
        targetElement = this.datesSection.nativeElement;
        break;
      case 3:
        targetElement = this.prizesSection.nativeElement;
        break;
    }

    // If the target element is found, scroll to it
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100, // Adjust the offset to place the section slightly below the top if needed
        behavior: "smooth",
      });
    }
  }

  calculateTotalPrize(): number {
    if (this.eventDetails[0]?.eventPrizeList?.length > 0) {
      return this.eventDetails[0].eventPrizeList.reduce(
        (total: number, prizeCategory: any) => {
          const categoryTotal = prizeCategory.prizeList.reduce(
            (sum: number, prize: any) => sum + prize.cash,
            0
          );
          return total + categoryTotal;
        },
        0
      );
    }
    return 0;
  }

  getEventDetails(guid: any) {
    this.eventService.getEventDetail(guid).subscribe((data: any) => {
      this.eventDetails = data;
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
