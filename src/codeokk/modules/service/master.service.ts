import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../../environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  private dataSubject = new Subject<any>();

  private brandsDataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  getCollege() {
    return this.http.get(`${this.baseUrl}Master/GetCollege`);
  }

  getCourse() {
    return this.http.get(`${this.baseUrl}Master/GetCourse`);
  }

  getPurpose() {
    return this.http.get(`${this.baseUrl}Master/GetPurpose`);
  }

  getUserType() {
    return this.http.get(`${this.baseUrl}Master/GetUserType`);
  }

  addCategory(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Master/AddCategory`, payload);
  }

  addOrganization(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Master/AddOrganisation`, payload);
  }

  addSkill(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Master/AddSkill`, payload);
  }

  getDashboard() {
    return this.http.get(`${this.baseUrl}Dashboard/GetDashboard`);
  }

  // getSectionByClassId(classId: number) {
  //   return this.http.get(
  //     `${this.baseUrl}Master/GetSectionByClassId?classId=${classId}`
  //   );
  // }
}
