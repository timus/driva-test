import "reflect-metadata";
import {LoanValidationService} from '../services/loanValidationService';
import {LoanType} from '../entities/loanType';
import {Loan} from '../entities/loan';
import {container} from 'tsyringe';

describe('LoanValidationService', () => {
    let loanValidationService: LoanValidationService;

    beforeAll(() => {
        loanValidationService = container.resolve(LoanValidationService);
    });

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const dataProvider = [
        {
            loan: {
                name: 'Valid Personal Loan',
                amount: 15000,
                type: LoanType.Personal,
                income: 50000,
                interestRate: 18
            },
            valid: true
        },
        {
            loan: {
                name: 'Invalid Personal Loan Amount',
                amount: 500,
                type: LoanType.Personal,
                income: 50000,
                interestRate: 18
            },
            valid: false,
            errorCode: 'INVALID_PERSONAL_LOAN_AMOUNT'
        },
        {
            loan: {
                name: 'Invalid Personal Loan Interest Rate',
                amount: 15000,
                type: LoanType.Personal,
                income: 50000,
                interestRate: 25
            },
            valid: false,
            errorCode: 'INVALID_PERSONAL_LOAN_INTEREST_RATE'
        },
        {
            loan: {
                name: 'Valid Car Loan',
                amount: 20000,
                type: LoanType.Car,
                income: 60000,
                interestRate: 14
            },
            valid: true
        },
        {
            loan: {
                name: 'Invalid Car Loan Amount',
                amount: 3000,
                type: LoanType.Car,
                income: 60000,
                interestRate: 14
            },
            valid: false,
            errorCode: 'INVALID_CAR_LOAN_AMOUNT'
        },
        {
            loan: {
                name: 'Invalid Car Loan Interest Rate',
                amount: 20000,
                type: LoanType.Car,
                income: 60000,
                interestRate: 20
            },
            valid: false,
            errorCode: 'INVALID_CAR_LOAN_INTEREST_RATE'
        },
        {
            loan: {
                name: 'Valid Home Loan',
                amount: 500000,
                type: LoanType.Home,
                income: 100000,
                interestRate: 6
            },
            valid: true
        },
        {
            loan: {
                name: 'Invalid Home Loan Amount',
                amount: 50000,
                type: LoanType.Home,
                income: 100000,
                interestRate: 6
            },
            valid: false,
            errorCode: 'INVALID_HOME_LOAN_AMOUNT'
        },
        {
            loan: {
                name: 'Invalid Home Loan Interest Rate',
                amount: 500000,
                type: LoanType.Home,
                income: 100000,
                interestRate: 10
            },
            valid: false,
            errorCode: 'INVALID_HOME_LOAN_INTEREST_RATE'
        },
        {
            loan: {
                name: 'Invalid Loan Type',
                amount: 5000,
                type: 'InvalidType' as LoanType,
                income: 50000,
                interestRate: 15
            },
            valid: false,
            errorCode: 'INVALID_LOAN_TYPE'
        }
    ];

    dataProvider.forEach(({loan, valid, errorCode}) => {
        const testDescription = valid ? `should validate ${loan.name} successfully` : `should return error for ${loan.name}`;
        test(testDescription, () => {
            const result = loanValidationService.validateLoan(loan as Loan);

            if (valid) {
                expect(result.isValid).toBe(true);
            } else {
                expect(result.isValid).toBe(false);
            }
        });
    });
});
