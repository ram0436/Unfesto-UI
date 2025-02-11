import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../service/master.service";
import { UserService } from "../user/service/user.service";
import { DOCUMENT } from "@angular/common";
import { SignupComponent } from "../signup/signup.component";
import { UserPayload } from "../../shared/model/user.payload";
import { FormControl } from "@angular/forms";
import { map, Observable, startWith } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  userPayload: UserPayload = new UserPayload();
  username: string = "";
  password: string = "";

  dialogRef: MatDialogRef<any> | null = null;

  isSidebarVisible: boolean = false;

  userImage: any[] = [""];

  colleges: any[] = [];
  courses: any[] = [];
  purposes: any[] = [];
  userTypes: any[] = [];

  courseId: any;
  courseControl = new FormControl({});
  filteredCourses!: Observable<{ id: number; name: string }[]>;

  collegeControl = new FormControl();
  filteredColleges!: Observable<{ id: number; name: string }[]>;

  confirmPassword: string = "";

  isLogin: boolean = true;

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

  handleCourse(course: any) {
    this.userPayload.courseId = course.id;
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

  getAllColleges() {
    this.masterService.getCollege().subscribe((data: any) => {
      this.colleges = data;
      this.filteredColleges = this.collegeControl.valueChanges.pipe(
        startWith(""),
        map((value) => this.filterColleges(value || ""))
      );
    });
  }

  filterColleges(value: any): { id: number; name: string }[] {
    const filterValue =
      typeof value === "string"
        ? value.toLowerCase()
        : value?.name?.toLowerCase();
    return this.colleges.filter((college) =>
      college.name.toLowerCase().includes(filterValue)
    );
  }

  handleCollege(selectedCollege: any): void {
    this.userPayload.collegeId = selectedCollege.id;
    this.collegeControl.setValue(selectedCollege);
  }

  displayCollege(college: any): string {
    return college ? college.name : "";
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

  openLoginModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(LoginComponent, {
      width: "500px",
    });

    this.dialogRef.afterClosed().subscribe((result) => {});
  }

  addUser(): void {
    if (this.isFormValid()) {
      if (this.userPayload.password !== this.confirmPassword) {
        this.showNotification("Passwords do not match");
        return;
      }
      this.userService.addUser(this.userPayload).subscribe(
        (response) => {
          this.showNotification("User Added Successfully");
        },
        (error) => {
          this.showNotification("An error occurred while adding the user");
        }
      );
    } else {
      this.showNotification("Please fill all required fields");
    }
  }

  get passwordMismatch(): boolean {
    return (
      this.userPayload.password !== this.confirmPassword &&
      this.confirmPassword !== ""
    );
  }

  isFormValid(): boolean {
    // Validate all mandatory fields
    const requiredFields = [
      this.userPayload.firstName,
      this.userPayload.lastName,
      this.userPayload.userId,
      this.userPayload.password,
      this.userPayload.email,
      this.userPayload.userTypeId,
    ];

    // Return false if any field is empty or null
    return requiredFields.every(
      (field) =>
        field !== null &&
        field !== undefined &&
        (typeof field === "string" ? field.trim() !== "" : true)
    );
  }

  openSignupModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(SignupComponent, {
      width: "500px",
    });

    this.dialogRef.afterClosed().subscribe((result) => {});
  }

  login(): void {
    const trimmedUsername =
      typeof this.username === "string" ? this.username.trim() : "";
    const trimmedPassword =
      typeof this.password === "string" ? this.password.trim() : "";

    if (!trimmedUsername || !trimmedPassword) {
      this.showNotification("Username and Password are required.");
      return;
    }
    this.userService
      .login(this.username, this.password)
      .subscribe((data: any) => {
        localStorage.setItem("role", data.role);
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("user_Id", data.user_Id);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("mobileNo", data.mobileNo);
        localStorage.setItem("email", data.email);
        localStorage.setItem("isCollaborator", data.isCollaborator);
        localStorage.setItem("userId", data.userId);
        // this.userService.setData("login");
        this.router.navigate([""]);
        window.location.reload();
        this.showNotification("Logged in successfully");
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
