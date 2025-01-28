import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../../../environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class EventService {
  private dataSubject = new Subject<any>();

  private brandsDataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  getCategory() {
    return this.http.get(`${this.baseUrl}Event/GetCategory`);
  }

  getEventMode() {
    return this.http.get(`${this.baseUrl}Event/GetEventMode`);
  }

  getEventType() {
    return this.http.get(`${this.baseUrl}Event/GetEventType`);
  }

  getEventSubTypeByEventType(eventId: number) {
    return this.http.get(
      `${this.baseUrl}Event/GetEventSubTypeByEventTypeId?eventTypeId=${eventId}`
    );
  }

  getOrganisation() {
    return this.http.get(`${this.baseUrl}Event/GetOrganisation`);
  }

  getParticipationType() {
    return this.http.get(`${this.baseUrl}Event/GetParticipationType`);
  }

  getSkill() {
    return this.http.get(`${this.baseUrl}Event/GetSkill`);
  }

  getVisibility() {
    return this.http.get(`${this.baseUrl}Event/GetVisibility`);
  }

  getAllEvent() {
    return this.http.get(`${this.baseUrl}Event/GetAllEvent`);
  }

  addEvent(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Event/AddEvent`, payload);
  }

  updateEvent(eventId: any, payLoad: any) {
    return this.http.put(`${this.baseUrl}Event/` + eventId, payLoad);
  }

  deleteEvent(eventId: any) {
    return this.http.delete(`${this.baseUrl}Event/` + eventId);
  }

  addEventUserRegisteration(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}Event/AddEventUserRegistration`,
      payload
    );
  }

  getMyEventRegisteration(userId: number) {
    return this.http.get(
      `${this.baseUrl}Event/GetMyEventRegistration?userId=${userId}`
    );
  }

  getEventByUserId(userId: number) {
    return this.http.get(
      `${this.baseUrl}Event/GetEventByUserId?userId=${userId}`
    );
  }

  getEventByCollaboratorId(collaboratorId: any) {
    return this.http.get(
      `${this.baseUrl}Event/GetEventByCollaboratorId?userId=${collaboratorId}`
    );
  }

  getEventDetail(tabRefGuid: String) {
    return this.http.get(
      `${this.baseUrl}Event/GetEventDetailByTabRefGuiD?TabRefGuid=${tabRefGuid}`
    );
  }

  getEventDetailById(eventId: String) {
    return this.http.get(
      `${this.baseUrl}Event/GetEventDetailById?eventId=${eventId}`
    );
  }
}
