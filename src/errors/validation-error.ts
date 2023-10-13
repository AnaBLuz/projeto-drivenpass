import { ApplicationError } from '@/protocols';

export function validationError(): ApplicationError {
    return {
        name: 'ValidationError',
        message: 'Validation failed',
    };
}