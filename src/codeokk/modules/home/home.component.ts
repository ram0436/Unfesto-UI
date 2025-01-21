import { Component } from "@angular/core";
import { MasterService } from "../service/master.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EventService } from "../event/service/event.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  eventTypes: any[] = [];
  dashboardItems: any[] = [];
  categorizedItems: { [key: number]: any[] } = {};
  organizations: any[] = [];
  isLoading: boolean = true; // Set isLoading to true initially
  sliderConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: false, // Disable dots
    infinite: true,
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoading = true; // Set isLoading to true before fetching data
    this.loadData(); // Call method to fetch data using forkJoin
  }

  loadData() {
    // Using forkJoin to make all the API calls in parallel
    forkJoin({
      eventTypes: this.eventService.getEventType(),
      dashboardItems: this.masterService.getDashboard(),
      organizations: this.eventService.getOrganisation(),
    }).subscribe(
      (response: any) => {
        // Assign the data to respective variables
        this.eventTypes = response.eventTypes;
        this.dashboardItems = response.dashboardItems;
        this.organizations = response.organizations;

        this.categorizeItems(); // Call method to categorize items

        this.isLoading = false; // Set isLoading to false after all API calls are completed
      },
      (error) => {
        // Handle any errors if needed
        this.isLoading = false; // Make sure loading is set to false in case of an error
        console.error("Error loading data", error);
        this.snackBar.open("Error loading data", "Close", {
          duration: 3000,
        });
      }
    );
  }

  getOrganizationName(organisationId: number): string {
    const organization = this.organizations.find(
      (org) => org.id === organisationId
    );
    return organization ? organization.name : "Unknown Organization";
  }

  categorizeItems() {
    this.categorizedItems = {};
    this.dashboardItems.forEach((item) => {
      const eventTypeId = item.eventTypeId;
      if (!this.categorizedItems[eventTypeId]) {
        this.categorizedItems[eventTypeId] = [];
      }
      this.categorizedItems[eventTypeId].push(item);
    });
  }
}
