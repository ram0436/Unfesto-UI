import { DOCUMENT } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { EventService } from "../../../event/service/event.service";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SponsorService } from "../../../sponsor/service/sponsor.service";

@Component({
  selector: "app-pool-details",
  templateUrl: "./pool-details.component.html",
  styleUrl: "./pool-details.component.css",
})
export class PoolDetailsComponent {
  isLoading: boolean = true;

  pools: any[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private sponsorService: SponsorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const clubEmail = localStorage.getItem("email");
    if (clubEmail) {
      this.getEventPoolDetails(clubEmail);
    }
  }

  getEventPoolDetails(clubEmail: any) {
    this.eventService.getEventPoolDetail(clubEmail).subscribe((data: any) => {
      this.pools = data.reverse();
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
