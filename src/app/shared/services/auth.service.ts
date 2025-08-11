// src/app/shared/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this.tokenKey)
  );
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<{ access_token: string }>(`${environment.API_URL}api/auth/auth/login`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem(this.tokenKey, res.access_token);
          this.tokenSubject.next(res.access_token);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}