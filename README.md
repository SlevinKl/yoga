# Yoga App

## Overview
This project is a Yoga application with a frontend using Angular and a backend using Java with Spring Boot.

## Software and Tools
IDE: Eclipse / VsCode
Java version: 1.8
Angular version: 14.1.0

Note
Make sure to have the required software installed.

## Installation

### Backend (Eclipse)

- Clone the project:
> gh repo clone SlevinKl/yoga

- Navigate to the backend folder:
>cd yoga/back

- Use Eclipse run configuration to clean and install pom.xml.

- Use Eclipse to run tests
1. Right-click on:
> src/test/java
2. Select the 
> Run As
3. Choose 
> JUnit Test

The test report is available here: 
1. Right-click on:
> back/target/site/jacoco/index.html
2. Select the 
> Open With
3. Choose
> Web Browser

### Frontend (VsCode)
Open the frontend folder in VsCode.

- Navigate to the frontend folder:
> cd yoga/front
- Run the following command to install dependencies:
> npm install
- Launch the Front-end:
> npm run start

#### Cypress Test (end-to-end)
- To run Cypress tests:
> npm run e2e
- To view coverage (run npm run e2e before):
> npm run e2e:coverage
- The report is available here:
> front/coverage/lcov-report/index.html

#### Unitary Test
- To launch unit tests
> npm run test
- For following changes
> npm run test:watch
