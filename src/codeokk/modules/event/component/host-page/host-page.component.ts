import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-host-page",
  templateUrl: "./host-page.component.html",
  styleUrl: "./host-page.component.css",
})
export class HostPageComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
}
