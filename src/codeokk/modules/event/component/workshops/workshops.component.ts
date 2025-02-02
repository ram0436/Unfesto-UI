import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { MasterService } from "../../../service/master.service";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { forkJoin, map, Observable, startWith, Subscription } from "rxjs";
import { EventService } from "../../service/event.service";
import { UserService } from "../../../user/service/user.service";
import { EventPayload } from "../../../../shared/model/event.payload";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-workshops",
  templateUrl: "./workshops.component.html",
  providers: [provideNativeDateAdapter()],
  styleUrl: "./workshops.component.css",
})
export class WorkshopsComponent implements OnInit {
  eventPayload: EventPayload = new EventPayload();
  @ViewChild("editor") editorRef!: ElementRef;

  isLoading: boolean = true;

  eventImage: any[] = [""];
  galleryImage: any[] = new Array(10);
  bannerImage: any[] = [""];
  thumbnailImage: any[] = [""];

  categories: any[] = [];
  eventModes: any[] = [];
  eventTypes: any[] = [];
  eventSubTypes: any[] = [];
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

  registerationStartDate: Date | null = null;
  registerationStartTime: string = "";
  registerationEndDate: Date | null = null;
  registerationEndTime: string = "";

  roundStartDate: Date | null = null;
  roundEndDate: Date | null = null;
  roundStartTime: string = "";
  roundEndTime: string = "";

  roundTimes: { startTime: string; endTime: string }[] = [
    { startTime: "", endTime: "" },
  ];

  skillControl = new FormControl();
  filteredSkills!: Observable<any[]>;

  editorModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote"],
      [{ align: "" }, { align: "center" }],
    ],
  };

  tabs = [
    { id: 1, title: "Basic Details" },
    { id: 2, title: "Registration Details" },
    { id: 3, title: "About Event" },
    // { id: 4, title: "Banner & Theme" },
    { id: 4, title: "Compete Round" },
    { id: 5, title: "Prizes" },
    { id: 6, title: "Organizer Contact" },
    { id: 7, title: "Gallery" },
    { id: 8, title: "Banner" },
  ];

  currentStep: number = 1;

  categorySearch: string = "";
  filteredCategories: any[] = [...this.categories];

  private subscriptions: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private eventService: EventService,
    private masterService: MasterService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  onContentChange(content: string) {
    this.eventPayload.description = content;
  }

  ngOnInit() {
    for (var i = 0; i < this.galleryImage.length; i++) {
      this.galleryImage[i] = "";
    }
    this.eventPayload.description = `
        <p>Enter details about the opportunity here...</p>
    
        <div><strong>Basic Rules for the Events:</strong></div>
        <ul>
          <li>Rule 1: Ensure all participants are registered.</li>
          <li>Rule 2: Submit entries before the deadline.</li>
          <li>Rule 3: Follow all safety guidelines.</li>
        </ul>
      `;
    // Combine all subscriptions into a single observable
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
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }

  onRegistrationCountChange(value: any): void {
    // Ensure the value is an integer
    this.eventPayload.eventRegistrationList[0].registrationCountLimit =
      parseInt(value, 10) || 0;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  registerationStartDateTime: Date | null = null;
  registerationEndDateTime: Date | null = null;

  // updateStartDateTime() {
  //   if (this.registerationStartDateTime) {
  //     this.eventPayload.eventRegistrationList[0].registartionStartDateTime =
  //       this.registerationStartDateTime.toISOString();
  //   }
  // }

  // updateEndDateTime() {
  //   if (this.registerationEndDateTime) {
  //     this.eventPayload.eventRegistrationList[0].registartionEndDateTime =
  //       this.registerationEndDateTime.toISOString();
  //   }
  // }

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

  updateRoundStartDateTime(round: any, index: number) {
    if (round.startDate && this.roundTimes[index].startTime) {
      round.startDate = this.combineDateAndTime(
        round.startDate,
        this.roundTimes[index].startTime
      );
    }
  }

  updateRoundEndDateTime(round: any, index: number) {
    if (round.endDate && this.roundTimes[index].endTime) {
      round.endDate = this.combineDateAndTime(
        round.endDate,
        this.roundTimes[index].endTime
      );
    }
  }

  private combineDateAndTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes);
    return combinedDate.toISOString();
  }

  deletePrize(index: number) {
    this.eventPayload.eventPrizeList[0].prizeList.splice(index, 1);
  }

  addPrize() {
    const newPrize = {
      id: 0,
      rank: "",
      cash: 0,
      perks: "",
      otherDetails: "",
    };
    this.eventPayload.eventPrizeList[0].prizeList.push(newPrize);
  }

  deleteContact(index: number) {
    this.eventPayload.eventContactList.splice(index, 1);
  }

  addContact() {
    const newContact = {
      id: 0,
      name: "",
      email: "",
      contactNo: "",
    };
    this.eventPayload.eventContactList.push(newContact);
  }

  deleteRound(index: number) {
    this.roundTimes.splice(index, 1);
    this.eventPayload.eventRoundList.splice(index, 1);
  }

  addRound() {
    const newRound = {
      id: 0,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    };
    this.eventPayload.eventRoundList.push(newRound);
    this.roundTimes.push({ startTime: "", endTime: "" });
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

  onEventTypeChange(eventTypeId: any): void {
    if (eventTypeId) {
      this.getEventSubType(eventTypeId);
    } else {
      this.eventSubTypes = [];
    }
  }

  getEventSubType(eventId: any) {
    this.eventService
      .getEventSubTypeByEventType(eventId)
      .subscribe((data: any) => {
        this.eventSubTypes = data;
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

  deleteGallery(index: number) {
    this.eventPayload.eventGalleryList.splice(index, 1);
  }

  addGallery() {
    const newGallery = {
      id: 0,
      imageURL: "",
      description: "",
    };
    this.eventPayload.eventGalleryList.push(newGallery);
    this.galleryImage.push("");
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

  deleteThumbnailImage(index: any): void {
    for (let i = index; i < this.thumbnailImage.length - 1; i++) {
      this.thumbnailImage[i] = this.thumbnailImage[i + 1];
    }
    this.thumbnailImage[this.thumbnailImage.length - 1] = "";
  }

  selectThumbnailFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("thumbnailFileUpload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }

  selectThumbnailImage(event: any): void {
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
        j < this.thumbnailImage.length && dataIndex < data.length;
        j++
      ) {
        this.eventPayload.thumbnailURL = data[0];
        if (this.thumbnailImage[j] === "") {
          this.thumbnailImage[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }
      }
    });
  }

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

  goToStep(step: number) {
    // if (this.currentStep === 1 && step === 2 && !this.validateBasicDetails()) {
    //   return;
    // }
    this.currentStep = step;
  }

  onBackButtonClick() {
    if (this.currentStep > 1) {
      this.currentStep--; // Move to the previous step
    }
  }

  toNumber(value: any): number {
    return Number(value);
  }

  validateBasicDetails(): boolean {
    if (
      !this.eventPayload.title ||
      !this.eventPayload.eventTypeId ||
      !this.eventPayload.visibilityId
    ) {
      this.showNotification("Please fill all fields first");
      return false;
    }
    return true;
  }

  validateRegistrationDetails(): boolean {
    if (
      !this.eventPayload.eventRegistrationList[0].registartionStartDateTime ||
      !this.eventPayload.eventRegistrationList[0].registartionEndDateTime
    ) {
      this.showNotification("Please complete the Registration Details.");
      return false;
    }
    return true;
  }

  addEvent(): void {
    // Retrieve userId from localStorage
    const userId = parseInt(localStorage.getItem("user_Id") || "0", 10);

    // Map selected categories and skills
    this.eventPayload.eventCategoryList = this.selectedCategories.map(
      (cat: any) => ({
        id: 0,
        name: cat.name,
      })
    );

    this.eventPayload.eventSkillList = this.selectedSkills.map(
      (skill: any) => ({
        id: 0,
        name: skill.name,
      })
    );

    // Map selected collaborators
    this.eventPayload.eventCollaboratorList = this.selectedCollaborators.map(
      (collaborator: any) => ({
        createdBy: userId,
        createdOn: new Date().toISOString(),
        modifiedBy: userId,
        modifiedOn: new Date().toISOString(),
        id: 0,
        userId: collaborator.userId,
      })
    );

    // Set createdBy and modifiedBy in main EventPayload
    this.eventPayload.createdBy = userId;
    this.eventPayload.modifiedBy = userId;
    this.eventPayload.createdOn = new Date().toISOString();
    this.eventPayload.modifiedOn = new Date().toISOString();

    // console.log(JSON.stringify(this.eventPayload, null, 2));

    this.eventService.addEvent(this.eventPayload).subscribe((response) => {
      this.showNotification("Event Added Successfully");
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
