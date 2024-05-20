# Loan Calculator

This project is a Loan Calculator application built using Express.js and TypeScript. It includes features such as loan creation, retrieval, update, and deletion, with dependency injection handled by `tsyringe`.

## How to Run

1. **Clone the project:**

    ```sh
    git clone <repository-url>
    cd <project-directory>
    ```

2. **Start the application using Docker Compose:**

    ```sh
    docker-compose up
    ```

# API documentation
API documentation is provided using Swagger. 
You can view and test all endpoints by visiting the following URL below in your browser:

http://localhost:3000/api-docs/

# How to Run Tests

To run the tests, use the following command:

```sh
npm run test

```
## How to Run Code Coverage
```sh
npm run test:coverage

```

## Note
Express.js and tsyringe: This project uses Express.js for the server framework and tsyringe for dependency injection to manage services and their dependencies efficiently.


Testing: Extensive tests have been written to cover most scenarios to ensure the application functions correctly.


NeDB: The project uses NeDB as the database for its portability and ease of use.