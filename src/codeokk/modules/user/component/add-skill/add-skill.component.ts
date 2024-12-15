import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../../event/service/event.service";

@Component({
  selector: "app-add-skill",
  templateUrl: "./add-skill.component.html",
  styleUrl: "./add-skill.component.css",
})
export class AddSkillComponent {
  dialogRef: MatDialogRef<any> | null = null;

  skills: any[] = [];
  skillPayload = {
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
    this.getSkills();
  }

  getSkills() {
    this.eventService.getSkill().subscribe((data: any) => {
      this.skills = data;
      this.isLoading = false;
    });
  }

  addSkill(): void {
    if (this.isFormValid()) {
      this.masterService.addSkill(this.skillPayload).subscribe(
        (response) => {
          this.showNotification("Skill added successfully");
          this.getSkills();
          this.skillPayload = { id: 0, name: "" };
        },
        (error) => {
          this.showNotification("An error occurred while adding the skill");
        }
      );
    } else {
    }
  }

  isFormValid(): boolean {
    return this.skillPayload.name.trim() !== "";
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
