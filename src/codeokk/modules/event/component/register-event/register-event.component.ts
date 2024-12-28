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
  selector: "app-register-event",
  templateUrl: "./register-event.component.html",
  styleUrl: "./register-event.component.css",
})
export class RegisterEventComponent {
  eventPayload: EventPayload = new EventPayload();
  events: any[] = [];
  eventDetails: any | null = null;
  selectedEventGuid: string | null = null;
  isLoading: boolean = true;
  descriptionHtml: SafeHtml = "";

  private subscriptions = new Subscription();
  targetRoute: any;

  eventModes: any[] = [];
  eventTypes: any[] = [];
  users: any[] = [];
  userTypes: any[] = [];
  courses: any[] = [];
  organisations: any[] = [];
  visibilities: any[] = [];
  selectedEventTypeId: number = 0;
  selectedOrganisationId: number = 0;
  selectedEventModeId: number = 0;
  selectedVisibilityId: number = 0;

  courseId: any;
  courseControl = new FormControl({});
  filteredCourses!: Observable<{ id: number; name: string }[]>;

  participant = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    gender: "",
    organizationId: 0,
    userTypeId: 0,
    courseId: 0,
    experience: 0,
  };

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
      this.getAllEventModes(),
      this.getAllEventTypes(),
      this.getAllOrganisations(),
      this.getAllVisibilities(),
      this.getAllUsers(),
      this.getAllUserTypes(),
      this.getAllCourses(),
    ]).subscribe(
      ([
        eventModes,
        eventTypes,
        organisations,
        visibilities,
        users,
        userTypes,
        courses,
      ]: any) => {
        // Assign received data to respective properties
        this.eventModes = eventModes;
        this.eventTypes = eventTypes;
        this.organisations = organisations;
        this.visibilities = visibilities;
        this.users = users;
        this.userTypes = userTypes;
        this.courses = courses;
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

    this.isLoading = false;
  }

  handleCourse(course: any) {
    this.participant.courseId = course.id;
    this.courseControl.setValue(course);
  }

  displayCourse(course: any): string {
    return course ? course.name : "";
  }

  filterCourses(value: any): { id: number; name: string }[] {
    const filterValue =
      typeof value === "string"
        ? value.toLowerCase()
        : value?.name?.toLowerCase();
    return this.courses.filter((course) =>
      course.name.toLowerCase().includes(filterValue)
    );
  }

  getFilteredCourses() {
    this.filteredCourses = this.courseControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.filterCourses(value || ""))
    );
  }

  getAllCourses() {
    this.masterService.getCourse().subscribe((data: any) => {
      this.courses = data;
      this.filteredCourses = this.courseControl.valueChanges.pipe(
        startWith(""),
        map((value) => this.filterCourses(value || ""))
      );
    });
  }

  getIdFromName(name: string, list: any[]): number | null {
    const item = list.find((entry) => entry.name === name);
    return item ? item.id : null;
  }

  getNameFromId(id: number, list: any[]): string {
    const item = list.find((entry) => entry.id === id);
    return item ? item.name : "Unknown";
  }

  registerParticipant() {
    // Construct participant data for eligibility list
    const participantEligibility = {
      id: this.eventPayload.eventParticipantEligibilityList.length + 1, // or any logic to generate a unique ID
      firstName: this.participant.firstName,
      lastName: this.participant.lastName,
      email: this.participant.email,
      mobile: this.participant.mobileNo,
      gender: this.participant.gender,
      organizationId: this.participant.organizationId,
      userTypeId: this.participant.userTypeId,
      courseId: this.participant.courseId,
      experience: Number(this.participant.experience),
    };

    // Add the participant data to the eventParticipantEligibilityList
    this.eventPayload.eventParticipantEligibilityList.push(
      participantEligibility
    );

    if (!this.eventPayload.id) {
      this.showNotification("Something went wrong");
      return;
    }

    this.eventService
      .updateEvent(this.eventPayload.id, this.eventPayload)
      .subscribe({
        next: () => {
          // Fetch the userId from localStorage
          const userId = localStorage.getItem("user_Id");

          const payload = {
            createdBy: Number(userId),
            createdOn: new Date().toISOString(),
            modifiedBy: Number(userId),
            modifiedOn: new Date().toISOString(),
            id: 0,
            eventId: this.eventPayload.id,
            userId: Number(userId),
          };

          this.eventService.addEventUserRegisteration(payload).subscribe({
            next: (response) => {
              this.showNotification("Event Registered Successfully");
            },
            error: (err) => {},
          });
        },
        error: () => {},
      });

    // Optionally, reset the form fields
    this.resetForm();
  }

  resetForm() {
    this.participant = {
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      gender: "",
      organizationId: 0,
      userTypeId: 0,
      courseId: 0,
      experience: 0,
    };
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

  getAllUserTypes() {
    this.masterService.getUserType().subscribe((data: any) => {
      this.userTypes = data;
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
