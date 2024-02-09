import { loginPage } from '../pages/login.page';
import { sessionPage } from '../pages/session.page';

describe('Session admin test e2e', () => {

  const mockDateSession = '2024-01-01'
  const mockTeacher = [
    {  
      id: 1,
      lastName: "Doe",
      firstName: "John",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 2,
      lastName: "Doe",
      firstName: "Jane",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockSession = [
    {
      id: 1,
      name: "Session Test",
      description: "Session Test Description",
      date: mockDateSession,
      teacher_id: 1,
      users: [1],
      createdAt: mockDateSession,
      updatedAt: mockDateSession,
    },
    {
      id: 2,
      name: "Session Test 2",
      description: "Session Test Description 2",
      date: mockDateSession,
      teacher_id: 2,
      users: [1],
      createdAt: mockDateSession,
      updatedAt: mockDateSession,
    }
  ]

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })
  })

  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')
    cy.intercept(
      {
        method: 'POST',
        url: '/api/session',
      },
      []).as('sessionPost')
    cy.intercept('GET', 'api/session/1', {
      body: mockSession[0],
    })
    cy.intercept('PUT', 'api/session/1', {
      body: mockSession[1],
    })
    cy.intercept('delete', 'api/session/1', {
      body: {},
    })
  })
  beforeEach(() => {
    cy.intercept('GET', 'api/teacher', {
      body: mockTeacher,
    })
    cy.intercept('GET', 'api/teacher/1', {
      body: mockTeacher[0],
    })
  })

  it('Should create a session', () => {
    const user = require("../fixtures/loginUser.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");

    sessionPage.createSession();
    cy.intercept('GET', 'api/session', {
      body: mockSession,
    })

    cy.get('input[formControlName="name"]').type('Session').as('nameSession')
    cy.get('input[formControlName="date"]').type(mockDateSession)
    cy.get('mat-select[formControlName="teacher_id"]').click().as('teatcherSelect');
    cy.get('mat-option').contains('Jane Doe').click()
    cy.get('textarea[formControlName="description"]').type("Session Test Description")
    cy.get('button[type="submit"]').contains('Save').click().as('btnSave')
  })

  it('Should edit a session', () => {
    const user = require("../fixtures/loginUser.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");

    sessionPage.createSession();

    cy.intercept('GET', 'api/session', {
      body: mockSession,
    }).as('sessionCreated')

    cy.get('input[formControlName="name"]').type('Session').as('nameSession')
    cy.get('input[formControlName="date"]').type(mockDateSession)
    cy.get('mat-select[formControlName="teacher_id"]').click().as('teatcherSelect');
    cy.get('mat-option').contains('Jane Doe').click()
    cy.get('textarea[formControlName="description"]').type("Session Test Description")
    cy.get('button[type="submit"]').contains('Save').click().as('btnSave')

    cy.wait('@sessionCreated')

    cy.intercept('PUT', 'api/session/1', {
      body: mockSession[1],
    }).as('sessionEdited')
    cy.get('button').contains('Edit').click()
    cy.get('@teatcherSelect').click()
    cy.get('mat-option').contains('Jane Doe').click()
    cy.get('button[type="submit"]').contains('Save').click()
  })

  it('Should delete a session', () => {
    const user = require("../fixtures/loginUser.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");

    sessionPage.createSession();

    cy.intercept('GET', 'api/session', {
      body: mockSession,
    }).as('session')

    cy.get('input[formControlName="name"]').type('Session').as('nameSession')
    cy.get('input[formControlName="date"]').type(mockDateSession)
    cy.get('mat-select[formControlName="teacher_id"]').click().as('teatcherSelect');
    cy.get('mat-option').contains('Jane Doe').click()
    cy.get('textarea[formControlName="description"]').type("Session Test Description")
    cy.get('button[type="submit"]').contains('Save').click().as('btnSave')

    cy.wait('@session')
    sessionPage.detail();
    cy.intercept('delete', 'api/session/1', {
      body: {},
    })
    cy.get('button').contains('Delete').click()
  })
})
