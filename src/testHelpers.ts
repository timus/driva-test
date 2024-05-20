import Datastore from 'nedb';
import {Loan} from "./entities/loan";

export const insertTestLoan = (db: Datastore, loan: Loan): Promise<Loan> => {
    return new Promise((resolve, reject) => {
        const doc = {...loan, _id: loan._id};
        db.insert(doc, (err, newDoc) => {
            if (err) reject(err);
            else resolve({...newDoc, _id: newDoc._id});
        });
    });
};
