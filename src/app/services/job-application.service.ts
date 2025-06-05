import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JobApplication, JobApplicationDTO, JobApplicationRequestDTO, ApplicationStatus } from '../model/job-application.model';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = `${environment.apiUrl}/api/job-applications`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  applyToJob(applicationRequest: JobApplicationRequestDTO): Observable<JobApplicationDTO> {
    return this.http.post<JobApplicationDTO>(this.apiUrl, applicationRequest).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getUserApplications(userId: string): Observable<JobApplicationDTO[]> {
    return this.http.get<JobApplicationDTO[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getJobApplications(jobId: string): Observable<JobApplicationDTO[]> {
    return this.http.get<JobApplicationDTO[]>(`${this.apiUrl}/job/${jobId}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getApplicationById(id: string): Observable<JobApplicationDTO> {
    return this.http.get<JobApplicationDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getAllApplications(): Observable<JobApplicationDTO[]> {
    return this.http.get<JobApplicationDTO[]>(this.apiUrl).pipe(
      catchError(this.errorService.handleError)
    );
  }

  updateApplicationStatus(id: string, status: ApplicationStatus): Observable<JobApplicationDTO> {
    return this.http.patch<JobApplicationDTO>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(this.errorService.handleError)
    );
  }

  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getApplicationsForUser(userId: string): Observable<JobApplication[]> {
    return this.getUserApplications(userId) as Observable<JobApplication[]>;
  }

  getApplicationsForJob(jobId: string): Observable<JobApplication[]> {
    return this.getJobApplications(jobId) as Observable<JobApplication[]>;
  }

  // Alias methods for compatibility with components
  getApplicationsByUserId(userId: string): Observable<JobApplication[]> {
    return this.getUserApplications(userId).pipe(
      catchError(this.errorService.handleError)
    ) as Observable<JobApplication[]>;
  }

  getApplicationsByJobId(jobId: string): Observable<JobApplication[]> {
    return this.getJobApplications(jobId).pipe(
      catchError(this.errorService.handleError)
    ) as Observable<JobApplication[]>;
  }

  createApplication(jobId: string, userId: string, coverLetter: string): Observable<JobApplicationDTO> {
    const applicationRequest: JobApplicationRequestDTO = {
      jobId: jobId,
      coverLetter: coverLetter
    };
    return this.applyToJob(applicationRequest);
  }

  hasUserAppliedToJob(userId: string, jobId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${userId}/${jobId}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getApplicationCountByJob(jobId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/job/${jobId}/count`).pipe(
      catchError(this.errorService.handleError)
    );
  }
}
