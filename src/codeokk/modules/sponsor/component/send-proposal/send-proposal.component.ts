import { Component, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { EventService } from "../../../event/service/event.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SponsorService } from "../../service/sponsor.service";
import { UserService } from "../../../user/service/user.service";
import { DOCUMENT } from "@angular/common";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-send-proposal",
  templateUrl: "./send-proposal.component.html",
  providers: [provideNativeDateAdapter()],
  styleUrl: "./send-proposal.component.css",
})
export class SendProposalComponent {
  colleges: any[] = [];
  isLoading: boolean = true;
  pdfBrochure: any[] = [""];
  registerationStartDate: Date | null = null;

  proposalPayload = {
    createdBy: Number(localStorage.getItem("user_Id")) || 0,
    createdOn: new Date().toISOString(),
    modifiedBy: Number(localStorage.getItem("user_Id")) || 0,
    modifiedOn: new Date().toISOString(),
    id: 0,
    sponsorId: 0,
    collegeId: 0,
    mainEventName: "",
    subEventName: "",
    clubName: "",
    clubEmail: "",
    contactPerson: "",
    primaryMobile: "",
    secondaryMobile: "",
    secondaryEmail: "",
    eventDate: new Date().toISOString(),
    eventDetails: "",
    pdfBrochure: "",
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private sponsorService: SponsorService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getCollege();
    if (this.data?.sponsorId) {
      this.proposalPayload.sponsorId = this.data.sponsorId;
    }
  }

  getCollege() {
    this.masterService.getCollege().subscribe((items: any) => {
      this.colleges = items;
      this.isLoading = false;
    });
  }

  submitProposal() {
    this.sponsorService.sendProposalToSponsor(this.proposalPayload).subscribe(
      (response) => {
        this.showNotification("Proposal sent successfully!");
      },
      (error) => {
        // this.showNotification("Error sending proposal.");
      }
    );
  }

  updateStartDateTime() {
    if (this.registerationStartDate) {
      this.proposalPayload.eventDate =
        this.registerationStartDate.toISOString();
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  selectFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("sponsorFileUpload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }

  selectImage(event: any): void {
    var files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    this.userService.uploadImages(formData).subscribe((data: any) => {
      let imagesLength = data.length;
      let dataIndex = 0;

      for (
        let j = 0;
        j < this.pdfBrochure.length && dataIndex < data.length;
        j++
      ) {
        this.proposalPayload.pdfBrochure = data[0];
        if (this.pdfBrochure[j] === "") {
          this.pdfBrochure[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }
      }
    });
  }

  deleteBackgroundImage(index: any): void {
    for (let i = index; i < this.pdfBrochure.length - 1; i++) {
      this.pdfBrochure[i] = this.pdfBrochure[i + 1];
    }
    this.pdfBrochure[this.pdfBrochure.length - 1] = "";
  }
}
