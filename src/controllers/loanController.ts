import {Request, Response} from "express";
import {validate} from "class-validator";
import {LoanService} from "../services/loanService";
import {container} from "tsyringe";
import {LoanDTO} from "../dto/loanDTO";
import {LoanIdDTO} from "../dto/loanIdDTO";
import {transformValidationErrors} from "../validation/transformValidationErrors";

export class LoanController {
    private loanService: LoanService;

    constructor() {
        this.loanService = container.resolve(LoanService);
    }

    public async getAllLoans(req: Request, res: Response): Promise<Response> {
        const result = await this.loanService.getAllLoans();
        return res.json(result);
    }

    public async getLoanById(req: Request, res: Response): Promise<Response> {
        const loanIdDTO = Object.assign(new LoanIdDTO(), req.params);
        const errors = await validate(loanIdDTO);

        if (errors.length > 0) {
            const transformedErrors = transformValidationErrors(errors);
            return res.status(400).json({success: false, code: 'VALIDATION_ERROR', errors: transformedErrors});
        }

        const result = await this.loanService.getLoanById(req.params.id);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(404).json({success: false, message: 'Loan not found'});
        }
    }

    public async createLoan(req: Request, res: Response): Promise<Response> {
        const loanDTO = Object.assign(new LoanDTO(), req.body);
        const errors = await validate(loanDTO);

        if (errors.length > 0) {
            const transformedErrors = transformValidationErrors(errors);
            return res.status(400).json({success: false, code: 'VALIDATION_ERROR', errors: transformedErrors});
        }

        const result = await this.loanService.createLoan(loanDTO);

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    }

    public async updateLoan(req: Request, res: Response): Promise<Response> {
        const loanIdDTO = Object.assign(new LoanIdDTO(), req.params);
        const idErrors = await validate(loanIdDTO);

        if (idErrors.length > 0) {
            const transformedErrors = transformValidationErrors(idErrors);
            return res.status(400).json({success: false, code: 'VALIDATION_ERROR', errors: transformedErrors});
        }

        const loanDTO = Object.assign(new LoanDTO(), req.body);
        const loanErrors = await validate(loanDTO);

        if (loanErrors.length > 0) {
            const transformedErrors = transformValidationErrors(loanErrors);
            return res.status(400).json({success: false, code: 'VALIDATION_ERROR', errors: transformedErrors});
        }

        const result = await this.loanService.updateLoan(req.params.id, loanDTO);
        if (result.success) {
            return res.status(200).json(result);
        } else if (result.errors && result.errors[0].code === 'UPDATE_FAILED') {
            return res.status(404).json({
                success: false,
                code: 'LOAN_UPDATE_FAILED',
                message: 'Loan could not be updated. Either the loan was not found or something went wrong.'
            });
        } else {
            return res.status(400).json(result);
        }
    }

    public async deleteLoan(req: Request, res: Response): Promise<Response> {
        const loanIdDTO = Object.assign(new LoanIdDTO(), req.params);
        const errors = await validate(loanIdDTO);

        if (errors.length > 0) {
            const transformedErrors = transformValidationErrors(errors);
            return res.status(400).json({success: false, code: 'VALIDATION_ERROR', errors: transformedErrors});
        }

        const result = await this.loanService.deleteLoan(req.params.id);
        if (result.success) {
            return res.status(200).json(result);
        } else if (result.errors && result.errors[0].code === 'DELETE_FAILED') {
            return res.status(404).json({
                success: false,
                code: 'LOAN_DELETE_FAILED',
                message: 'Loan could not be deleted. Either the loan was not found or something went wrong.'
            });
        } else {
            return res.status(400).json(result);
        }
    }
}
