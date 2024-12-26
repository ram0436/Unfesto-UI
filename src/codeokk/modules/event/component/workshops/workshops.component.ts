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
  galleryImage: any[] = [""];
  bannerImage: any[] = [""];

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

  registerationStartDate: Date | null = null;
  registerationEndDate: Date | null = null;

  roundStartDate: Date | null = null;
  roundEndDate: Date | null = null;

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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  deletePrize(index: number) {
    this.eventPayload.eventPrizeList[0].prizeList.splice(index, 1);
  }

  addPrize() {
    const newPrize = {
      rank: "",
      cash: 0,
      perks: "",
      otherDetails: "",
    };
    this.eventPayload.eventPrizeList[0].prizeList.push(newPrize);
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

  onRoundStartDateChange() {
    if (this.roundStartDate) {
      this.eventPayload.eventRoundList[0].startDate =
        this.roundStartDate.toISOString();
    }
  }

  onRoundEndDateChange() {
    if (this.roundEndDate) {
      this.eventPayload.eventRoundList[0].endDate =
        this.roundEndDate.toISOString();
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

  deleteBannerImage(index: any): void {
    for (let i = index; i < this.bannerImage.length - 1; i++) {
      this.bannerImage[i] = this.bannerImage[i + 1];
    }
    this.bannerImage[this.bannerImage.length - 1] = "";
  }

  deleteGalleryImage(index: any): void {
    for (let i = index; i < this.galleryImage.length - 1; i++) {
      this.galleryImage[i] = this.galleryImage[i + 1];
    }
    this.galleryImage[this.galleryImage.length - 1] = "";
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

    switch (currentTab.id) {
      // case 1:
      //   isValid = this.validateBasicDetails();
      //   break;
      // case 2:
      //   isValid = this.validateRegistrationDetails();
      //   break;
      default:
        isValid = true; // If no validation is needed for a step
        break;
    }

    if (isValid) {
      const nextTabIndex =
        this.tabs.findIndex((tab) => tab.id === this.currentStep) + 1;
      if (nextTabIndex < this.tabs.length) {
        this.currentStep = this.tabs[nextTabIndex].id;
      }
    }
  }

  goToStep(step: number) {
    if (this.currentStep === 1 && step === 2 && !this.validateBasicDetails()) {
      return;
    }
    this.currentStep = step;
  }

  onBackButtonClick() {
    if (this.currentStep > 1) {
      this.currentStep--; // Move to the previous step
    }
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

    console.log(JSON.stringify(this.eventPayload, null, 2));

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
