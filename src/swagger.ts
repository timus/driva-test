export const swaggerDocs = {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "Loan API",
        description: "API documentation for the Loan application"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ["http"],
    paths: {
        "/loans": {
            get: {
                summary: "Retrieve all loans",
                responses: {
                    "200": {
                        description: "List of loans",
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/definitions/Loan"
                            }
                        }
                    }
                }
            },
            post: {
                summary: "Create a new loan",
                parameters: [
                    {
                        name: "loan",
                        in: "body",
                        required: true,
                        schema: {
                            $ref: "#/definitions/Loan"
                        }
                    }
                ],
                responses: {
                    "201": {
                        description: "Loan created"
                    }
                }
            }
        },
        "/loans/{id}": {
            get: {
                summary: "Retrieve a single loan by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    "200": {
                        description: "Loan details",
                        schema: {
                            $ref: "#/definitions/Loan"
                        }
                    }
                }
            },
            put: {
                summary: "Update an existing loan",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        type: "string"
                    },
                    {
                        name: "loan",
                        in: "body",
                        required: true,
                        schema: {
                            $ref: "#/definitions/Loan"
                        }
                    }
                ],
                responses: {
                    "204": {
                        description: "Loan updated"
                    }
                }
            },
            delete: {
                summary: "Delete a loan",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    "204": {
                        description: "Loan deleted"
                    }
                }
            }
        }
    },
    definitions: {
        Loan: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "The name of the loan applicant"
                },
                amount: {
                    type: "number",
                    description: "The loan amount. Valid ranges: Personal loan: $1,000 - $20,000; Car loan: $4,000 - $100,000; Home loan: $100,000 - $10,000,000"
                },
                type: {
                    type: "string",
                    enum: ["Home", "Car", "Personal"],
                    description: "The type of loan. One of: Home, Car, Personal"
                },
                income: {
                    type: "number",
                    description: "The income of the loan applicant"
                },
                interestRate: {
                    type: "number",
                    description: "The interest rate. Valid ranges: Personal loan: 15% - 20%; Car loan: 12% - 16%; Home loan: 5% - 7%"
                },
                monthlyPayment: {
                    type: "number",
                    description: "The monthly payment amount (calculated)",
                    readOnly: true
                }
            },
            required: ["name", "amount", "type", "income", "interestRate"]
        }
    }
};
