import {IsNotEmpty, IsNumber, IsEnum, Min, IsInt} from "class-validator";
import {LoanType} from "../entities/loanType";

export class LoanDTO {
    @IsNotEmpty({message: "Name is required"})
    name!: string;

    @IsNotEmpty({message: "Amount is required"})
    @IsInt({message: "Amount must be an integer"})
    @Min(1, {message: "Amount must be greater than zero"})
    amount!: number;

    @IsNotEmpty({message: "Type is required"})
    @IsEnum(LoanType, {message: "Type must be one of 'Home', 'Car', 'Personal'"})
    type!: LoanType;

    @IsNotEmpty({message: "Income is required"})
    @IsInt({message: "Income must be an integer"})
    @Min(1, {message: "Income must be greater than zero"})
    income!: number;

    @IsNotEmpty({message: "Interest rate is required"})
    @IsNumber({}, {message: "Interest rate must be a number"})
    @Min(0, {message: "Interest rate must be greater than zero"})
    interestRate!: number;
}
