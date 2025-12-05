// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DTOUser } from '../model/dto-user.model';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl + '/users'; // -> http://localhost:8080/upc/users

  constructor(private http: HttpClient) {}

  registrar(user: DTOUser): Observable<any> {
    // -> POST http://localhost:8080/upc/users/signup
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }
}
