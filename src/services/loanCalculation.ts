import {injectable} from "tsyringe";

@injectable()
export class LoanCalculationService {
    public calculateMonthlyPayment(loanAmount: number, interestRate: number, loanTerm: number): number {
        const monthlyInterestRate = interestRate / 12 / 100;
        const numberOfPayments = loanTerm * 12;
        return (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    }
}
