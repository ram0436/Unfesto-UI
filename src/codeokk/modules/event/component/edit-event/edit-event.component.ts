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
  registerationStartTime: string = "";
  registerationEndDate: Date | null = null;
  registerationEndTime: string = "";

  roundStartDate: Date[] = [];
  roundStartTime: string[] = [];
  roundEndDate: Date[] = [];
  roundEndTime: string[] = [];

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
      id: 0,
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
    forkJoin([
      this.getAllCategories(),
      this.getAllSkills(),
      this.getAllEventModes(),
      this.getAllEventTypes(),
      this.getAllOrganisations(),
      this.getAllParticipationTypes(),
      this.getAllVisibilities(),
      this.getAllUsers(),
    ]).subscribe(
      ([
        categories,
        skills,
        eventModes,
        eventTypes,
        organisations,
        participationTypes,
        visibilities,
        users,
      ]: any) => {
        // Assign received data to respective properties
        this.categories = categories;
        this.skills = skills;
        this.eventModes = eventModes;
        this.eventTypes = eventTypes;
        this.organisations = organisations;
        this.participationTypes = participationTypes;
        this.visibilities = visibilities;
        this.users = users;
      },
      (error: any) => {}
    );
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
  }

  updateStartDateTime() {
    if (this.registerationStartDate && this.registerationStartTime) {
      this.eventPayload.eventRegistrationList[0].registartionStartDateTime =
        this.combineDateAndTime(
          this.registerationStartDate,
          this.registerationStartTime
        );
    }
  }

  updateEndDateTime() {
    if (this.registerationEndDate && this.registerationEndTime) {
      this.eventPayload.eventRegistrationList[0].registartionEndDateTime =
        this.combineDateAndTime(
          this.registerationEndDate,
          this.registerationEndTime
        );
    }
  }

  updateRoundStartDateTime(index: number) {
    if (this.roundStartDate[index] && this.roundStartTime[index]) {
      this.eventPayload.eventRoundList[index].startDate =
        this.combineDateAndTime(
          this.roundStartDate[index],
          this.roundStartTime[index]
        );
    }
  }

  updateRoundEndDateTime(index: number) {
    if (this.roundEndDate[index] && this.roundEndTime[index]) {
      this.eventPayload.eventRoundList[index].endDate = this.combineDateAndTime(
        this.roundEndDate[index],
        this.roundEndTime[index]
      );
    }
  }

  private combineDateAndTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes);
    return combinedDate.toISOString();
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

    this.selectedCategories = eventDetails.eventCategoryList.map(
      (category: any) => category
    );

    if (eventDetails.eventBannerURL) {
      this.bannerImage = [eventDetails.eventBannerURL];
    }

    if (eventDetails.eventLogoURL) {
      this.eventImage = [eventDetails.eventLogoURL];
    }

    if (eventDetails.eventGalleryList) {
      this.galleryImage = eventDetails.eventGalleryList.map(
        (item: any) => item.imageURL
      );
    } else {
      this.galleryImage = [];
    }

    if (eventDetails.eventCollaboratorList) {
      this.selectedCollaborators = this.users.filter((user: any) =>
        eventDetails.eventCollaboratorList.some(
          (collaborator: any) => collaborator.userId === user.userId
        )
      );
    }

    if (eventDetails.eventCategoryList) {
      this.selectedCategories = this.categories.filter((category: any) =>
        eventDetails.eventCategoryList.some(
          (eventCategory: any) => eventCategory.name === category.name
        )
      );
    }

    if (eventDetails.eventSkillList) {
      this.selectedSkills = this.skills.filter((skill: any) =>
        eventDetails.eventSkillList.some(
          (eventSkill: any) => eventSkill.name === skill.name
        )
      );
    }

    // console.log(eventDetails.eventRegistrationList);
    if (eventDetails.eventRegistrationList) {
      this.setRegisterationEventDates(eventDetails.eventRegistrationList);
    }

    if (eventDetails.eventRoundList) {
      this.setRoundEventDates(eventDetails.eventRoundList);
    }
    // Sanitize description for display
    this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.eventPayload.description
    );
    this.isLoading = false;
  }

  setRoundEventDates(eventRoundList: any[]): void {
    this.roundStartDate = [];
    this.roundEndDate = [];
    this.roundStartTime = [];
    this.roundEndTime = [];

    eventRoundList.forEach((round, index) => {
      // Parse the start and end date-times
      const startDateTime = new Date(round.startDate);
      const endDateTime = new Date(round.endDate);

      // Adjust the times (e.g., add 5 hours)
      startDateTime.setHours(startDateTime.getHours() + 5);
      endDateTime.setHours(endDateTime.getHours() + 5);

      // Store the adjusted date objects
      this.roundStartDate[index] = startDateTime;
      this.roundEndDate[index] = endDateTime;

      // Extract and store the time portion from the adjusted Date objects
      this.roundStartTime[index] = this.formatTime(startDateTime);
      this.roundEndTime[index] = this.formatTime(endDateTime);
    });
  }

  setRegisterationEventDates(registerationDetails: any) {
    // Parse the start and end dates and times
    this.registerationStartDate = new Date(
      registerationDetails[0].registartionStartDateTime
    );
    this.registerationEndDate = new Date(
      registerationDetails[0].registartionEndDateTime
    );

    // Adjust the times by adding 5 hours
    this.registerationStartDate.setHours(
      this.registerationStartDate.getHours() + 5
    );
    this.registerationEndDate.setHours(
      this.registerationEndDate.getHours() + 5
    );

    // Extract the time portion from the adjusted date strings (assuming ISO format)
    this.registerationStartTime = this.formatTime(this.registerationStartDate);
    this.registerationEndTime = this.formatTime(this.registerationEndDate);
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  getFormattedStartDate(index: number): string {
    const date = this.roundStartDate[index];
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    }
    return "";
  }

  getFormattedEndDate(index: number): string {
    const date = this.roundEndDate[index];
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
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

  addGallery() {
    const newGallery = {
      id: this.eventPayload.eventGalleryList.length,
      imageURL: "",
      description: "",
    };
    this.eventPayload.eventGalleryList.push(newGallery);
    this.galleryImage.push(""); // Add a placeholder for new image
  }

  deleteGalleryImage(index: number): void {
    this.eventPayload.eventGalleryList.splice(index, 1);
    this.galleryImage.splice(index, 1);
  }

  selectGalleryFile(index: number) {
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
        this.eventPayload.eventGalleryList[index].imageURL = data[0];
        this.galleryImage[index] = data[0];
      }
    });
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
