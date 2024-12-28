import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../../user/service/user.service";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../event/service/event.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { forkJoin, map, Observable, startWith, Subscription } from "rxjs";
import { EventPayload } from "../../../../shared/model/event.payload";
import { FormControl } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
  selector: "app-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrl: "./edit-event.component.css",
  providers: [provideNativeDateAdapter()],
})
export class EditEventComponent {
  eventPayload: EventPayload = new EventPayload();
  events: any[] = [];
  eventDetails: any | null = null;
  selectedEventGuid: string | null = null;
  isLoading: boolean = true;
  descriptionHtml: SafeHtml = "";

  private subscriptions = new Subscription();
  targetRoute: any;

  isEditSidebarOpen: boolean = false;
  activeEditSidebar: string | null = null;

  registerationStartDate: Date | null = null;
  registerationEndDate: Date | null = null;

  bannerImage: any[] = [""];
  galleryImage: any[] = [""];
  eventImage: any[] = [""];

  editItems = [
    {
      icon: "image",
      title: "Opportunity Banners & Themes",
      description: "Manage banners and themes for the opportunity.",
    },
    {
      icon: "info",
      title: "Basic Details & Registration",
      description: "Edit basic details and registration info.",
    },
    {
      icon: "timeline",
      title: "Rounds & Timelines",
      description: "Adjust the rounds and timelines.",
    },
    {
      icon: "article",
      title: "About the Opportunity",
      description: "Update information about the opportunity.",
    },
    {
      icon: "star",
      title: "Prizes",
      description: "Customize prizes and rewards.",
    },
    {
      icon: "calendar_today",
      title: "Important Dates, Contacts & Manuals",
      description: "Set key dates and contacts.",
    },
    {
      icon: "photo_library",
      title: "Edit Gallery",
      description: "Manage gallery images and videos.",
    },
  ];

  editorModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote"],
      [{ align: "" }, { align: "center" }],
    ],
  };

  categories: any[] = [];
  eventModes: any[] = [];
  eventTypes: any[] = [];
  users: any[] = [];
  organisations: any[] = [];
  participationTypes: any[] = [];
  skills: any[] = [];
  visibilities: any[] = [];
  selectedEventTypeId: number = 0;
  selectedOrganisationId: number = 0;
  selectedEventModeId: number = 0;
  selectedVisibilityId: number = 0;

  selectedCategories: any[] = [];
  selectedSkills: any[] = [];
  selectedCollaborators: any[] = [];

  skillControl = new FormControl();
  filteredSkills!: Observable<any[]>;

  activeIndex: number | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  toggleEditSidebar(sidebarId: string): void {
    // this.activeIndex = Number(sidebarId);
    if (sidebarId === "") {
      this.isEditSidebarOpen = false;
      this.activeEditSidebar = null;
    } else if (this.activeEditSidebar === sidebarId) {
      this.isEditSidebarOpen = false;
      this.activeEditSidebar = null;
    } else {
      this.isEditSidebarOpen = true;
      this.activeEditSidebar = sidebarId;
    }
  }

  onContentChange(content: string) {
    this.eventPayload.description = content;
    this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.eventPayload.description
    );
  }

  deletePrize(index: number) {
    this.eventPayload.eventPrizeList[0].prizeList.splice(index, 1);
  }

  addPrize() {
    if (!this.eventPayload.eventPrizeList[0].prizeList) {
      this.eventPayload.eventPrizeList[0].prizeList = [];
    }

    this.eventPayload.eventPrizeList[0].prizeList.push({
      rank: "",
      cash: 0,
      perks: "",
      otherDetails: "",
    });
  }

  addNewRound(): void {
    this.eventPayload.eventRoundList.push({
      id: 0,
      title: "",
      description: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    });
  }

  addNewContact() {
    const newContact = {
      id: 0,
      name: "",
      email: "",
      contactNo: "",
    };
    this.eventPayload.eventContactList.push(newContact);
  }

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const eventId = params.get("id");
        this.targetRoute = params.get("targetRoute");
        if (eventId != null) {
          this.eventPayload.id = Number(eventId);
          this.getEventDetailById(eventId);
        }
      })
    );
    forkJoin([
      this.getAllCategories(),
      this.getAllEventModes(),
      this.getAllEventTypes(),
      this.getAllOrganisations(),
      this.getAllParticipationTypes(),
      this.getAllSkills(),
      this.getAllVisibilities(),
      this.getAllUsers(),
    ]).subscribe(
      ([
        categories,
        eventModes,
        eventTypes,
        organisations,
        participationTypes,
        skills,
        visibilities,
        users,
      ]: any) => {
        // Assign received data to respective properties
        this.categories = categories;
        this.eventModes = eventModes;
        this.eventTypes = eventTypes;
        this.organisations = organisations;
        this.participationTypes = participationTypes;
        this.skills = skills;
        this.visibilities = visibilities;
        this.users = users;
      },
      (error: any) => {}
    );
  }

  getEventDetailById(eventId: any) {
    this.eventService.getEventDetailById(eventId).subscribe((data: any) => {
      this.eventDetails = data;
      this.updateEventPayload(data);
      this.eventPayload.description = this.eventDetails?.description;
      this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.eventDetails?.description || "-"
      );
    });
  }

  updateEventPayload(eventDetails: any): void {
    const userId = parseInt(localStorage.getItem("user_Id") || "0", 10);
    // Map event details to EventPayload
    this.eventPayload = {
      ...this.eventPayload,
      id: eventDetails.eventId,
      tabRefGuid: eventDetails.tabRefGuid,
      eventLogoURL: eventDetails.eventLogoURL,
      eventBannerURL: eventDetails.eventBannerURL,
      title: eventDetails.title,
      description: eventDetails.description,
      createdBy: eventDetails.createdBy || userId,
      createdOn: eventDetails.createdOn || new Date().toISOString(),
      modifiedBy: eventDetails.modifiedBy || userId,
      modifiedOn: new Date().toISOString(),
      websiteURL: eventDetails.websiteURL || "",
      eventModeId:
        this.getIdFromName(eventDetails.eventMode, this.eventModes) ?? 0,
      eventTypeId:
        this.getIdFromName(eventDetails.eventType, this.eventTypes) ?? 0,
      organisationId:
        this.getIdFromName(eventDetails.organisation, this.organisations) ?? 0,
      eventRegistrationList: eventDetails.eventRegistrationList || [],
      eventCategoryList: eventDetails.eventCategoryList || [],
      eventSkillList: eventDetails.eventSkillList || [],
      eventCollaboratorList: eventDetails.eventCollaboratorList || [],
      eventRoundList: eventDetails.eventRoundList || [],
      eventContactList: eventDetails.eventContactList || [],
      eventPrizeList: eventDetails.eventPrizeList || [],
      eventGalleryList: eventDetails.eventGalleryList || [],
    };

    // Sanitize description for display
    this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.eventPayload.description
    );
    this.isLoading = false;
  }

  getIdFromName(name: string, list: any[]): number | null {
    const item = list.find((entry) => entry.name === name);
    return item ? item.id : null;
  }

  getNameFromId(id: number, list: any[]): string {
    const item = list.find((entry) => entry.id === id);
    return item ? item.name : "Unknown";
  }

  updateEvent(): void {
    if (!this.eventPayload.id) {
      this.showNotification("Event ID is missing. Cannot update.");
      return;
    }

    // console.log(JSON.stringify(this.eventPayload, null, 2));

    this.eventService
      .updateEvent(this.eventPayload.id, this.eventPayload)
      .subscribe({
        next: () => {
          this.showNotification("Event updated successfully.");
        },
        error: () => {},
      });
  }

  onRegisterationStartDateChange() {
    if (this.registerationStartDate) {
      this.eventPayload.eventRegistrationList[0].registartionStartDateTime =
        this.registerationStartDate.toISOString();
    }
  }

  onRegisterationEndDateChange() {
    if (this.registerationEndDate) {
      this.eventPayload.eventRegistrationList[0].registartionEndDateTime =
        this.registerationEndDate.toISOString();
    }
  }

  getAllCategories() {
    this.eventService.getCategory().subscribe((data: any) => {
      this.categories = data;
    });
  }

  getAllEventModes() {
    this.eventService.getEventMode().subscribe((data: any) => {
      this.eventModes = data;
    });
  }

  getAllEventTypes() {
    this.eventService.getEventType().subscribe((data: any) => {
      this.eventTypes = data;
    });
  }

  getAllOrganisations() {
    this.eventService.getOrganisation().subscribe((data: any) => {
      this.organisations = data;
    });
  }

  getAllParticipationTypes() {
    this.eventService.getParticipationType().subscribe((data: any) => {
      this.participationTypes = data;
    });
  }

  getAllSkills() {
    this.eventService.getSkill().subscribe((data: any) => {
      this.skills = data;
      this.filteredSkills = this.skillControl.valueChanges.pipe(
        startWith(""),
        map((value) => this.filterSkills(value || ""))
      );
    });
  }

  filterSkills(value: any): { id: number; name: string }[] {
    const filterValue =
      typeof value === "string"
        ? value.toLowerCase()
        : value?.name?.toLowerCase();
    return this.skills.filter((skill) =>
      skill.name.toLowerCase().includes(filterValue)
    );
  }

  // Handle selected skill
  handleSkill(skill: any) {
    if (!this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
    this.skillControl.setValue("");
  }

  // Display function for autocomplete
  displaySkill(skill: any): string {
    return skill ? skill.name : "";
  }

  // Remove a skill from the selected list
  removeSkill(skill: any) {
    const index = this.selectedSkills.indexOf(skill);
    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
    }
  }

  getAllVisibilities() {
    this.eventService.getVisibility().subscribe((data: any) => {
      this.visibilities = data;
    });
  }

  getAllUsers() {
    this.userService.getAllUserId().subscribe((data: any) => {
      this.users = data;
    });
  }

  onVisibilityChane() {}

  deleteBannerImage(index: any): void {
    for (let i = index; i < this.bannerImage.length - 1; i++) {
      this.bannerImage[i] = this.bannerImage[i + 1];
    }
    this.bannerImage[this.bannerImage.length - 1] = "";
  }

  selectBannerFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("bannerFileUpload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }

  selectBannerImage(event: any): void {
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
        j < this.bannerImage.length && dataIndex < data.length;
        j++
      ) {
        this.eventPayload.eventBannerURL = data[0];
        if (this.bannerImage[j] === "") {
          this.bannerImage[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }
      }
    });
  }

  selectGalleryFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("galleryFileUpload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }

  selectGalleryImage(event: any): void {
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
        j < this.galleryImage.length && dataIndex < data.length;
        j++
      ) {
        this.eventPayload.eventGalleryList[0].imageURL = data[0];
        if (this.galleryImage[j] === "") {
          this.galleryImage[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }
      }
    });
  }

  deleteGalleryImage(index: any): void {
    for (let i = index; i < this.galleryImage.length - 1; i++) {
      this.galleryImage[i] = this.galleryImage[i + 1];
    }
    this.galleryImage[this.galleryImage.length - 1] = "";
  }

  selectFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("eventFileUpload");
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
        j < this.eventImage.length && dataIndex < data.length;
        j++
      ) {
        this.eventPayload.eventLogoURL = data[0];
        if (this.eventImage[j] === "") {
          this.eventImage[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }
      }
    });
  }

  deleteBackgroundImage(index: any): void {
    for (let i = index; i < this.eventImage.length - 1; i++) {
      this.eventImage[i] = this.eventImage[i + 1];
    }
    this.eventImage[this.eventImage.length - 1] = "";
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
