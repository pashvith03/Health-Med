import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersServiceService {
  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/staff`, payload);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/staff`);
  }

  updateUser(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/staff/${id}`, payload);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/staff/${id}`);
  }
}
