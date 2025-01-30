import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../../../environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class SponsorService {
  private dataSubject = new Subject<any>();

  private brandsDataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  addSponsor(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Sponsor/AddSponsor`, payload);
  }

  sendProposalToSponsor(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}Sponsor/SendProposalToSponsor`,
      payload
    );
  }

  getAllSponsor() {
    return this.http.get(`${this.baseUrl}Sponsor/GetAllSponsor`);
  }
}
