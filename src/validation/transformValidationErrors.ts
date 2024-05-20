import {ValidationError} from "class-validator";

export function transformValidationErrors(errors: ValidationError[]): any {
    return errors.map(err => ({
        property: err.property,
        constraints: err.constraints
    }));
}
