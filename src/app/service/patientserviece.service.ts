import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientservieceService {
  baseUrl: any = `${environment.apiUrl}/patients`;
  // baseUrl = environment.apiUrl + '/patients';

  constructor(private http: HttpClient) {}

  createPatient(patient: any) {
    return this.http.post(`${this.baseUrl}/admit`, patient);
  }

  getPatients(careUnitId: string) {
    return this.http.get(`${this.baseUrl}/care-unit/${careUnitId}`);
  }

  editPatient(patientId: string, patient: any) {
    return this.http.put(`${this.baseUrl}/${patientId}`, patient);
  }

  deletePatient(patientId: string) {
    return this.http.delete(`${this.baseUrl}/${patientId}`);
  }
}
