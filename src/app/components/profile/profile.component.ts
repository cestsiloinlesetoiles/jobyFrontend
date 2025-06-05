import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { User, WorkExperience, UserRole } from '../../model/user.model';
import { UserService } from '../../services/user.service';
import { AuthHelperService } from '../../services/auth-helper.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { JobService } from '../../services/job.service';
import { Job, JobDTO, JobRequestDTO } from '../../model/job.model';
import { JobApplicationService } from '../../services/job-application.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: User = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: undefined,
    skills: [],
    workExperiences: []
  };

  // Data spécifique aux recruteurs
  recruiterJobs: JobDTO[] = [];
  totalApplications: number | null = null;
  activeJobsCount = 0;

  // Data spécifique aux admins
  totalUsers = 0;
  totalJobs = 0;
  totalRecruiters = 0;

  isEditing = false;
  isLoading = false;
  isLoadingStats = false;
  errorMessage = '';
  UserRole = UserRole; // Pour l'utiliser dans le template

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authHelper: AuthHelperService,
    private router: Router,
    private jobService: JobService,
    private jobApplicationService: JobApplicationService
  ) {}

  ngOnInit(): void {
    // Load profile on initial load
    this.loadUserProfile();

    // Also reload profile whenever navigating to this page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/profile') {
        // Reset user data and reload from server
        this.resetUserData();
        this.loadUserProfile();
      }
    });
  }

  resetUserData(): void {
    // Reset user object to default values
    this.user = {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: undefined,
      skills: [],
      workExperiences: []
    };
    this.recruiterJobs = [];
    this.totalApplications = null;
    this.activeJobsCount = 0;
  }

  loadUserProfile(): void {
    this.isLoading = true;

    // Refresh from the server - don't use cached data for profile page
    this.userService.getCurrentUser().subscribe({
      next: (userData) => {
        if (userData) {
          console.log('User data:', userData);
          this.user = userData;
          // Update the stored user with fresh data
          this.authHelper.updateCurrentUser(userData);
          this.initializeForm();
          
          // Charger les données spécifiques selon le rôle
          this.loadRoleSpecificData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Error loading profile data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  loadRoleSpecificData(): void {
    if (this.user.role === UserRole.RECRUITER) {
      this.loadRecruiterData();
    } else if (this.user.role === UserRole.ADMIN) {
      this.loadAdminData();
    }
  }

  loadRecruiterData(): void {
    // Charger les jobs du recruteur
    if (this.user.id) {
      this.isLoadingStats = true;
      this.jobService.getJobsByRecruiterId(this.user.id).subscribe({
        next: (jobs: JobDTO[]) => {
          this.recruiterJobs = jobs;
          
          if (jobs.length === 0) {
            // Pas de jobs, pas besoin de charger les candidatures
            this.activeJobsCount = 0;
            this.totalApplications = 0;
            this.isLoadingStats = false;
            return;
          }
          
          // Pour chaque job, récupérer le nombre de candidatures
          const applicationCountObservables = this.recruiterJobs.map((job) => {
            if (job.id) {
              // Essayer d'abord avec l'endpoint count, sinon compter les candidatures
              return this.jobApplicationService.getApplicationCountByJob(job.id).pipe(
                catchError(() => {
                  // Si l'endpoint count n'existe pas, récupérer toutes les candidatures et les compter
                  return this.jobApplicationService.getJobApplications(job.id!).pipe(
                    map(applications => applications.length),
                    catchError(() => of(0))
                  );
                })
              );
            }
            return of(0);
          });

          // Attendre que toutes les requêtes soient terminées
          forkJoin(applicationCountObservables).subscribe({
            next: (counts: number[]) => {
              // Assigner le nombre de candidatures à chaque job
              counts.forEach((count, index) => {
                this.recruiterJobs[index].applicationCount = count;
              });

              // Calculer le nombre de jobs actifs
              this.activeJobsCount = this.recruiterJobs.filter((job: JobDTO) => job.isActive !== false).length;
              
              // Calculer le nombre total de candidatures
              this.totalApplications = this.recruiterJobs.reduce((total: number, job: JobDTO) => {
                return total + (job.applicationCount || 0);
              }, 0);
              
              this.isLoadingStats = false;
            },
            error: (error) => {
              console.error('Error loading application counts:', error);
              // En cas d'erreur, utiliser des valeurs par défaut
              this.activeJobsCount = this.recruiterJobs.filter((job: JobDTO) => job.isActive !== false).length;
              this.totalApplications = 0;
              this.isLoadingStats = false;
            }
          });
        },
        error: (error: any) => {
          console.error('Error loading recruiter jobs:', error);
          this.isLoadingStats = false;
        }
      });
    }
  }

  loadAdminData(): void {
    this.totalUsers = 150;
    this.totalJobs = 45;
    this.totalRecruiters = 12;
  }

  initializeForm(): void {
    if (this.user.role === UserRole.USER) {

      this.profileForm = this.fb.group({
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        phoneNumber: [this.user.phoneNumber],
        skills: this.fb.array(this.user.skills?.map(skill => this.fb.control(skill)) || []),
        workExperiences: this.fb.array(
          this.user.workExperiences?.map(exp => this.fb.group({
            id: [exp.id],
            jobTitle: [exp.jobTitle, Validators.required],
            companyName: [exp.companyName, Validators.required],
            description: [exp.description],
            startDate: [exp.startDate, Validators.required],
            endDate: [exp.endDate]
          })) || []
        )
      });
    } else {
      this.profileForm = this.fb.group({
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        phoneNumber: [this.user.phoneNumber]
      });
    }
  }

  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  get workExperiences(): FormArray {
    return this.profileForm.get('workExperiences') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  addWorkExperience(): void {
    this.workExperiences.push(this.fb.group({
      id: [''],
      jobTitle: ['', Validators.required],
      companyName: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['']
    }));
  }

  removeWorkExperience(index: number): void {
    this.workExperiences.removeAt(index);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.initializeForm();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user.id) {
      this.isLoading = true;
      const updatedUser = {
        ...this.user,
        ...this.profileForm.value
      };

      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.user = response;
          // Update stored user
          this.authHelper.updateCurrentUser(response);
          this.isEditing = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = 'Error updating profile. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  toggleJobStatus(job: JobDTO): void {
    // Inverser le statut
    const newStatus = !job.isActive;
    const originalStatus = job.isActive;
    
    // Mettre à jour temporairement l'UI pour une meilleure UX
    job.isActive = newStatus;
    
    // Mettre à jour le compteur immédiatement
    if (newStatus) {
      this.activeJobsCount++;
    } else {
      this.activeJobsCount--;
    }

    // Appeler le service pour mettre à jour le job
    if (job.id) {
      this.jobService.updateJobStatus(job.id, newStatus).subscribe({
        next: (updatedJob) => {
          // Mise à jour confirmée
          const index = this.recruiterJobs.findIndex(j => j.id === job.id);
          if (index !== -1) {
            this.recruiterJobs[index] = updatedJob;
            // Recalculer le nombre de jobs actifs pour être sûr
            this.activeJobsCount = this.recruiterJobs.filter((j: JobDTO) => j.isActive === true).length;
          }
          console.log(`Job "${job.title}" is now ${newStatus ? 'active' : 'inactive'}`);
        },
        error: (error) => {
          console.error('Error updating job status:', error);
          this.errorMessage = 'Error updating job status. Please try again.';
          
          // Reverser le changement en cas d'erreur
          job.isActive = originalStatus;
          
          // Reverser le compteur
          if (originalStatus) {
            this.activeJobsCount++;
          } else {
            this.activeJobsCount--;
          }
          
          const index = this.recruiterJobs.findIndex(j => j.id === job.id);
          if (index !== -1) {
            this.recruiterJobs[index].isActive = originalStatus;
          }
        }
      });
    }
  }
}
