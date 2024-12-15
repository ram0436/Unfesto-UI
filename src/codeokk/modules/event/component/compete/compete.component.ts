import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-compete",
  templateUrl: "./compete.component.html",
  styleUrl: "./compete.component.css",
})
export class CompeteComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
}
