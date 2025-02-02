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
  selector: "app-add-performance",
  templateUrl: "./add-performance.component.html",
  styleUrl: "./add-performance.component.css",
})
export class AddPerformanceComponent {
  isLoading: boolean = true;

  colleges: any[] = [];

  galleryImage: any[] = new Array(10);

  performancePayload = {
    createdBy: 0,
    createdOn: new Date().toISOString(),
    modifiedBy: 0,
    modifiedOn: new Date().toISOString(),
    id: 0,
    collegeId: 0,
    clubName: "",
    clubMail: "",
    mainEventName: "",
    subEventName: "",
    otherdetail: "",
    imageGalleryList: [
      {
        id: 0,
        imageURL: "",
      },
    ],
    promotorCollegeId: 0,
    promotorClubName: "",
    promotorClubMail: "",
  };

  tabs = [
    { id: 1, title: "Promoted Event Detail" },
    { id: 2, title: "Promotor Detail" },
  ];

  currentStep: number = 1;

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
    for (var i = 0; i < this.galleryImage.length; i++) {
      this.galleryImage[i] = "";
    }
    this.getCollege();
  }

  onEventChange(eventId: any): void {}

  onBackButtonClick() {
    if (this.currentStep > 1) {
      this.currentStep--; // Move to the previous step
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  nextStep() {
    const currentTab = this.tabs.find((tab) => tab.id === this.currentStep);

    if (!currentTab) {
      return;
    }

    // Add validation logic for each step
    let isValid = true;

    if (isValid) {
      const nextTabIndex =
        this.tabs.findIndex((tab) => tab.id === this.currentStep) + 1;
      if (nextTabIndex < this.tabs.length) {
        this.currentStep = this.tabs[nextTabIndex].id;
      }
    }
  }

  deleteGallery(index: number) {
    this.performancePayload.imageGalleryList.splice(index, 1);
  }

  addGallery() {
    const newGallery = {
      id: 0,
      imageURL: "",
    };
    this.performancePayload.imageGalleryList.push(newGallery);
    this.galleryImage.push("");
  }

  deleteGalleryImage(index: number): void {
    this.performancePayload.imageGalleryList.splice(index, 1);
    this.galleryImage.splice(index, 1);
  }

  selectGalleryImageFile(index: number) {
    const uploadElement = document.getElementById("galleryFileUpload" + index);
    if (uploadElement) {
      uploadElement.click();
    }
  }

  selectGalleryImage(event: any, index: number): void {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    this.userService.uploadImages(formData).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.performancePayload.imageGalleryList[index].imageURL = data[0];
        this.galleryImage[index] = data[0];
      }
    });
  }

  getCollege() {
    this.eventService.getOrganisation().subscribe((data: any) => {
      this.colleges = data;
      this.isLoading = false;
    });
  }

  addPerformance() {
    // Fetch user ID from localStorage
    const userId = localStorage.getItem("user_Id");
    if (!userId) {
      return;
    }

    // Assign userId to createdBy and modifiedBy
    this.performancePayload.createdBy = Number(userId);
    this.performancePayload.modifiedBy = Number(userId);

    // Show loading spinner
    this.isLoading = true;

    // Call API to add sponsor
    this.eventService.fillPerformance(this.performancePayload).subscribe(
      (response) => {
        this.isLoading = false;
        this.showNotification("Performance filled successfully");
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
}
