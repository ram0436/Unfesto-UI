import { Component } from "@angular/core";
import { MasterService } from "../service/master.service";
import { ActivatedRoute, Router } from "@angular/router";
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
  eventSubTypes: any[] = [];
  organizations: any[] = [];
  isLoading: boolean = true;
  sliderConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: false, // Disable dots
    infinite: true,
  };

  containerTitle: string = "Featured Opportunities";
  containerDescription: string =
    "Explore the Competitions that are creating a buzz among your peers!";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      const isFrom = params["isfrom"];
      const id = params["id"];
      if (isFrom && id) {
        this.loadEventDataByParams(isFrom, +id);
      } else {
        this.loadData(); // Default data loading logic
      }
    });
  }

  loadData() {
    forkJoin({
      eventTypes: this.eventService.getEventType(),
      dashboardItems: this.masterService.getDashboard(),
      organizations: this.eventService.getOrganisation(),
    }).subscribe(
      (response: any) => {
        this.eventTypes = response.eventTypes;
        this.dashboardItems = response.dashboardItems;
        this.organizations = response.organizations;

        this.categorizeItems();

        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open("Error loading data", "Close", {
          duration: 3000,
        });
      }
    );
  }

  loadEventDataByParams(isFrom: string, id: number) {
    this.eventService.getEventSubTypeByEventType(id).subscribe(
      (subTypes: any) => {
        this.eventSubTypes = subTypes;
        this.categorizeDashboardItemsBySubType();
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open("Error loading event subtypes", "Close", {
          duration: 3000,
        });
      }
    );
  }

  categorizeDashboardItemsBySubType() {
    this.masterService.getDashboard().subscribe((items: any) => {
      this.dashboardItems = items;
      this.categorizedItems = {};

      this.eventSubTypes.forEach((subType) => {
        this.categorizedItems[subType.id] = this.dashboardItems.filter(
          (item: any) => item.eventSubTypeId === subType.id
        );
      });

      this.isLoading = false;
    });
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
