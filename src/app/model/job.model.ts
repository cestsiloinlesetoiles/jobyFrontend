export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    FREELANCE = 'FREELANCE',
    INTERNSHIP = 'INTERNSHIP'
}

export enum ExperienceLevel {
    ENTRY_LEVEL = 'ENTRY_LEVEL',
    JUNIOR = 'JUNIOR',
    MID_LEVEL = 'MID_LEVEL',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
    EXECUTIVE = 'EXECUTIVE'
}

export interface Job {
    id?: string;
    title: string;
    description: string;
    responsibilities: string;
    qualifications: string;
    location: string;
    jobType: JobType;
    salaryMin: number;
    salaryMax: number;
    experienceLevel: ExperienceLevel;
    postedDate?: Date;
    companyName: string;
    requirements?: string[];
    benefits?: string[];
    createdAt?: Date;
    recruiterId?: string;
    applicationCount?: number;
}


export interface JobDTO {
    id?: string;
    title: string;
    description: string;
    responsibilities: string;
    qualifications: string;
    location: string;
    jobType: JobType;
    salaryMin: number;
    salaryMax: number;
    experienceLevel: ExperienceLevel;
    postedDate?: Date;
    companyName: string;
    recruiterId?: string;
    applicationCount?: number;
}

export interface JobRequestDTO {
    title: string;
    description?: string;
    responsibilities?: string;
    qualifications?: string;
    location: string;
    jobType: JobType;
    salaryMin: number;
    salaryMax: number;
    experienceLevel: ExperienceLevel;
    companyName: string;
}
