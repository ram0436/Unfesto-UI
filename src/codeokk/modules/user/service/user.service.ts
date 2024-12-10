import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../../../environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private dataSubject = new Subject<any>();

  private brandsDataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  setData(data: any) {
    this.dataSubject.next(data);
  }
  getData() {
    return this.dataSubject.asObservable();
  }

  uploadImages(formData: any) {
    return this.http.post(`${this.baseUrl}User/UploadImages`, formData);
  }

  addUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}User/AddUser`, payload);
  }

  getAllUserId() {
    return this.http.get(`${this.baseUrl}User/GetAllUserId`);
  }

  // New method for login
  login(userId: string, password: string): Observable<any> {
    const url = `${this.baseUrl}Auth/Login`;
    const params = { userId, password }; // Query parameters

    return this.http.post(url, {}, { params });
  }
}
