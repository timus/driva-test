import "reflect-metadata";
import {LoanService} from '../services/loanService';
import {LoanRepository} from '../repositories/loanRepository';
import {LoanCalculationService} from '../services/loanCalculation';
import {LoanValidationService} from '../services/loanValidationService';
import {container} from 'tsyringe';
import {LoanType} from '../entities/loanType';
import {Loan} from '../entities/loan';
import Datastore from 'nedb';

describe('LoanService', () => {
    let loanService: LoanService;
    let testDb: Datastore;

    beforeAll(() => {
        testDb = new Datastore();
        const loanRepository = new LoanRepository(testDb);
        const loanCalculationService = new LoanCalculationService();
        const loanValidationService = new LoanValidationService();
        container.registerInstance('LoanRepository', loanRepository);
        container.registerInstance('LoanCalculationService', loanCalculationService);
        container.registerInstance('LoanValidationService', loanValidationService);

        loanService = container.resolve(LoanService);
    });

    beforeEach((done) => {
        testDb.remove({}, {multi: true}, () => {
            testDb.loadDatabase(done);
        });
    });

    test('should create and retrieve a loan', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 10000,
            interestRate: 15,
        };

        const result = await loanService.createLoan(loan);
        expect(result.success).toBe(true);
        expect(result.loan).toBeDefined();

        if (result.loan) {
            const retrievedLoanResult = await loanService.getLoanById(result.loan._id!);
            expect(retrievedLoanResult.success).toBe(true);
            expect(retrievedLoanResult.loan).toMatchObject({...loan, _id: result.loan._id});
        }
    });

    test('should validate loan correctly', async () => {
        const invalidLoan: Loan = {
            name: 'Test User',
            amount: 300,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 5,
        };

        const result = await loanService.createLoan(invalidLoan);

        expect(result.success).toBe(false);
    });

    test('should update a loan successfully', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 10000,
            interestRate: 15,
        };

        const createResult = await loanService.createLoan(loan);
        expect(createResult.success).toBe(true);

        if (createResult.loan) {
            const updatedLoan: Loan = {
                ...createResult.loan,
                amount: 7000
            };

            const updateResult = await loanService.updateLoan(createResult.loan._id!, updatedLoan);
            expect(updateResult.success).toBe(true);

            const retrievedLoanResult = await loanService.getLoanById(createResult.loan._id!);
            expect(retrievedLoanResult.success).toBe(true);
            expect(retrievedLoanResult.loan!.amount).toBe(7000);
        }
    });

    test('should return error when updating non-existent loan', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 10000,
            interestRate: 15,
        };

        const updateResult = await loanService.updateLoan('bad-loan-id', loan);
        expect(updateResult.success).toBe(false);
        expect(updateResult.errors).toBeDefined();
    });

    test('should delete a loan successfully', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 10000,
            interestRate: 15,
        };

        const createResult = await loanService.createLoan(loan);
        expect(createResult.success).toBe(true);

        if (createResult.loan) {
            const deleteResult = await loanService.deleteLoan(createResult.loan._id!);
            expect(deleteResult.success).toBe(true);

            const retrievedLoanResult = await loanService.getLoanById(createResult.loan._id!);
            expect(retrievedLoanResult.success).toBe(false);
        }
    });

    test('should return error when deleting non-existent loan', async () => {
        const deleteResult = await loanService.deleteLoan('nonexistentId');
        expect(deleteResult.success).toBe(false);
        expect(deleteResult.errors).toBeDefined();
    });

    test('should retrieve all loans', async () => {
        const loan1: Loan = {
            name: 'Test User 1',
            amount: 5000,
            type: LoanType.Personal,
            income: 10000,
            interestRate: 15,
        };

        const loan2: Loan = {
            name: 'Test User 2',
            amount: 7000,
            type: LoanType.Personal,
            income: 20000,
            interestRate: 17,
        };

        await loanService.createLoan(loan1);
        await loanService.createLoan(loan2);

        const allLoansResult = await loanService.getAllLoans();
        expect(allLoansResult.success).toBe(true);
        expect(allLoansResult.loans).toHaveLength(2);
        expect(allLoansResult.loans).toEqual(
            expect.arrayContaining([
                expect.objectContaining({name: 'Test User 1'}),
                expect.objectContaining({name: 'Test User 2'})
            ])
        );
    });
});
