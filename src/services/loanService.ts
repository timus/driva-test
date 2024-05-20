import {Loan} from "../entities/loan";
import {injectable, inject} from "tsyringe";
import {LoanRepository} from "../repositories/loanRepository";
import {LoanCalculationService} from "./loanCalculation";
import {LoanValidationService} from "./loanValidationService";
import {ValidationError} from "../validation/validationError";
import * as fs from 'fs';

interface ServiceResult {
    success: boolean;
    message?: string;
    errors?: ValidationError[];
    loan?: Loan;
    loans?: Loan[];
}

@injectable()
export class LoanService {
    private config!: { [key: string]: number };

    constructor(
        @inject("LoanRepository") private loanRepository: LoanRepository,
        @inject("LoanCalculationService") private loanCalculationService: LoanCalculationService,
        @inject("LoanValidationService") private loanValidationService: LoanValidationService
    ) {
        this.loadConfig();
    }

    private loadConfig() {
        const configPath = 'loanTermsConfig.json';
        const configContent = fs.readFileSync(configPath, 'utf-8');
        this.config = JSON.parse(configContent);
    }

    private getLoanTerm(type: string): number {
        const term = this.config[type.toLowerCase()];
        if (!term) {
            throw new Error(`Invalid loan type: ${type}`);
        }
        return term;
    }

    public async getAllLoans(): Promise<ServiceResult> {
        try {
            const loans = await this.loanRepository.getAll();
            return {success: true, loans};
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to retrieve loans: ${err.message}`);
        }
    }

    public async getLoanById(id: string): Promise<ServiceResult> {
        try {
            const loan = await this.loanRepository.getById(id);
            return {success: true, loan};
        } catch (error) {
            const err = error as Error;
            return {success: false, errors: [{message: err.message, code: 'RETRIEVE_FAILED'}]};
        }
    }

    public async createLoan(loan: Loan): Promise<ServiceResult> {
        const validationResult = this.loanValidationService.validateLoan(loan);
        if (!validationResult.isValid) {
            return {success: false, errors: validationResult.errors};
        }
        const loanTerm = this.getLoanTerm(loan.type);
        loan.monthlyPayment = this.loanCalculationService.calculateMonthlyPayment(loan.amount, loan.interestRate, loanTerm);
        const createdLoan = await this.loanRepository.create(loan);
        return {success: true, message: "Loan created successfully", loan: createdLoan};
    }

    public async updateLoan(id: string, loan: Loan): Promise<ServiceResult> {
        const validationResult = this.loanValidationService.validateLoan(loan);
        if (!validationResult.isValid) {
            return {success: false, errors: validationResult.errors};
        }
        const loanTerm = this.getLoanTerm(loan.type);
        loan.monthlyPayment = this.loanCalculationService.calculateMonthlyPayment(loan.amount, loan.interestRate, loanTerm);
        try {
            await this.loanRepository.update(id, loan);
            return {success: true, message: "Loan updated successfully", loan};
        } catch (error) {
            const err = error as Error;
            return {success: false, errors: [{message: err.message, code: 'UPDATE_FAILED'}]};
        }
    }

    public async deleteLoan(id: string): Promise<ServiceResult> {
        try {
            await this.loanRepository.delete(id);
            return {success: true, message: "Loan deleted successfully"};
        } catch (error) {
            const err = error as Error;
            return {success: false, errors: [{message: err.message, code: 'DELETE_FAILED'}]};
        }
    }
}
