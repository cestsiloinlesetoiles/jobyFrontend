import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthHelperService } from '../../../services/auth-helper.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  returnUrl: string = '/profile';
  showDemoProfiles = false;

  // Profils de démonstration
  demoProfiles = [
    {
      name: 'John Smith',
      role: 'Recruiter',
      email: 'john.smith@techcorp.com',
      password: '123456',
      description: 'Recruiter at TechCorp'
    },
    {
      name: 'Sarah Johnson',
      role: 'Recruiter',
      email: 'sarah.johnson@innovate.com',
      password: '123456',
      description: 'Recruiter at Innovate Solutions'
    },
    {
      name: 'Michael Brown',
      role: 'Job Seeker',
      email: 'michael.brown@email.com',
      password: '123456',
      description: 'Senior Java Developer'
    },
    {
      name: 'Emily Davis',
      role: 'Job Seeker',
      email: 'emily.davis@email.com',
      password: '123456',
      description: 'Python Backend Developer'
    },
    {
      name: 'David Wilson',
      role: 'Job Seeker',
      email: 'david.wilson@email.com',
      password: '123456',
      description: 'Frontend Developer'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authHelper: AuthHelperService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Check for return URL
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';

    // Check if user just registered
    if (this.route.snapshot.queryParams['registered'] === 'true') {
      this.successMessage = 'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.';
    }
  }

  selectProfile(profile: any) {
    this.loginForm.patchValue({
      email: profile.email,
      password: profile.password
    });
    this.showDemoProfiles = false;
  }

  toggleDemoProfiles() {
    this.showDemoProfiles = !this.showDemoProfiles;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authHelper.login(email, password, this.returnUrl).subscribe({
      next: (user) => {
        this.isSubmitting = false;
        // No need to navigate here as authHelper does it
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}
