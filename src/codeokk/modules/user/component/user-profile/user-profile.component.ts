import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../../../service/master.service";
import { UserService } from "../../service/user.service";
import { UserPayload } from "../../../../shared/model/user.payload";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrl: "./user-profile.component.css",
})
export class UserProfileComponent {
  userPayload: UserPayload = new UserPayload();

  dialogRef: MatDialogRef<any> | null = null;

  isSidebarVisible: boolean = false;

  userImage: any[] = [""];

  colleges: any[] = [];
  courses: any[] = [];
  purposes: any[] = [];
  userTypes: any[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllColleges();
    this.getAllCourses();
    this.getAllPurposes();
    this.getAllUserTypes();
  }

  getAllColleges() {
    this.masterService.getCollege().subscribe((data: any) => {
      this.colleges = data;
    });
  }

  getAllCourses() {
    this.masterService.getCourse().subscribe((data: any) => {
      this.courses = data;
    });
  }

  getAllPurposes() {
    this.masterService.getPurpose().subscribe((data: any) => {
      this.purposes = data;
    });
  }

  getAllUserTypes() {
    this.masterService.getUserType().subscribe((data: any) => {
      this.userTypes = data;
    });
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

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
        j < this.userImage.length && dataIndex < data.length;
        j++
      ) {
        this.userPayload.profilePicURL = data[0];
        if (this.userImage[j] === "") {
          this.userImage[j] = data[dataIndex];
          dataIndex++;
          imagesLength--;
        }
      }
    });
  }

  deleteBackgroundImage(index: any): void {
    for (let i = index; i < this.userImage.length - 1; i++) {
      this.userImage[i] = this.userImage[i + 1];
    }
    this.userImage[this.userImage.length - 1] = "";
  }

  addUser(): void {
    console.log(this.userPayload);
    this.userService.addUser(this.userPayload).subscribe((response) => {
      this.showNotification("User Added Succesfully");
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
