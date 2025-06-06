import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Job, JobDTO, JobRequestDTO, JobType, ExperienceLevel } from '../model/job.model';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/api/jobs`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  createJob(jobRequest: JobRequestDTO): Observable<JobDTO> {
    return this.http.post<JobDTO>(this.apiUrl, jobRequest).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getJobById(id: string): Observable<JobDTO> {
    return this.http.get<JobDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getAllJobs(): Observable<JobDTO[]> {
    return this.http.get<JobDTO[]>(this.apiUrl).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getJobsByRecruiterId(recruiterId: string): Observable<JobDTO[]> {
    return this.http.get<JobDTO[]>(`${this.apiUrl}/recruiter/${recruiterId}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  searchJobs(
    location?: string,
    jobType?: JobType,
    experienceLevel?: ExperienceLevel,
    minSalary?: number | null,
    maxSalary?: number | null
  ): Observable<JobDTO[]> {
    let params = new HttpParams();

    if (location) params = params.set('location', location);
    if (jobType) params = params.set('jobType', jobType);
    if (experienceLevel) params = params.set('experienceLevel', experienceLevel);
    if (minSalary !== null && minSalary !== undefined) params = params.set('minSalary', minSalary.toString());
    if (maxSalary !== null && maxSalary !== undefined) params = params.set('maxSalary', maxSalary.toString());

    return this.http.get<JobDTO[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getJobsByLocation(location: string): Observable<JobDTO[]> {
    return this.http.get<JobDTO[]>(`${this.apiUrl}/location/${location}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getJobsByType(jobType: JobType): Observable<JobDTO[]> {
    return this.http.get<JobDTO[]>(`${this.apiUrl}/type/${jobType}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getJobsByExperienceLevel(experienceLevel: ExperienceLevel): Observable<JobDTO[]> {
    return this.http.get<JobDTO[]>(`${this.apiUrl}/experience/${experienceLevel}`).pipe(
      catchError(this.errorService.handleError)
    );
  }

  getJobsBySalaryRange(minSalary: number, maxSalary: number): Observable<JobDTO[]> {
    const params = new HttpParams()
      .set('minSalary', minSalary.toString())
      .set('maxSalary', maxSalary.toString());

    return this.http.get<JobDTO[]>(`${this.apiUrl}/salary`, { params }).pipe(
      catchError(this.errorService.handleError)
    );
  }

  updateJob(id: string, jobRequest: JobRequestDTO): Observable<JobDTO> {
    return this.http.put<JobDTO>(`${this.apiUrl}/${id}`, jobRequest).pipe(
      catchError(this.errorService.handleError)
    );
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }
}
