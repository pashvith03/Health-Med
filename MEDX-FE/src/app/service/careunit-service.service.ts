import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CareunitServiceService {
  baseUrl: string = `${environment.apiUrl}/care-units`;
  constructor(private http: HttpClient) {}
  newCareUnit(careUnit: any): Observable<any> {
    return this.http.post(this.baseUrl, careUnit);
  }
  getAllCareUnits(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  editUsers(id: any, careUnit: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, careUnit);
  }
  deleteCareUnit(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Patients
  getAllPatients(): Observable<any> {
    const url = `${environment.apiUrl}/patients`;
    return this.http.get(url);
  }
}
