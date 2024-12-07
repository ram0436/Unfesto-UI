import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkshopsComponent } from "./component/workshops/workshops.component";
import { QuizzesComponent } from "./component/quizzes/quizzes.component";

const routes: Routes = [
  { path: "workshops", component: WorkshopsComponent },
  { path: "quizzes", component: QuizzesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostRoutingModule {}
