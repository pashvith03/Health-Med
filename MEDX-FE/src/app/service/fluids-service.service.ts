import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FluidsServiceService {
  baseUrl: any = `${environment.apiUrl}/care-units`;
  constructor(private http: HttpClient) {}
  newfluid(careUnitId: any, fluid: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${careUnitId}/fluids`, fluid);
  }
  getFluid(careUnitId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${careUnitId}/fluids`);
  }
  editFluid(careUnitId: any, fluid: any, fluidId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${careUnitId}/fluids/${fluidId}`,
      fluid
    );
  }
  deleteFluid(careUnitId: any, fluidId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${careUnitId}/fluids/${fluidId}`);
  }
}
