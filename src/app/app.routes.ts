import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { JobsPageComponent } from './components/jobs/jobs-page/jobs-page.component';
import { JobApplyComponent } from './components/jobs/job-apply/job-apply.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MyApplicationsComponent } from './components/applications/my-applications.component';
import { CreateJobComponent } from './components/recruiter/create-job/create-job.component';
import { ManageJobsComponent } from './components/recruiter/manage-jobs/manage-jobs.component';
import { ManageApplicationsComponent } from './components/recruiter/manage-applications/manage-applications.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './model/user.model';

// Temporary placeholder component
@Component({
  template: '<div class="container mt-4"><h2>Page Content Will Go Here</h2></div>',
  standalone: true
})
export class PlaceholderComponent {}

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'jobs', component: JobsPageComponent },
  { path: 'apply/:id', component: JobApplyComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'applications', component: MyApplicationsComponent, canActivate: [authGuard] },

  {
    path: 'create-job',
    component: CreateJobComponent,
    canActivate: [roleGuard([UserRole.RECRUITER, UserRole.ADMIN])]
  },
  {
    path: 'manage-jobs',
    component: ManageJobsComponent,
    canActivate: [roleGuard([UserRole.RECRUITER, UserRole.ADMIN])]
  },
  {
    path: 'manage-applications',
    component: ManageApplicationsComponent,
    canActivate: [roleGuard([UserRole.RECRUITER, UserRole.ADMIN])]
  },
  {
    path: 'job-applications/:id',
    component: ManageApplicationsComponent,
    canActivate: [roleGuard([UserRole.RECRUITER, UserRole.ADMIN])]
  },
  {
    path: 'edit-job/:id',
    component: CreateJobComponent,
    canActivate: [roleGuard([UserRole.RECRUITER, UserRole.ADMIN])]
  },

  { path: '**', redirectTo: '/home' }
];
