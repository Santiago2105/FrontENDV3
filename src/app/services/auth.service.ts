// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../model/auth-response.model';
import { UserLogin } from '../model/user-login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // http://localhost:8080/upc

  constructor(private http: HttpClient) {}

  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.jwtToken);
          localStorage.setItem('userId', res.id.toString());
          localStorage.setItem('authorities', res.authorities);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('authorities');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthorities(): string[] {
    const raw = localStorage.getItem('authorities') || '';

    // Opcional, para ver qué llega realmente:
    console.log('authorities crudo:', raw);

    return raw
      .replace('[', '')
      .replace(']', '')
      .split(/[;,]/)          // separa por ; o por ,
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
  }

}
