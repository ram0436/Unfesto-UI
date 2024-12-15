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

  currentStep: number = 1; // 1 for Basic Details, 2 for Registration Details

  eventImage: any[] = [""];

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

  nextStep() {
    if (this.currentStep === 1 && this.validateBasicDetails()) {
      this.currentStep = 2;
    }
  }

  goToStep(step: number) {
    if (this.currentStep === 1 && step === 2 && !this.validateBasicDetails()) {
      return;
    }
    this.currentStep = step;
  }

  // Handle back button click
  onBackButtonClick() {
    if (this.currentStep === 2) {
      this.currentStep = 1; // Go back to Basic Details
    }
  }

  validateBasicDetails(): boolean {
    if (
      !this.eventPayload.title ||
      !this.eventPayload.eventTypeId ||
      !this.eventPayload.visibilityId
    ) {
      this.showNotification(
        "Please fill all mandatory fields in Basic Details."
      );
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
    this.eventPayload.categoryList = this.selectedCategories.map(
      (cat: any) => ({
        id: 0,
        name: cat.name,
      })
    );

    this.eventPayload.skillList = this.selectedSkills.map((skill: any) => ({
      id: 0,
      name: skill.name,
    }));

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
