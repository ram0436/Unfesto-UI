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
import { AccountComponent } from "./component/account/account.component";
import { UserRoutingModule } from "./user-routing.module";
import { MatOptionModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "../../shared/shared.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { UserProfileComponent } from "./component/user-profile/user-profile.component";
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
  MatRadioModule,
} from "@angular/material/radio";
import { DashboardComponent } from "./component/dashboard/dashboard.component";
import { ManageListingsComponent } from "./component/manage-listings/manage-listings.component";
import { AddCategoryComponent } from "./component/add-category/add-category.component";
import { AddSkillComponent } from "./component/add-skill/add-skill.component";
import { AddOrganizationComponent } from "./component/add-organization/add-organization.component";
import { AdminDashboardComponent } from "./component/admin-dashboard/admin-dashboard.component";
import { MatTableModule } from "@angular/material/table";
import { MyRegisterationsComponent } from "./component/my-registerations/my-registerations.component";
import { AddSponsorComponent } from "./component/add-sponsor/add-sponsor.component";
import { AddPerformanceComponent } from "./component/add-performance/add-performance.component";
import { ViewPerformanceComponent } from "./component/view-performance/view-performance.component";
import { PoolDetailsComponent } from "./component/pool-details/pool-details.component";
import { CreatePoolComponent } from "./component/create-pool/create-pool.component";

@NgModule({
  declarations: [
    AccountComponent,
    UserProfileComponent,
    DashboardComponent,
    ManageListingsComponent,
    AddCategoryComponent,
    AddSkillComponent,
    AddOrganizationComponent,
    AdminDashboardComponent,
    MyRegisterationsComponent,
    AddSponsorComponent,
    AddPerformanceComponent,
    ViewPerformanceComponent,
    PoolDetailsComponent,
    CreatePoolComponent,
  ],
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
    UserRoutingModule,
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
