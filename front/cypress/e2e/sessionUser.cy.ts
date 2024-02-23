import { loginPage } from '../pages/login.page';
import { sessionPage } from '../pages/session.page';

describe('Session user test e2e', () => {
  const mockTeachers = require("../fixtures/teachers.json");
  const mockSessions = require("../fixtures/sessions.json");
  const mockDateSession = '2024-01-01'

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    })
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/session/1/participate/1', {
      body: 'Participation successful',
      statusCode: 200,
    }).as('participationRequest');
  })

  beforeEach(() => {
    cy.intercept('GET', 'api/teacher', {
      body: mockTeachers,
    })
    cy.intercept('GET', 'api/teacher/1', {
      body: mockTeachers[0],
    })
  })

  it('Should login as user and participate to a session', () => {
    cy.intercept('GET', 'api/session/1', {
      body: mockSessions[0],
    }).as('firstSession')
    cy.intercept('GET', 'api/session', {
      body: mockSessions,
    })
    const user = require("../fixtures/login-user.json");
    loginPage.visit()
    loginPage.fillLoginForm(user)
    loginPage.submitForm()
    sessionPage.checkUrlIncludes('/sessions')
    sessionPage.detail()
    cy.intercept('GET', 'api/session/1', ((req) => {
      mockSessions[0].users[0] = 1
      req.body =  mockSessions[0]
    }))
    sessionPage.checkUrlIncludes('/sessions/detail/1')
    sessionPage.participate()
  })

  it('Should login as user unparticipate to a session', () => {
    const mockSessionsUnparticipate = [{
      id: 1,
      name: "Session Test",
      description: "Session Test Description",
      date: mockDateSession,
      teacher_id: 1,
      users: [1],
      createdAt: mockDateSession,
      updatedAt: mockDateSession,
    }]
    cy.intercept('GET', 'api/session/1', {
      body: mockSessions[0],
    }).as('firstSession')
    cy.intercept('GET', 'api/session', {
      body: mockSessions,
    })
    const user = require("../fixtures/login-user.json");
    loginPage.visit()
    loginPage.fillLoginForm(user)
    loginPage.submitForm()
    sessionPage.checkUrlIncludes('/sessions')
    cy.intercept('GET', 'api/session/1', {
      body : mockSessionsUnparticipate[0]
    })
    sessionPage.detail()
    sessionPage.checkUrlIncludes('/sessions/detail/1')
    sessionPage.unparticipate()
  })
})
