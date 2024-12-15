import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../event/service/event.service";

@Component({
  selector: "app-add-organization",
  templateUrl: "./add-organization.component.html",
  styleUrl: "./add-organization.component.css",
})
export class AddOrganizationComponent {
  dialogRef: MatDialogRef<any> | null = null;

  organizations: any[] = [];
  organizationPayload = {
    id: 0,
    name: "",
  };
  isLoading: boolean = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private eventService: EventService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getOrganizations();
  }

  getOrganizations() {
    this.eventService.getOrganisation().subscribe((data: any) => {
      this.organizations = data;
      this.isLoading = false;
    });
  }

  addOrganization(): void {
    if (this.isFormValid()) {
      this.masterService.addOrganization(this.organizationPayload).subscribe(
        (response) => {
          this.showNotification("Organization added successfully");
          this.getOrganizations();
          this.organizationPayload = { id: 0, name: "" };
        },
        (error) => {}
      );
    } else {
      this.showNotification("Please provide a valid organization name");
    }
  }

  isFormValid(): boolean {
    return this.organizationPayload.name.trim() !== "";
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
