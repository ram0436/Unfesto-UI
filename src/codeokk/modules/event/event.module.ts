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
import { EventRoutingModule } from "./event-routing.module";
import { QuizzesComponent } from "./component/quizzes/quizzes.component";
import { WorkshopsComponent } from "./component/workshops/workshops.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { EventDetailsComponent } from "./component/event-details/event-details.component";
import { QuillModule } from "ngx-quill";
import { AllEventsComponent } from "./component/all-events/all-events.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CompeteComponent } from "./component/compete/compete.component";
import { HostPageComponent } from "./component/host-page/host-page.component";
import { EditEventComponent } from "./component/edit-event/edit-event.component";
import { RegisterEventComponent } from "./component/register-event/register-event.component";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { MatNativeDateModule } from "@angular/material/core";

@NgModule({
  declarations: [
    QuizzesComponent,
    WorkshopsComponent,
    EventDetailsComponent,
    AllEventsComponent,
    CompeteComponent,
    HostPageComponent,
    EditEventComponent,
    RegisterEventComponent,
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
    EventRoutingModule,
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
    MatDatepickerModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    QuillModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventModule {}
