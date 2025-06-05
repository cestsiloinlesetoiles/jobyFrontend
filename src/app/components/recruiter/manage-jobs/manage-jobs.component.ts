import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../model/job.model';
import { AuthHelperService } from '../../../services/auth-helper.service';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.css']
})
export class ManageJobsComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private jobService: JobService,
    private authHelper: AuthHelperService
  ) {}

  ngOnInit(): void {
    this.loadRecruiterJobs();
  }

  loadRecruiterJobs(): void {
    this.isLoading = true;
    const currentUser = this.authHelper.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      this.error = 'User information not available';
      this.isLoading = false;
      return;
    }

    this.jobService.getJobsByRecruiterId(currentUser.id).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load jobs. Please try again.';
        console.error('Error loading recruiter jobs:', error);
        this.isLoading = false;
      }
    });
  }

  deleteJob(jobId: string): void {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.id !== jobId);
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          alert('Failed to delete job. Please try again.');
        }
      });
    }
  }
}
