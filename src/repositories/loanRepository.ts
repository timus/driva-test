import {Loan} from "../entities/loan";
import Datastore from 'nedb';

export class LoanRepository {
    private db: Datastore;

    constructor(db: Datastore) {
        this.db = db;
    }

    public getAll(): Promise<Loan[]> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, docs: Loan[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public getById(id: string): Promise<Loan> {
        return new Promise((resolve, reject) => {
            console.log(`Searching for loan with ID: ${id}`);
            this.db.findOne({_id: id}, (err: Error | null, doc: Loan | null) => {
                if (err) {
                    console.error('Database error:', err);
                    reject(err);
                } else if (doc === null) {
                    console.warn('Loan not found for ID:', id);
                    reject(new Error('Loan not found'));
                } else {
                    console.log('Loan found:', doc);
                    resolve(doc);
                }
            });
        });
    }

    public create(loan: Loan): Promise<Loan> {
        return new Promise((resolve, reject) => {
            this.db.insert(loan, (err: Error | null, newDoc: Loan) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    public update(id: string, loan: Partial<Loan>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.update({_id: id}, {$set: loan}, {}, (err: Error | null, numReplaced: number) => {
                if (err) {
                    reject(err);
                } else if (numReplaced === 0) {
                    reject(new Error('Loan not found'));
                } else {
                    resolve();
                }
            });
        });
    }

    public delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.remove({_id: id}, {}, (err: Error | null, numRemoved: number) => {
                if (err) {
                    reject(err);
                } else if (numRemoved === 0) {
                    reject(new Error('Loan not found'));
                } else {
                    resolve();
                }
            });
        });
    }
}
