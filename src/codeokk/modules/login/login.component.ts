import { Component, HostListener, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MasterService } from "../service/master.service";
import { UserService } from "../user/service/user.service";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog,
    private masterService: MasterService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

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
        console.log(data);
        localStorage.setItem("role", data.role);
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("user_Id", data.user_Id);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("mobileNo", data.mobileNo);
        localStorage.setItem("email", data.email);
        // this.userService.setData("login");
        this.router.navigate(["dashboard"]);
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
