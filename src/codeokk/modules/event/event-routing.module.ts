import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkshopsComponent } from "./component/workshops/workshops.component";
import { QuizzesComponent } from "./component/quizzes/quizzes.component";
import { EventDetailsComponent } from "./component/event-details/event-details.component";
import { AllEventsComponent } from "./component/all-events/all-events.component";
import { CompeteComponent } from "./component/compete/compete.component";
import { HostPageComponent } from "./component/host-page/host-page.component";
import { EditEventComponent } from "./component/edit-event/edit-event.component";
import { RegisterEventComponent } from "./component/register-event/register-event.component";

const routes: Routes = [
  { path: "add-workshops", component: WorkshopsComponent },
  { path: "quizzes", component: QuizzesComponent },
  { path: "details/:id", component: EventDetailsComponent },
  { path: "all-events", component: AllEventsComponent },
  { path: "compete", component: CompeteComponent },
  { path: "host", component: HostPageComponent },
  { path: "edit/:id", component: EditEventComponent },
  { path: "register-event/:id", component: RegisterEventComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
