import { ApiError } from './api';

export interface ErrorHandlerOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

export class ErrorHandler {
  static handle(error: ApiError, options: ErrorHandlerOptions = {}) {
    const {
      showNotification = true,
      logToConsole = true,
      customMessage,
    } = options;

    const errorMessage = customMessage || error.message || 'An error occurred';
    const errorDetails = this.formatError(error);

    if (logToConsole) {
      console.error('API Error:', errorDetails);
    }

    if (showNotification && typeof window !== 'undefined') {
      this.showNotification({
        title: 'Error',
        message: errorMessage,
        type: 'error',
      });
    }

    return errorDetails;
  }

  static formatError(error: ApiError): {
    message: string;
    errors: Record<string, string[]> | null;
    status: number | undefined;
  } {
    let errorMessage = error.message || 'An error occurred';

    // Handle validation errors
    if (error.errors) {
      const validationMessages = Object.entries(error.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      
      if (validationMessages) {
        errorMessage = validationMessages;
      }
    }

    return {
      message: errorMessage,
      errors: error.errors || null,
      status: error.status,
    };
  }

  static showNotification(notification: {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    priority?: 'normal' | 'high';
  }) {
    // This will be integrated with your notification system
    // For now, we'll use console
    const emoji = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    console.log(
      `${emoji[notification.type]} ${notification.title}: ${notification.message}`
    );

    // If you're using react-hot-toast or similar, integrate here:
    // toast[notification.type](notification.message);
  }

  static handleValidationErrors(
    errors: Record<string, string[]>,
    setFieldError: (field: string, message: string) => void
  ) {
    Object.entries(errors).forEach(([field, messages]) => {
      setFieldError(field, messages[0]);
    });
  }

  static isNetworkError(error: ApiError): boolean {
    return error.status === 0 || error.message.includes('Network error');
  }

  static isAuthError(error: ApiError): boolean {
    return error.status === 401 || error.status === 403;
  }

  static isValidationError(error: ApiError): boolean {
    return error.status === 422 && !!error.errors;
  }

  static isServerError(error: ApiError): boolean {
    return (error.status || 0) >= 500;
  }

  static getErrorType(error: ApiError): 'network' | 'auth' | 'validation' | 'server' | 'unknown' {
    if (this.isNetworkError(error)) return 'network';
    if (this.isAuthError(error)) return 'auth';
    if (this.isValidationError(error)) return 'validation';
    if (this.isServerError(error)) return 'server';
    return 'unknown';
  }

  static getUserFriendlyMessage(error: ApiError): string {
    const errorType = this.getErrorType(error);

    const messages = {
      network: 'Unable to connect to the server. Please check your internet connection.',
      auth: 'You are not authorized to perform this action. Please log in again.',
      validation: 'Please check your input and try again.',
      server: 'Something went wrong on our end. Please try again later.',
      unknown: 'An unexpected error occurred. Please try again.',
    };

    return messages[errorType];
  }
}

// Convenience functions
export const handleAPIError = (error: ApiError, customMessage?: string) => {
  return ErrorHandler.handle(error, { customMessage });
};

export const showNotification = (notification: {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  priority?: 'normal' | 'high';
}) => {
  ErrorHandler.showNotification(notification);
};

export const handleValidationErrors = (
  errors: Record<string, string[]>,
  setFieldError: (field: string, message: string) => void
) => {
  ErrorHandler.handleValidationErrors(errors, setFieldError);
};

export default ErrorHandler;
