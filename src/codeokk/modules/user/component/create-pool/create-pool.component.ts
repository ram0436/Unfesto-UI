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
  selector: "app-create-pool",
  templateUrl: "./create-pool.component.html",
  styleUrl: "./create-pool.component.css",
})
export class CreatePoolComponent {
  isLoading: boolean = true;

  events: any[] = [];

  eventPostImage: any[] = new Array(10);
  eventPosterImage: any[] = new Array(10);

  poolPayload = {
    createdBy: 0,
    createdOn: new Date().toISOString(),
    modifiedBy: 0,
    modifiedOn: new Date().toISOString(),
    id: 0,
    eventId: 0,
    clubName: "",
    clubEmailId: "",
    eventMailerList: [
      {
        id: 0,
        detail: "",
      },
    ],
    eventWatsAppList: [
      {
        id: 0,
        detail: "",
      },
    ],
    eventLinkList: [
      {
        id: 0,
        detail: "",
      },
    ],
    eventPostList: [
      {
        id: 0,
        imageURL: "",
      },
    ],
    eventPosterList: [
      {
        id: 0,
        imageURL: "",
      },
    ],
    eventOrganisorContactList: [
      {
        id: 0,
        name: "",
        emailId: "",
        mobileNo: "",
      },
    ],
  };

  tabs = [
    { id: 1, title: "Event Pool" },
    { id: 2, title: "Event Content" },
    { id: 3, title: "Organizer Contact" },
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
    for (var i = 0; i < this.eventPostImage.length; i++) {
      this.eventPostImage[i] = "";
    }

    for (var i = 0; i < this.eventPosterImage.length; i++) {
      this.eventPosterImage[i] = "";
    }

    const userId = localStorage.getItem("user_Id");
    if (userId) {
      this.getEventsByHostId(userId);
    }
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

  deleteMailer(index: number) {
    this.poolPayload.eventMailerList.splice(index, 1);
  }

  addMailer() {
    const newMailer = {
      id: 0,
      detail: "",
    };
    this.poolPayload.eventMailerList.push(newMailer);
  }

  deleteWhatsApp(index: number) {
    this.poolPayload.eventWatsAppList.splice(index, 1);
  }

  addWhatsApp() {
    const newWhatsApp = {
      id: 0,
      detail: "",
    };
    this.poolPayload.eventWatsAppList.push(newWhatsApp);
  }

  deleteEventPost(index: number) {
    this.poolPayload.eventPostList.splice(index, 1);
  }

  deleteLink(index: number) {
    this.poolPayload.eventLinkList.splice(index, 1);
  }

  addLink() {
    const newLink = {
      id: 0,
      detail: "",
    };
    this.poolPayload.eventLinkList.push(newLink);
  }

  deleteContact(index: number) {
    this.poolPayload.eventOrganisorContactList.splice(index, 1);
  }

  addContact() {
    const newContact = {
      id: 0,
      name: "",
      emailId: "",
      mobileNo: "",
    };
    this.poolPayload.eventOrganisorContactList.push(newContact);
  }

  addEventPost() {
    const newEventPost = {
      id: 0,
      imageURL: "",
    };
    this.poolPayload.eventPostList.push(newEventPost);
    this.eventPostImage.push("");
  }

  deleteEventPostImage(index: number): void {
    this.poolPayload.eventPostList.splice(index, 1);
    this.eventPostImage.splice(index, 1);
  }

  selectEventPostFile(index: number) {
    const uploadElement = document.getElementById(
      "eventPostFileUpload" + index
    );
    if (uploadElement) {
      uploadElement.click();
    }
  }

  selectEventPostImage(event: any, index: number): void {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    this.userService.uploadImages(formData).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.poolPayload.eventPostList[index].imageURL = data[0];
        this.eventPostImage[index] = data[0];
      }
    });
  }

  deleteEventPoster(index: number) {
    this.poolPayload.eventPosterList.splice(index, 1);
  }

  addEventPoster() {
    const newEventPoster = {
      id: 0,
      imageURL: "",
    };
    this.poolPayload.eventPosterList.push(newEventPoster);
    this.eventPosterImage.push("");
  }

  deleteEventPosterImage(index: number): void {
    this.poolPayload.eventPosterList.splice(index, 1);
    this.eventPosterImage.splice(index, 1);
  }

  selectEventPosterFile(index: number) {
    const uploadElement = document.getElementById(
      "eventPosterFileUpload" + index
    );
    if (uploadElement) {
      uploadElement.click();
    }
  }

  selectEventPosterImage(event: any, index: number): void {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    this.userService.uploadImages(formData).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.poolPayload.eventPosterList[index].imageURL = data[0];
        this.eventPosterImage[index] = data[0];
      }
    });
  }

  getEventsByHostId(hostId: any) {
    this.eventService.getEventByHostId(hostId).subscribe((data: any) => {
      this.events = data.reverse();
      this.isLoading = false;
    });
  }

  createPool() {
    // Fetch user ID from localStorage
    const userId = localStorage.getItem("user_Id");
    if (!userId) {
      return;
    }

    // Assign userId to createdBy and modifiedBy
    this.poolPayload.createdBy = Number(userId);
    this.poolPayload.modifiedBy = Number(userId);

    // Show loading spinner
    this.isLoading = true;

    // Call API to add sponsor
    this.eventService.createPool(this.poolPayload).subscribe(
      (response) => {
        this.isLoading = false;
        this.showNotification("Pool created successfully");
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
