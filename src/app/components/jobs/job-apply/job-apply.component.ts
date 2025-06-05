import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Job } from '../../../model/job.model';
import { JobService } from '../../../services/job.service';
import { JobApplicationService } from '../../../services/job-application.service';
import { AuthHelperService } from '../../../services/auth-helper.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-job-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './job-apply.component.html',
  styleUrls: ['./job-apply.component.css']
})
export class JobApplyComponent implements OnInit {
  job: Job | undefined;
  coverLetter: string = '';
  isSubmitting = false;
  errorMessage = '';
  userId: string | null = null;
  returnUrl: string;
  alreadyApplied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private jobApplicationService: JobApplicationService,
    private authHelper: AuthHelperService,
    private authService: AuthService
  ) {
    // Get the return URL from route parameters or default to '/applications'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/applications';
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      // Save the current URL as return URL and redirect to login
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Get current user ID
    const currentUser = this.authHelper.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
    } else {
      // User not logged in, redirect to login
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      // Check if user has already applied for this job
      if (this.userId) {
        this.jobApplicationService.hasUserAppliedToJob(this.userId, jobId).subscribe({
          next: (hasApplied) => {
            if (hasApplied) {
              this.alreadyApplied = true;
              this.errorMessage = 'Vous avez déjà postulé à cette offre d\'emploi.';
              // Optional: Redirect to applications page after a delay
              setTimeout(() => {
                this.router.navigate(['/applications']);
              }, 3000);
            }
          },
          error: (error) => {
            console.error('Error checking application status:', error);
          }
        });
      }

      this.jobService.getJobById(jobId).subscribe({
        next: (job) => {
          this.job = job;
        },
        error: (error) => {
          console.error('Error fetching job:', error);
          this.router.navigate(['/jobs']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.alreadyApplied) {
      alert('Vous avez déjà postulé à cette offre d\'emploi.');
      this.router.navigate(['/applications']);
      return;
    }

    if (!this.coverLetter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    if (!this.job || !this.userId) {
      alert('Error: Missing job information or user not authenticated');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Ensure job.id is not undefined
    if (!this.job.id) {
      this.errorMessage = 'Invalid job data';
      this.isSubmitting = false;
      return;
    }

    this.jobApplicationService.createApplication(this.job.id, this.userId, this.coverLetter)
      .subscribe({
        next: (response) => {
          console.log('Application submitted successfully:', response);
          this.isSubmitting = false;
          alert('Your application has been submitted successfully!');
          // Redirect to applications page instead of jobs page
          this.router.navigate(['/applications']);
        },
        error: (error) => {
          console.error('Error submitting application:', error);
          this.isSubmitting = false;
          this.errorMessage = error.message || 'An error occurred while submitting your application.';
        }
      });
  }
}
