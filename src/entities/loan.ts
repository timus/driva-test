import {LoanType} from './loanType';

export interface Loan {
    _id?: string;
    name: string;
    amount: number;
    type: LoanType;
    income: number;
    interestRate: number;
    monthlyPayment?: number;
}
