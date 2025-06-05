import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthHelperService } from '../../../services/auth-helper.service';
import { JobApplicationService } from '../../../services/job-application.service';
import { JobService } from '../../../services/job.service';
import { forkJoin } from 'rxjs';
import { JobApplication, ApplicationStatus } from '../../../model/job-application.model';

interface ApplicationWithJob {
  id: string;
  userId: string;
  jobId: string;
  applicantName: string;
  status: ApplicationStatus;
  appliedDate: Date;
  jobTitle: string;
  companyName: string;
}

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.css']
})
export class ManageApplicationsComponent implements OnInit {
  applications: ApplicationWithJob[] = [];
  isLoading = true;
  error: string | null = null;
  applicationStatus = ApplicationStatus;
  specificJobId: string | null = null;

  constructor(
    private authHelper: AuthHelperService,
    private jobApplicationService: JobApplicationService,
    private jobService: JobService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.specificJobId = params['id'] || null;
      this.loadRecruiterApplications();
    });
  }

  loadRecruiterApplications(): void {
    this.isLoading = true;
    const currentUser = this.authHelper.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      this.error = 'User information not available';
      this.isLoading = false;
      return;
    }

    this.jobService.getJobsByRecruiterId(currentUser.id).subscribe({
      next: (jobs) => {
        if (jobs.length === 0) {
          this.applications = [];
          this.isLoading = false;
          return;
        }

        const jobIds = jobs.map(job => job.id as string);
        const requests = jobIds.map(jobId =>
          this.jobApplicationService.getApplicationsByJobId(jobId)
        );

        forkJoin(requests).subscribe({
          next: (results) => {
            const allApplications: ApplicationWithJob[] = [];

            results.forEach((applications, index) => {
              const jobId = jobIds[index];
              const job = jobs.find(j => j.id === jobId);

              if (job) {
                // Si on a un job spécifique, filtrer uniquement ses candidatures
                if (!this.specificJobId || job.id === this.specificJobId) {
                  applications.forEach((app: JobApplication) => {
                    // Construire le nom du demandeur à partir des données disponibles
                    const applicantName = app.userFirstName && app.userLastName
                      ? `${app.userFirstName} ${app.userLastName}`
                      : app.userEmail || 'Unknown';

                    allApplications.push({
                      id: app.id as string,
                      userId: app.userId as string,
                      jobId: app.jobId as string,
                      applicantName: applicantName,
                      status: app.status,
                      appliedDate: app.applicationDate as Date,
                      jobTitle: job.title,
                      companyName: job.companyName
                    });
                  });
                }
              }
            });

            this.applications = allApplications.sort((a, b) =>
              new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
            );
            this.isLoading = false;
          },
          error: (error) => {
            this.error = 'Failed to load applications. Please try again.';
            console.error('Error loading applications:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.error = 'Failed to load jobs. Please try again.';
        console.error('Error loading recruiter jobs:', error);
        this.isLoading = false;
      }
    });
  }

  updateApplicationStatus(applicationId: string, newStatus: ApplicationStatus): void {
    this.jobApplicationService.updateApplicationStatus(applicationId, newStatus).subscribe({
      next: () => {
        // Update status locally
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
          application.status = newStatus;
        }
      },
      error: (error) => {
        console.error('Error updating application status:', error);
        alert('Failed to update application status. Please try again.');
      }
    });
  }
}
