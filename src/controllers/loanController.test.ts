import "reflect-metadata";
import request from 'supertest';
import {app} from '../app';
import {LoanType} from '../entities/loanType';
import {Loan} from '../entities/loan';
import Datastore from 'nedb';
import {container} from 'tsyringe';
import {LoanRepository} from '../repositories/loanRepository';

describe('LoanController', () => {
    let testDb: Datastore;

    beforeAll(() => {
        testDb = new Datastore();
        const loanRepository = new LoanRepository(testDb);
        container.registerInstance('LoanRepository', loanRepository);
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
            interestRate: 15,
        };

        const createResponse = await request(app).post('/loans').send(loan);
        expect(createResponse.body.success).toBe(true);
        expect(createResponse.body.message).toBe('Loan created successfully');
        expect(createResponse.body.loan).toBeDefined();

        const retrieveResponse = await request(app).get(`/loans/${createResponse.body.loan._id}`);
        expect(retrieveResponse.body.success).toBe(true);
        expect(retrieveResponse.body.loan).toMatchObject(loan);
    });

    test('should return 404 when loan not found', async () => {
        const response = await request(app).get('/loans/nonexistentId');
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Loan not found');
    });

    test('should return validation errors when creating an invalid loan', async () => {
        const invalidLoan = {
            name: '',
            amount: 0,
            type: LoanType.Personal,
            income: 0,
            interestRate: 0,
        };

        const createResponse = await request(app).post('/loans').send(invalidLoan);
        expect(createResponse.status).toBe(400);
        expect(createResponse.body.success).toBe(false);
        expect(createResponse.body.code).toBe('VALIDATION_ERROR');
        expect(createResponse.body.errors).toBeDefined();
    });

    test('should update a loan', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 15,
        };

        const createResponse = await request(app).post('/loans').send(loan);
        expect(createResponse.body.success).toBe(true);

        const updatedLoan = {
            ...loan,
            name: 'Updated User',
            amount: 6000,
        };

        const updateResponse = await request(app).put(`/loans/${createResponse.body.loan._id}`).send(updatedLoan);
        expect(updateResponse.body.success).toBe(true);
        expect(updateResponse.body.message).toBe('Loan updated successfully');
        expect(updateResponse.body.loan).toBeDefined();
        expect(updateResponse.body.loan.name).toBe('Updated User');
        expect(updateResponse.body.loan.amount).toBe(6000);
    });

    test('should return 404 when updating a non-existent loan', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 15,
        };

        const updateResponse = await request(app).put('/loans/nonexistentId').send(loan);
        expect(updateResponse.status).toBe(404);
        expect(updateResponse.body.success).toBe(false);
        expect(updateResponse.body.message).toBe('Loan could not be updated. Either the loan was not found or something went wrong.');
    });

    test('should delete a loan', async () => {
        const loan: Loan = {
            name: 'Test User',
            amount: 5000,
            type: LoanType.Personal,
            income: 50000,
            interestRate: 15,
        };

        const createResponse = await request(app).post('/loans').send(loan);
        expect(createResponse.body.success).toBe(true);

        const deleteResponse = await request(app).delete(`/loans/${createResponse.body.loan._id}`);
        expect(deleteResponse.body.success).toBe(true);
        expect(deleteResponse.body.message).toBe('Loan deleted successfully');

        const retrieveResponse = await request(app).get(`/loans/${createResponse.body.loan._id}`);
        expect(retrieveResponse.status).toBe(404);
        expect(retrieveResponse.body.success).toBe(false);
        expect(retrieveResponse.body.message).toBe('Loan not found');
    });

    test('should return 404 when deleting a non-existent loan', async () => {
        const deleteResponse = await request(app).delete('/loans/nonexistentId');
        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.success).toBe(false);
        expect(deleteResponse.body.message).toBe('Loan could not be deleted. Either the loan was not found or something went wrong.');
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

        await request(app).post('/loans').send(loan1);
        await request(app).post('/loans').send(loan2);

        const response = await request(app).get('/loans');
        expect(response.body.success).toBe(true);
        expect(response.body.loans).toEqual(
            expect.arrayContaining([
                expect.objectContaining({name: 'Test User 1'}),
                expect.objectContaining({name: 'Test User 2'})
            ])
        );
    });
});
