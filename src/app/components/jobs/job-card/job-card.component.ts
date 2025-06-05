import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Job } from '../../../model/job.model';
import { AuthHelperService } from '../../../services/auth-helper.service';
import { JobApplicationService } from '../../../services/job-application.service';
import { UserRole } from '../../../model/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job!: Job;
  isExpanded = false;

  constructor(
    private router: Router,
    private authHelper: AuthHelperService,
    private jobApplicationService: JobApplicationService,
    private authService: AuthService
  ) { }

  toggleDetails(): void {
    this.isExpanded = !this.isExpanded;
  }

  isRecruiter(): boolean {
    const userRole = this.authService.getCurrentUserRole();
    return userRole === UserRole.RECRUITER;
  }

  applyForJob(): void {
    if (!this.job.id) {
      console.error('Job ID is undefined');
      return;
    }

    if (this.authHelper.isLoggedIn()) {
      const currentUser = this.authHelper.getCurrentUser();
      if (currentUser && currentUser.id) {
        // Check if user has already applied for this job
        this.jobApplicationService.hasUserAppliedToJob(currentUser.id, this.job.id).subscribe({
          next: (hasApplied) => {
            if (hasApplied) {
              alert('Vous avez déjà postulé à cette offre d\'emploi.');
            } else {
              this.router.navigate(['/apply', this.job.id]);
            }
          },
          error: (error) => {
            console.error('Error checking application status:', error);
            // In case of error, allow the user to proceed to apply
            this.router.navigate(['/apply', this.job.id]);
          }
        });
      } else {
        this.router.navigate(['/apply', this.job.id]);
      }
    } else {
      // Redirect to login with return URL
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/apply/${this.job.id}` }
      });
    }
  }

  formatSalary(min: number, max: number): string {
    return `${min.toLocaleString('fr-FR')}€ - ${max.toLocaleString('fr-FR')}€`;
  }

  formatJobType(jobType: string): string {
    return jobType
      .replace('_', ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getPostedDate(date: Date | undefined): string {
    if (!date) return 'Recently';

    const postedDate = new Date(date);

    // Check if date is valid
    if (isNaN(postedDate.getTime())) {
      return 'Recently';
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}
