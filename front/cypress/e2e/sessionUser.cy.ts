import { loginPage } from '../pages/login.page';
import { sessionPage } from '../pages/session.page';

describe('Session user test e2e', () => {
  const mockDateSession = '2024-01-01'
  const mockTeacher = [
    {  
      id: 1,
      lastName: "John",
      firstName: "Doe",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 2,
      lastName: "Jane",
      firstName: "Doe",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockSession = [{
    id: 1,
    name: "Session Test",
    description: "Session Test Description",
    date: mockDateSession,
    teacher_id: 1,
    users: [0],
    createdAt: mockDateSession,
    updatedAt: mockDateSession,
  }]

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
      body: mockTeacher,
    })
    cy.intercept('GET', 'api/teacher/1', {
      body: mockTeacher[0],
    })
  })

  it('Should login as user and participate to a session', () => {
    cy.intercept('GET', 'api/session/1', {
      body: mockSession[0],
    }).as('firstSession')
    cy.intercept('GET', 'api/session', {
      body: mockSession,
    })
    const user = require("../fixtures/loginUser.json");
    loginPage.visit()
    loginPage.fillLoginForm(user)
    loginPage.submitForm()
    sessionPage.checkUrlIncludes('/sessions')
    sessionPage.detail()
    cy.intercept('GET', 'api/session/1', ((req) => {
      mockSession[0].users[0] = 1
      req.body =  mockSession[0]
    }))
    sessionPage.checkUrlIncludes('/sessions/detail/1')
    sessionPage.participate()
  })

  it('Should login as user unparticipate to a session', () => {
    const mockSessionUnparticipate = [{
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
      body: mockSession[0],
    }).as('firstSession')
    cy.intercept('GET', 'api/session', {
      body: mockSession,
    })
    const user = require("../fixtures/loginUser.json");
    loginPage.visit()
    loginPage.fillLoginForm(user)
    loginPage.submitForm()
    sessionPage.checkUrlIncludes('/sessions')
    cy.intercept('GET', 'api/session/1', {
      body : mockSessionUnparticipate[0]
    })
    sessionPage.detail()
    sessionPage.checkUrlIncludes('/sessions/detail/1')
    sessionPage.unparticipate()
  })
})
