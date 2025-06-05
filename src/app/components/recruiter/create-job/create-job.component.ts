import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job, JobType } from '../../../model/job.model';
import { AuthHelperService } from '../../../services/auth-helper.service';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {
  jobForm!: FormGroup;
  jobTypes = Object.values(JobType);
  isSubmitting = false;
  isEditMode = false;
  jobId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authHelper: AuthHelperService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      this.jobId = params['id'] || null;
      if (this.jobId) {
        this.isEditMode = true;
        this.loadJob();
      }
    });
  }

  initForm(): void {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      jobType: [JobType.FULL_TIME, Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      responsibilities: ['', [Validators.required, Validators.minLength(20)]],
      qualifications: ['', [Validators.required, Validators.minLength(20)]],
      salaryMin: [30000, [Validators.required, Validators.min(0)]],
      salaryMax: [60000, [Validators.required, Validators.min(0)]]
    });
  }

  formatJobType(type: string): string {
    return type.replace('_', ' ');
  }

  loadJob(): void {
    if (!this.jobId) return;

    this.isLoading = true;
    this.jobService.getJobById(this.jobId).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          title: job.title,
          companyName: job.companyName,
          location: job.location,
          jobType: job.jobType,
          description: job.description,
          responsibilities: job.responsibilities,
          qualifications: job.qualifications,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        alert('Failed to load job details. Please try again.');
        this.router.navigate(['/manage-jobs']);
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      Object.keys(this.jobForm.controls).forEach(key => {
        const control = this.jobForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;
    const jobData = this.jobForm.value as Job;

    if (this.isEditMode && this.jobId) {
      // Mode édition
      jobData.id = this.jobId;
      this.jobService.updateJob(this.jobId, jobData).subscribe({
        next: (updatedJob) => {
          this.isSubmitting = false;
          this.router.navigate(['/manage-jobs']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating job:', error);
          alert('Failed to update job. Please try again later.');
        }
      });
    } else {
      // Mode création
      jobData.postedDate = new Date();

      // Récupérer l'ID de l'utilisateur courant (recruteur)
      const currentUser = this.authHelper.getCurrentUser();
      if (currentUser && currentUser.id) {
        jobData.recruiterId = currentUser.id;
      }

      this.jobService.createJob(jobData).subscribe({
        next: (createdJob) => {
          this.isSubmitting = false;
          this.router.navigate(['/manage-jobs']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating job:', error);
          alert('Failed to create job. Please try again later.');
        }
      });
    }
  }

  fillDemo(): void {
    this.jobForm.patchValue({
      title: 'Senior Frontend Developer',
      companyName: 'TechCorp Solutions',
      location: 'Paris, France',
      jobType: JobType.FULL_TIME,
      description: 'Nous recherchons un développeur frontend senior passionné pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies web. Cette position offre une excellente opportunité de croissance professionnelle dans un environnement collaboratif et stimulant.',
      responsibilities: 'Développer et maintenir des applications web modernes\nCollaborer avec les équipes UX/UI pour implémenter des interfaces utilisateur intuitives\nOptimiser les performances des applications\nParticiper aux code reviews et mentorer les développeurs juniors\nContribuer à l\'architecture technique des projets',
      qualifications: 'Diplôme en informatique ou expérience équivalente\n5+ années d\'expérience en développement frontend\nMaîtrise de React, Angular ou Vue.js\nConnaissance approfondie de JavaScript/TypeScript\nExpérience avec les outils de build modernes (Webpack, Vite)\nBonnes compétences en communication et travail d\'équipe',
      salaryMin: 55000,
      salaryMax: 75000
    });
  }
}
