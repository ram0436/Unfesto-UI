import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../event/service/event.service";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrl: "./add-category.component.css",
})
export class AddCategoryComponent {
  dialogRef: MatDialogRef<any> | null = null;

  categories: any[] = [];
  categoryPayload = {
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
    this.getCategories();
  }

  getCategories() {
    this.eventService.getCategory().subscribe((data: any) => {
      this.categories = data;
      this.isLoading = false;
    });
  }

  addCategory(): void {
    if (this.isFormValid()) {
      this.masterService.addCategory(this.categoryPayload).subscribe(
        (response) => {
          this.showNotification("Category added successfully");
          this.getCategories();
          this.categoryPayload = { id: 0, name: "" };
        },
        (error) => {}
      );
    } else {
      this.showNotification("Please provide a valid category name");
    }
  }

  isFormValid(): boolean {
    return this.categoryPayload.name.trim() !== "";
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
