import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobApplication, ApplicationStatus } from '../../model/job-application.model';
import { JobApplicationService } from '../../services/job-application.service';
import { AuthHelperService } from '../../services/auth-helper.service';
import { JobService } from '../../services/job.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  isLoading = false;
  errorMessage = '';
  applicationStatus = ApplicationStatus;

  constructor(
    private jobApplicationService: JobApplicationService,
    private jobService: JobService,
    private authHelper: AuthHelperService
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const currentUser = this.authHelper.getCurrentUser();

    if (currentUser && currentUser.id) {
      this.jobApplicationService.getApplicationsByUserId(currentUser.id)
        .pipe(
          mergeMap(applications => {
            if (applications.length === 0) {
              return of([]);
            }

            // Get job details for each application
            const jobRequests = applications.map(application =>
              this.jobService.getJobById(application.jobId || '')
                .pipe(
                  catchError(error => {
                    console.error(`Error fetching job details for ${application.jobId}:`, error);
                    return of(undefined);
                  })
                )
            );

            return forkJoin(jobRequests).pipe(
              mergeMap(jobs => {
                // Associate each job with its application
                applications.forEach((application, index) => {
                  application.job = jobs[index];

                  // Ensure date objects are properly formatted
                  if (application.applicationDate && !(application.applicationDate instanceof Date)) {
                    application.applicationDate = new Date(application.applicationDate);
                  }
                  if (application.createdAt && !(application.createdAt instanceof Date)) {
                    application.createdAt = new Date(application.createdAt);
                  }
                  if (application.updatedAt && !(application.updatedAt instanceof Date)) {
                    application.updatedAt = new Date(application.updatedAt);
                  }
                });
                return of(applications);
              })
            );
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (applications) => {
            this.applications = applications;
          },
          error: (error) => {
            console.error('Error fetching applications:', error);
            this.errorMessage = 'Unable to load your applications. Please try again later.';
          }
        });
    } else {
      this.errorMessage = 'You must be logged in to view your applications.';
      this.isLoading = false;
    }
  }

  getShortenedCoverLetter(coverLetter: string): string {
    if (!coverLetter) return '';

    const maxLength = 150;
    if (coverLetter.length <= maxLength) {
      return coverLetter;
    }

    return coverLetter.substring(0, maxLength) + '...';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case ApplicationStatus.PENDING:
      case ApplicationStatus.REVIEWING:
      case ApplicationStatus.APPLIED:
        return 'pending';
      case ApplicationStatus.ACCEPTED:
        return 'approved';
      case ApplicationStatus.REJECTED:
        return 'rejected';
      default:
        return 'pending';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'En attente';
      case ApplicationStatus.REVIEWING:
        return 'En cours d\'examen';
      case ApplicationStatus.ACCEPTED:
        return 'Acceptée';
      case ApplicationStatus.REJECTED:
        return 'Refusée';
      case ApplicationStatus.APPLIED:
        return 'Postulée';
      default:
        return status;
    }
  }
}
