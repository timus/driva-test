import express from "express";
import bodyParser from "body-parser";
import {LoanController} from "./controllers/loanController";
import {swaggerDocs} from "./swagger";
import swaggerUi from "swagger-ui-express";
import {container} from "tsyringe";
import {LoanRepository} from "./repositories/loanRepository";
import {LoanService} from "./services/loanService";
import {LoanCalculationService} from "./services/loanCalculation";
import Datastore from 'nedb';
import {LoanValidationService} from "./services/loanValidationService";

const db = new Datastore({filename: './data/loans.db', autoload: true});

container.register<LoanRepository>("LoanRepository", {useValue: new LoanRepository(db)});
container.register<LoanService>("LoanService", {useClass: LoanService});
container.register<LoanCalculationService>("LoanCalculationService", {useClass: LoanCalculationService});
container.register<LoanValidationService>("LoanValidationService", {useClass: LoanValidationService});

const app = express();
const loanController = new LoanController();

app.use(bodyParser.json());

app.get("/loans", (req, res) => loanController.getAllLoans(req, res));
app.get("/loans/:id", (req, res) => loanController.getLoanById(req, res));
app.post("/loans", (req, res) => loanController.createLoan(req, res));
app.put("/loans/:id", (req, res) => loanController.updateLoan(req, res));
app.delete("/loans/:id", (req, res) => loanController.deleteLoan(req, res));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export {app};
