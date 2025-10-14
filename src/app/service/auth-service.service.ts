import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  login(newUser: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, newUser);
  }
}
