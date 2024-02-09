import { loginPage } from '../pages/login.page';

describe('Login test e2e', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    });
    cy.intercept({
      method: 'GET',
      url: '/api/session',
    }, []).as('session');
  });

  it('should login successfully', () => {
    const user = require("../fixtures/loginUser.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    loginPage.checkUrlIncludes('/sessions');
  });

  it('should login and logout successfully', () => {
    const user = require('../fixtures/loginUser.json');
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    loginPage.checkUrlIncludes('/sessions');
    loginPage.logOut();
  });

  it('should login and show account admin', () => {
    const user = require('../fixtures/adminUser.json');
    cy.intercept('GET','/api/user/1',{ body : user }).as('me')
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    loginPage.checkUrlIncludes('/sessions');
    loginPage.account();
    loginPage.admin();
  });

  it('should login and show account user', () => {
    const user = require('../fixtures/loginUser.json');
    cy.intercept('GET','/api/user/1',{ body : user }).as('me')
    cy.intercept('delete','/api/user/1',[]).as('deleteMe')
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    loginPage.checkUrlIncludes('/sessions');
    loginPage.account();
    loginPage.detail();
  });
});
