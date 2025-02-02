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
  selector: "app-add-sponsor",
  templateUrl: "./add-sponsor.component.html",
  styleUrl: "./add-sponsor.component.css",
})
export class AddSponsorComponent {
  isLoading: boolean = false;

  sponsorLogo: any[] = [""];

  sponsorPayload = {
    createdBy: 0,
    createdOn: new Date().toISOString(),
    modifiedBy: 0,
    modifiedOn: new Date().toISOString(),
    id: 0,
    companyName: "",
    logoUrl: "",
    contactPerson: "",
    primaryMobile: "",
    secondaryMobile: "",
    primaryEmai: "",
    secondaryEmail: "",
    otherDetail: "",
  };

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

  addSponsor() {
    // Fetch user ID from localStorage
    const userId = localStorage.getItem("user_Id");
    if (!userId) {
      return;
    }

    // Assign userId to createdBy and modifiedBy
    this.sponsorPayload.createdBy = Number(userId);
    this.sponsorPayload.modifiedBy = Number(userId);

    // Show loading spinner
    this.isLoading = true;

    // Call API to add sponsor
    this.sponsorService.addSponsor(this.sponsorPayload).subscribe(
      (response) => {
        this.isLoading = false;
        this.showNotification("Sponsor added successfully");
      },
      (error) => {
        this.isLoading = false;
      }
    );
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
        j < this.sponsorLogo.length && dataIndex < data.length;
        j++
      ) {
        this.sponsorPayload.logoUrl = data[0];
        if (this.sponsorLogo[j] === "") {
          this.sponsorLogo[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }
      }
    });
  }

  deleteBackgroundImage(index: any): void {
    for (let i = index; i < this.sponsorLogo.length - 1; i++) {
      this.sponsorLogo[i] = this.sponsorLogo[i + 1];
    }
    this.sponsorLogo[this.sponsorLogo.length - 1] = "";
  }
}
