import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserDTO, UserUpdateDTO, WorkExperience, WorkExperienceDTO } from '../model/user.model';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users/`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  createUser(user: User): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiUrl, user).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getUserById(id: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getUserByEmail(email: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}email/${email}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl).pipe(
      catchError(this.errorService.handleError)
    );
  }

  updateUser(id: string, userUpdate: UserUpdateDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}${id}`, userUpdate).pipe(
      catchError(this.errorService.handleError)
    );
  }

  addWorkExperience(userId: string, workExperience: WorkExperienceDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}${userId}/experience`, workExperience).pipe(
      catchError(this.errorService.handleError)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  syncUser(user: User): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}sync`, user).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getCurrentUser(): Observable<User> {
    const currentUser = this.authService.getUser();
    return of(currentUser as User);
  }

  getCurrentUserProfile(): Observable<User> {
    return this.getCurrentUser();
  }

  updateCurrentUserProfile(userUpdate: UserUpdateDTO): Observable<UserDTO> {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.id) {
      return this.updateUser(currentUser.id, userUpdate);
    }
    return throwError(() => ({ status: 400, message: 'No current user found' }));
  }
}
