export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    role?: UserRole;
    phoneNumber?: string;
    skills?: string[];
    workExperiences?: WorkExperience[];
}

export enum UserRole {
    USER = 'USER',
    RECRUITER = 'RECRUITER',
    ADMIN = 'ADMIN'
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export interface AuthResponse {
    user: User;
}

export interface WorkExperience {
    id?: string;
    jobTitle: string;
    companyName: string;
    description?: string;
    startDate: string;
    endDate?: string;
}


export interface UserDTO {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role?: UserRole;
    skills?: string[];
    workExperiences?: WorkExperienceDTO[];
}

export interface WorkExperienceDTO {
    id?: string;
    jobTitle: string;
    companyName: string;
    description?: string;
    startDate: string;
    endDate?: string;
}

export interface UserUpdateDTO {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    skills?: string[];
    workExperiences?: WorkExperienceDTO[];
}
