import { Component, Inject, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { MasterService } from "../../../service/master.service";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { forkJoin, Subscription } from "rxjs";
import { EventService } from "../../service/event.service";
import { UserService } from "../../../user/service/user.service";
import { EventPayload } from "../../../../shared/model/event.payload";

@Component({
  selector: "app-workshops",
  templateUrl: "./workshops.component.html",
  styleUrl: "./workshops.component.css",
})
export class WorkshopsComponent implements OnInit {
  eventPayload: EventPayload = new EventPayload();

  isLoading: boolean = true;

  eventImage: any[] = [""];

  categories: any[] = [];
  eventModes: any[] = [];
  eventTypes: any[] = [];
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

  private subscriptions: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private eventService: EventService,
    private masterService: MasterService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Combine all subscriptions into a single observable
    forkJoin([
      this.eventService.getCategory(),
      this.eventService.getEventMode(),
      this.eventService.getEventType(),
      this.eventService.getOrganisation(),
      this.eventService.getParticipationType(),
      this.eventService.getSkill(),
      this.eventService.getVisibility(),
    ]).subscribe(
      ([
        categories,
        eventModes,
        eventTypes,
        organisations,
        participationTypes,
        skills,
        visibilities,
      ]: any) => {
        // Assign received data to respective properties
        this.categories = categories;
        this.eventModes = eventModes;
        this.eventTypes = eventTypes;
        this.organisations = organisations;
        this.participationTypes = participationTypes;
        this.skills = skills;
        this.visibilities = visibilities;

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

  getAllCategories() {
    this.eventService.getCategory().subscribe((data: any) => {
      this.categories = data;
    });
  }

  getAllEventModes() {
    this.eventService.getEventMode().subscribe((data: any) => {
      this.eventModes = data;
      console.log(this.eventModes);
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
    });
  }

  getAllVisibilities() {
    this.eventService.getVisibility().subscribe((data: any) => {
      this.visibilities = data;
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

  addEvent(): void {
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

    this.eventService.addEvent(this.eventPayload).subscribe((response) => {
      this.showNotification("Event Added Succesfully");
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
