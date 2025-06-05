export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  details?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  details?: string[];
}

export enum ErrorType {
  USER_NOT_FOUND = 'User Not Found',
  JOB_NOT_FOUND = 'Job Not Found',
  JOB_APPLICATION_NOT_FOUND = 'Job Application Not Found',
  EMAIL_ALREADY_EXISTS = 'Email Already Exists',
  ALREADY_APPLIED = 'Already Applied',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  INVALID_DATA = 'Invalid Data',
  VALIDATION_FAILED = 'Validation Failed',
  INVALID_ARGUMENT = 'Invalid Argument',
  INTERNAL_SERVER_ERROR = 'Internal Server Error'
} 