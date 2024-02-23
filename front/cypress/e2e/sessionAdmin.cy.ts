import { loginPage } from '../pages/login.page';
import { sessionPage } from '../pages/session.page';
import { sessionEditionPage } from '../pages/session-edition.page';
import { sessionCreationPage } from '../pages/session-creation.page';
import { sessionDetailPage } from '../pages/session-detail.page';

describe('Session admin test e2e', () => {
  const mockAdmin = require("../fixtures/admin-user.json");
  const mockTeachers = require("../fixtures/teachers.json");
  const mockSessions = require("../fixtures/sessions.json");
  const mockDateSession = '2024-01-01';

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: mockAdmin,
    })
    cy.intercept('GET', 'api/teacher', {
      body: mockTeachers,
    }).as('getTeacher')
    cy.intercept('GET', 'api/teacher/1', {
      body: mockTeachers[0],
    })
    cy.intercept('GET', 'api/teacher/2', {
      body: mockTeachers[1],
    })
    cy.intercept('GET', 'api/session', { body: [mockSessions[1]] }).as('getSession')
    cy.intercept('POST', 'api/session', { body: mockSessions[1] }).as('postSession')
  })

  it('Should create a session', () => {
    const user = require("../fixtures/login-user.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");
    sessionPage.createSession();

    sessionCreationPage.fillLoginForm(mockSessions[1]);
    sessionCreationPage.selectTeacher('Jane Doe');
    sessionCreationPage.save();

    cy.wait('@postSession')
    cy.wait('@getSession')

    sessionPage.matCardItems().should('contain.text', `${mockSessions[1].name}`);
    cy.get('p').should('contain.text', `${mockSessions[1].description}`);
  })

  it('Should edit a session', () => {
    cy.intercept('GET', 'api/session/2', { body: mockSessions[1] }).as('session1')
    cy.intercept('PUT', '/api/session/2', { body: mockSessions[0] }).as('sessionEdited')
    
    const user = require("../fixtures/login-user.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");
    sessionPage.createSession();
    
    sessionCreationPage.fillLoginForm(mockSessions[1]);
    sessionCreationPage.selectTeacher('Jane Doe');
    sessionCreationPage.save();
    cy.wait('@postSession')
    cy.wait('@getSession')
    
    cy.intercept('GET', 'api/session', { body: [mockSessions[0]],}).as('getSession2')
    sessionPage.editSession();
    cy.wait('@session1')
    cy.wait('@getTeacher')
    sessionEditionPage.fillLoginForm(mockSessions[0]);
    sessionEditionPage.selectTeacher('John Doe');
    sessionEditionPage.save();

    cy.wait('@sessionEdited')
    cy.wait('@getSession2')

    sessionPage.matCardItems().should('contain.text', `${mockSessions[0].name}`);
    cy.get('p').should('contain.text', `${mockSessions[0].description}`);
  })

  it('Should delete a session', () => {
    cy.intercept('GET', 'api/session/2', { body: mockSessions[1] }).as('session1')
    cy.intercept('DELETE', '/api/session/2', { body: mockSessions[0] }).as('deleteSession')
    
    const user = require("../fixtures/login-user.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    sessionPage.checkUrlIncludes("/sessions");
    sessionPage.createSession();
    
    sessionCreationPage.fillLoginForm(mockSessions[1]);
    sessionCreationPage.selectTeacher('Jane Doe');
    sessionCreationPage.save();
    cy.wait('@postSession')
    cy.wait('@getSession')

    cy.intercept('GET', 'api/session', { body: [{}] }).as('getSession2')

    sessionPage.detail();
    sessionDetailPage.delete();

    cy.wait('@deleteSession')
    cy.wait('@getSession2')

    sessionPage.matCardItems().should('contain.text', '');
    cy.get('p').should('contain.text', '');
  })
})
