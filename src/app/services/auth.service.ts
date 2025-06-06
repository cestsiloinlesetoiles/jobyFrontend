import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User, UserRole, LoginRequest, RegisterRequest, AuthResponse } from '../model/user.model';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userKey = 'current_user';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {
    // Initialize with stored user if available
    const storedUser = this.getUser();
    if (storedUser) {
      this.userSubject.next(storedUser);
    }
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest).pipe(
      tap(response => {
      }),
      catchError(this.errorService.handleError)
    );
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    // Clear existing data first
    this.logout();

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        if (response && response.user) {
          this.setUser(response.user);
          this.userSubject.next(response.user);
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    // Clear any other cached data that might persist
    sessionStorage.clear();
    this.userSubject.next(null); // Notify subscribers
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.userSubject.next(user); // Notify subscribers
  }

  getCurrentUserRole(): UserRole | null {
    const user = this.getUser();
    return user ? user.role || null : null;
  }
}
