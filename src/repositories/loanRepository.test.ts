import {LoanRepository} from '../repositories/loanRepository';
import {LoanType} from '../entities/loanType';
import {Loan} from '../entities/loan';
import Datastore from 'nedb';

describe('LoanRepository', () => {
    let loanRepository: LoanRepository;
    let testDb: Datastore;

    beforeAll(() => {
        testDb = new Datastore();
        loanRepository = new LoanRepository(testDb);
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
            income: 50000,
            interestRate: 5,
        };

        const createdLoan = await loanRepository.create(loan);
        const retrievedLoan = await loanRepository.getById(createdLoan._id!);

        expect(retrievedLoan).toMatchObject({...loan, _id: createdLoan._id});
    });

    test('should return an error when loan not found', async () => {
        await expect(loanRepository.getById('nonexistentId')).rejects.toThrow('Loan not found');
    });

    test('should update a loan successfully', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 15,
        };

        const createdLoan = await loanRepository.create(loan);
        const updatedLoanData = {name: 'Updated User', amount: 10000};

        await loanRepository.update(createdLoan._id!, updatedLoanData);
        const updatedLoan = await loanRepository.getById(createdLoan._id!);

        expect(updatedLoan).toMatchObject({...loan, ...updatedLoanData, _id: createdLoan._id});
    });

    test('should return an error when updating a non-existing loan', async () => {
        const updatedLoanData = {name: 'Updated User', amount: 10000};

        await expect(loanRepository.update('nonexistentId', updatedLoanData)).rejects.toThrow('Loan not found');
    });

    test('should delete a loan successfully', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 15,
        };

        const createdLoan = await loanRepository.create(loan);
        await loanRepository.delete(createdLoan._id!);

        await expect(loanRepository.getById(createdLoan._id!)).rejects.toThrow('Loan not found');
    });

    test('should return an error when deleting a non-existing loan', async () => {
        await expect(loanRepository.delete('nonexistentId')).rejects.toThrow('Loan not found');
    });

    test('should handle database errors gracefully for create', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 5,
        };

        const originalInsert = testDb.insert;
        testDb.insert = jest.fn((newDoc: any, cb?: (err: Error | null, document: any) => void) => {
            if (cb) cb(new Error('Database error'), null);
        }) as any;

        await expect(loanRepository.create(loan)).rejects.toThrow('Database error');

        testDb.insert = originalInsert;
    });

    test('should handle database errors gracefully for getById', async () => {
        const originalFindOne = testDb.findOne;
        testDb.findOne = jest.fn((query: any, cb: (err: Error | null, document: any) => void) => {
            cb(new Error('Database error'), null);
        }) as any;

        await expect(loanRepository.getById('nonexistentId')).rejects.toThrow('Database error');

        testDb.findOne = originalFindOne;
    });

    test('should handle database errors gracefully for update', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 5,
        };

        const originalUpdate = testDb.update;
        testDb.update = jest.fn((query: any, update: any, options: any, cb: (err: Error | null, numReplaced: number) => void) => {
            cb(new Error('Database error'), 0);
        }) as any;

        const createdLoan = await loanRepository.create(loan);
        const updatedLoanData = {name: 'Updated User', amount: 10000};

        await expect(loanRepository.update(createdLoan._id!, updatedLoanData)).rejects.toThrow('Database error');

        testDb.update = originalUpdate;
    });

    test('should handle database errors gracefully for delete', async () => {
        const originalRemove = testDb.remove;
        testDb.remove = jest.fn((query: any, options: any, cb: (err: Error | null, numRemoved: number) => void) => {
            cb(new Error('Database error'), 0);
        }) as any;

        await expect(loanRepository.delete('nonexistentId')).rejects.toThrow('Database error');

        testDb.remove = originalRemove;
    });

    test('should handle database errors gracefully for getAll', async () => {
        const originalFind = testDb.find;
        testDb.find = jest.fn((query: any, cb: (err: Error | null, documents: any[]) => void) => {
            cb(new Error('Database error'), []);
        }) as any;

        await expect(loanRepository.getAll()).rejects.toThrow('Database error');

        testDb.find = originalFind;
    });
});
