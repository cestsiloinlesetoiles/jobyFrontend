import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobType, ExperienceLevel } from '../../../model/job.model';

@Component({
  selector: 'app-jobs-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs-search.component.html',
  styleUrls: ['./jobs-search.component.css']
})
export class JobsSearchComponent {
  @Output() searchFilters = new EventEmitter<any>();

  // Form fields
  location: string = '';
  jobType: string = 'ALL';
  experienceLevel: string = 'ALL';
  salaryMin: number | null = null;
  salaryMax: number | null = null;

  // For dropdown options
  jobTypes = Object.keys(JobType).map(key => ({
    value: JobType[key as keyof typeof JobType],
    label: key.replace('_', ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
  }));

  experienceLevels = Object.keys(ExperienceLevel).map(key => ({
    value: ExperienceLevel[key as keyof typeof ExperienceLevel],
    label: key.replace('_', ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
  }));

  constructor() { }

  onSearch(): void {
    this.searchFilters.emit({
      location: this.location,
      jobType: this.jobType,
      experienceLevel: this.experienceLevel,
      salaryMin: this.salaryMin,
      salaryMax: this.salaryMax
    });
  }

  onReset(): void {
    this.location = '';
    this.jobType = 'ALL';
    this.experienceLevel = 'ALL';
    this.salaryMin = null;
    this.salaryMax = null;

    this.searchFilters.emit({
      location: '',
      jobType: 'ALL',
      experienceLevel: 'ALL',
      salaryMin: null,
      salaryMax: null
    });
  }
}
