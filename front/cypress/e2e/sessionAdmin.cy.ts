import { loginPage } from '../pages/login.page';
import { sessionPage } from '../pages/session.page';

describe('Session admin test e2e', () => {
  const mockAdmin = require("../fixtures/admin-user.json");
  const mockTeachers = require("../fixtures/teachers.json");
  const mockSessions = require("../fixtures/sessions.json");
  const mockDateSession = '2024-01-01';

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: mockAdmin,
    })
  })

  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      mockSessions[1])

    cy.intercept(
      {
        method: 'POST',
        url: '/api/session',
      },
      mockSessions[1])
  })

  beforeEach(() => {
    cy.intercept('GET', 'api/teacher', {
      body: mockTeachers,
    })
    cy.intercept('GET', 'api/teacher/1', {
      body: mockTeachers[0],
    })
    cy.intercept('GET', 'api/teacher/2', {
      body: mockTeachers[1],
    })
  })

  it('Should create a session', () => {
    cy.intercept('GET', 'api/session', {
      body: mockSessions[1],
    }).as('getSession')
    cy.intercept('POST', 'api/session', {
      body: mockSessions[1],
    }).as('postSession')

    const user = require("../fixtures/login-user.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");
    sessionPage.createSession();

    cy.get('input[formControlName="name"]').type('Session Test 2').as('nameSession')
    cy.get('input[formControlName="date"]').type(mockDateSession)
    cy.get('mat-select[formControlName="teacher_id"]').click().as('teatcherSelect');
    cy.get('mat-option').contains('Jane Doe').click()
    cy.get('textarea[formControlName="description"]').type("Session Test Description 2")
    cy.get('button[type="submit"]').contains('Save').click().as('btnSave')
    cy.wait('@postSession')
    cy.wait('@getSession')
  })

  it('Should edit a session', () => {
    const user = require("../fixtures/login-user.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");
    sessionPage.createSession();

    cy.intercept('GET', 'api/session', {
      body: mockSessions,
    }).as('sessionCreated')

    cy.get('input[formControlName="name"]').type('Session').as('nameSession')
    cy.get('input[formControlName="date"]').type(mockDateSession)
    cy.get('mat-select[formControlName="teacher_id"]').click().as('teatcherSelect');
    cy.get('mat-option').contains('Jane Doe').click()
    cy.get('textarea[formControlName="description"]').type("Session Test Description")
    cy.get('button[type="submit"]').contains('Save').click().as('btnSave')

    cy.wait('@sessionCreated')

    cy.intercept('GET', 'api/session/1', {
      body: mockSessions[1],
    }).as('sessionEdited')

    cy.intercept('PUT', 'api/session/1', {
      body: mockSessions[1],
    }).as('sessionEdited')

    cy.get('button').contains('Edit').click()
    cy.get('@teatcherSelect').click()
    // cy.get('mat-option').contains('Jane Doe').click()
    // cy.get('button[type="submit"]').contains('Save').click()
  })

  it('Should delete a session', () => {
    const user = require("../fixtures/login-user.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");
    sessionPage.createSession();

    cy.intercept('GET', 'api/session', {
      body: mockSessions,
    }).as('sessionCreated')

    cy.get('input[formControlName="name"]').type('Session').as('nameSession')
    cy.get('input[formControlName="date"]').type(mockDateSession)
    cy.get('mat-select[formControlName="teacher_id"]').click().as('teatcherSelect');
    cy.get('mat-option').contains('Jane Doe').click()
    cy.get('textarea[formControlName="description"]').type("Session Test Description")
    cy.get('button[type="submit"]').contains('Save').click().as('btnSave')

    cy.wait('@sessionCreated')

    cy.intercept('GET', 'api/session/1', {
      body: mockSessions[1],
    }).as('sessionEdited')

    cy.intercept('DELETE', 'api/session/1', { body: {} })

    sessionPage.detail();
    cy.get('button').contains('Delete').click()
  })
})
