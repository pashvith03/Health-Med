import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BedsServiceService {
  baseUrl = `${environment.apiUrl}/care-units`;
  constructor(private http: HttpClient) {}
  newBed(careUnitId: any, bed: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${careUnitId}/beds`, bed);
  }
  getAllBeds(careUnitId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${careUnitId}/beds`);
  }
  editBed(careUnitId: any, bed: any, bedId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${careUnitId}/beds/${bedId}`, bed);
  }
  deleteBed(careUnitId: any, bedId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${careUnitId}/beds/${bedId}`);
  }
}
