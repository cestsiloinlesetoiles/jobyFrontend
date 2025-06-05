import { Job } from './job.model';
import { User } from './user.model';

export enum ApplicationStatus {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    APPLIED = 'APPLIED'
}

export interface JobApplication {
    id?: string;
    jobId?: string;
    userId?: string;
    coverLetter: string;
    status: ApplicationStatus;
    applicationDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;

 
    jobTitle?: string;
    companyName?: string;
    userEmail?: string;
    userFirstName?: string;
    userLastName?: string;

    
    job?: Job;
    user?: User;
}

export interface JobApplicationDTO {
    id?: string;
    jobId?: string;
    userId?: string;
    coverLetter: string;
    status: ApplicationStatus;
    applicationDate?: Date;
    jobTitle?: string;
    companyName?: string;
    userEmail?: string;
    userFirstName?: string;
    userLastName?: string;
}

export interface JobApplicationRequestDTO {
    jobId: string;
    coverLetter: string;
}
