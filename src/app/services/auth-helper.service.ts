import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../model/user.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Reset the subject to ensure it's clear on service initialization
    this.currentUserSubject.next(null);

    // Then try to load from storage if available
    const user = this.authService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string, returnUrl: string = '/dashboard'): Observable<User> {
    // Clear current user state before attempting login
    this.currentUserSubject.next(null);

    // Force a complete reset of state
    this.logout();

    const loginRequest: LoginRequest = { email, password };
    return this.authService.login(loginRequest).pipe(
      map(response => response.user),
      tap(user => {
        // Set fresh user data
        this.currentUserSubject.next(user);
        this.router.navigate([returnUrl]);
      })
    );
  }

  register(user: User, returnUrl: string = '/login'): Observable<User> {
    const registerRequest: RegisterRequest = {
      email: user.email,
      password: user.password!,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role!
    };
    
    return this.authService.register(registerRequest).pipe(
      map(response => response.user),
      tap(createdUser => {
        // Don't store user in subject on registration
        this.router.navigate([returnUrl]);
      })
    );
  }

  logout(): void {
    // Clear the subject first
    this.currentUserSubject.next(null);
    // Then clear storage
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): User | null {
    // Get the user directly from AuthService instead of from the BehaviorSubject
    // This ensures we always use the latest user data from localStorage
    return this.authService.getUser();
  }

  updateCurrentUser(user: User): void {
    // Update both the behavior subject and storage
    this.currentUserSubject.next(user);
    this.authService.setUser(user);
  }
}
