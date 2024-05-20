import {ValidationError} from "./validationError";

export class ValidationResult {
    public isValid: boolean;
    public errors?: ValidationError[];

    constructor(isValid: boolean, errors?: ValidationError[]) {
        this.isValid = isValid;
        this.errors = errors;
    }

    static success(): ValidationResult {
        return new ValidationResult(true);
    }

    static failure(errors: ValidationError[]): ValidationResult {
        return new ValidationResult(false, errors);
    }
}
