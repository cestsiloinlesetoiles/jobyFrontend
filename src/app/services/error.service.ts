import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorResponse, ApiError, ErrorType } from '../model/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  /**
   * Handle HTTP errors and convert them to user-friendly messages
   */
  handleError = (error: HttpErrorResponse): Observable<never> => {
    let apiError: ApiError;

    if (error.status === 0) {
      // Network error
      apiError = {
        status: 0,
        message: 'Unable to connect to server. Please check your internet connection.'
      };
    } else if (error.error && this.isErrorResponse(error.error)) {
      // Structured error response from backend
      const errorResponse: ErrorResponse = error.error;
      apiError = {
        status: errorResponse.status,
        message: this.getErrorMessage(errorResponse),
        details: errorResponse.details
      };
    } else {
      apiError = {
        status: error.status,
        message: this.getGenericErrorMessage(error.status)
      };
    }

    return throwError(() => apiError);
  };

  /**
   * Check if the error response matches our ErrorResponse interface
   */
  private isErrorResponse(obj: any): obj is ErrorResponse {
    return obj && 
           typeof obj.status === 'number' &&
           typeof obj.error === 'string' &&
           typeof obj.message === 'string' &&
           typeof obj.path === 'string' &&
           typeof obj.timestamp === 'string';
  }

  /**
   * Get user-friendly error message based on error type
   */
  private getErrorMessage(errorResponse: ErrorResponse): string {
    switch (errorResponse.error) {
      case ErrorType.USER_NOT_FOUND:
        return 'User not found. Please check the user ID.';
      
      case ErrorType.JOB_NOT_FOUND:
        return 'Job offer not found. It may have been removed or is no longer available.';
      
      case ErrorType.JOB_APPLICATION_NOT_FOUND:
        return 'Job application not found.';
      
      case ErrorType.EMAIL_ALREADY_EXISTS:
        return 'This email address is already registered. Please use a different email or try logging in.';
      
      case ErrorType.ALREADY_APPLIED:
        return 'You have already applied for this job.';
      
      case ErrorType.INVALID_CREDENTIALS:
        return 'Invalid email or password. Please check your credentials and try again.';
      
      case ErrorType.INVALID_DATA:
        return 'The provided data is invalid. Please check your input and try again.';
      
      case ErrorType.VALIDATION_FAILED:
        if (errorResponse.details && errorResponse.details.length > 0) {
          return `Validation failed: ${errorResponse.details.join(', ')}`;
        }
        return 'Please check your input and try again.';
      
      case ErrorType.INVALID_ARGUMENT:
        return 'Invalid request. Please check your input.';
      
      case ErrorType.INTERNAL_SERVER_ERROR:
        return 'An unexpected error occurred. Please try again later.';
      
      default:
        return errorResponse.message || 'An error occurred. Please try again.';
    }
  }

  /**
   * Get generic error message for status codes without structured response
   */
  private getGenericErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authorized. Please log in and try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict occurred. The resource may already exist.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Service unavailable. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Extract error message from ApiError for display
   */
  getDisplayMessage(error: ApiError): string {
    return error.message;
  }

  /**
   * Extract error details from ApiError for display
   */
  getDisplayDetails(error: ApiError): string[] {
    return error.details || [];
  }
} 