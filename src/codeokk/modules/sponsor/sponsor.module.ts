import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatOptionModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "../../shared/shared.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
  MatRadioModule,
} from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { AllSponsorsComponent } from "./component/all-sponsors/all-sponsors.component";
import { SendProposalComponent } from "./component/send-proposal/send-proposal.component";
import { SponsorRoutingModule } from "./sponsor-routing.module";
import { MatDatepickerModule } from "@angular/material/datepicker";

@NgModule({
  declarations: [AllSponsorsComponent, SendProposalComponent],
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SponsorRoutingModule,
    MatOptionModule,
    MatChipsModule,
    CommonModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRadioButton,
    MatRadioGroup,
    MatTableModule,
    MatDatepickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SponsorModule {}
