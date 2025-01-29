import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { EventService } from "../../../event/service/event.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SponsorService } from "../../service/sponsor.service";
import { SendProposalComponent } from "../send-proposal/send-proposal.component";

@Component({
  selector: "app-all-sponsors",
  templateUrl: "./all-sponsors.component.html",
  styleUrl: "./all-sponsors.component.css",
})
export class AllSponsorsComponent {
  sponsors: any[] = [];
  isLoading: boolean = true;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private sponsorService: SponsorService
  ) {}

  ngOnInit() {
    this.getAllSponsors();
  }

  getAllSponsors() {
    this.sponsorService.getAllSponsor().subscribe((items: any) => {
      this.sponsors = items;
      this.isLoading = false;
    });
  }

  openApplyModal(sponsor: any) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(SendProposalComponent, {
      width: "500px",
      height: "90vh",
      data: { sponsorId: sponsor.id }, // Pass sponsorId to modal
    });

    this.dialogRef.afterClosed().subscribe((result) => {});
  }
}
