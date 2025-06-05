import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../model/job.model';
import { JobsSearchComponent } from '../jobs-search/jobs-search.component';
import { JobsListComponent } from '../jobs-list/jobs-list.component';
import { JobService } from '../../../services/job.service';

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [CommonModule, JobsSearchComponent, JobsListComponent],
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = [...this.jobs];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.errorMessage = 'Error loading jobs. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onSearchFilters(filters: any): void {
    if (Object.keys(filters).length === 0) {
      this.filteredJobs = [...this.jobs];
      return;
    }

    this.isLoading = true;
    this.jobService.searchJobs(
      filters.location,
      filters.jobType !== 'ALL' ? filters.jobType : undefined,
      filters.experienceLevel !== 'ALL' ? filters.experienceLevel : undefined,
      filters.salaryMin,
      filters.salaryMax
    ).subscribe({
      next: (jobs) => {
        this.filteredJobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching jobs:', error);
        this.errorMessage = 'Error searching jobs. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
