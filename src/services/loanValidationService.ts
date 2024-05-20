import {Loan} from "../entities/loan";
import {injectable} from "tsyringe";
import {ValidationResult} from "../validation/validationResult";
import {LoanType} from "../entities/loanType";
import {ValidationError} from "../validation/validationError";
import * as fs from 'fs';

@injectable()
export class LoanValidationService {
    private config: any;

    constructor() {
        this.loadConfig();
    }

    private loadConfig() {
        const configPath = 'validationConfig.json';
        const configContent = fs.readFileSync(configPath, 'utf-8');
        this.config = JSON.parse(configContent);
    }

    validateLoan(loan: Loan): ValidationResult {
        const errors: ValidationError[] = [];

        switch (loan.type) {
            case LoanType.Personal:
                this.validatePersonalLoan(loan, errors);
                break;
            case LoanType.Car:
                this.validateCarLoan(loan, errors);
                break;
            case LoanType.Home:
                this.validateHomeLoan(loan, errors);
                break;
            default:
                const error = new ValidationError("Invalid loan type", "INVALID_LOAN_TYPE");
                errors.push(error);
                this.logError(error);
        }

        return errors.length === 0 ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    private validatePersonalLoan(loan: Loan, errors: ValidationError[]): void {
        const {minAmount, maxAmount, minInterestRate, maxInterestRate} = this.config.personalLoan;
        if (loan.amount < minAmount || loan.amount > maxAmount) {
            const error = new ValidationError(`Personal loan amount must be between $${minAmount} and $${maxAmount}`, "INVALID_PERSONAL_LOAN_AMOUNT");
            errors.push(error);
            this.logError(error);
        }
        if (loan.interestRate < minInterestRate || loan.interestRate > maxInterestRate) {
            const error = new ValidationError(`Personal loan interest rate must be between ${minInterestRate}% and ${maxInterestRate}%`, "INVALID_PERSONAL_LOAN_INTEREST_RATE");
            errors.push(error);
            this.logError(error);
        }
    }

    private validateCarLoan(loan: Loan, errors: ValidationError[]): void {
        const {minAmount, maxAmount, minInterestRate, maxInterestRate} = this.config.carLoan;
        if (loan.amount < minAmount || loan.amount > maxAmount) {
            const error = new ValidationError(`Car loan amount must be between $${minAmount} and $${maxAmount}`, "INVALID_CAR_LOAN_AMOUNT");
            errors.push(error);
            this.logError(error);
        }
        if (loan.interestRate < minInterestRate || loan.interestRate > maxInterestRate) {
            const error = new ValidationError(`Car loan interest rate must be between ${minInterestRate}% and ${maxInterestRate}%`, "INVALID_CAR_LOAN_INTEREST_RATE");
            errors.push(error);
            this.logError(error);
        }
    }

    private validateHomeLoan(loan: Loan, errors: ValidationError[]): void {
        const {minAmount, maxAmount, minInterestRate, maxInterestRate} = this.config.homeLoan;
        if (loan.amount < minAmount || loan.amount > maxAmount) {
            const error = new ValidationError(`Home loan amount must be between $${minAmount} and $${maxAmount}`, "INVALID_HOME_LOAN_AMOUNT");
            errors.push(error);
            this.logError(error);
        }
        if (loan.interestRate < minInterestRate || loan.interestRate > maxInterestRate) {
            const error = new ValidationError(`Home loan interest rate must be between ${minInterestRate}% and ${maxInterestRate}%`, "INVALID_HOME_LOAN_INTEREST_RATE");
            errors.push(error);
            this.logError(error);
        }
    }

    private logError(error: ValidationError): void {
        console.error(`Validation Error: ${error.message} (Code: ${error.code})`);
    }
}
