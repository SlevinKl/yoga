import { loginPage } from '../pages/login.page';

describe('Logout test e2e', () => {
  const mockUser = require('../fixtures/login-user.json');

  beforeEach(() => {
    cy.intercept('GET','/api/user/1',{ body : mockUser }).as('me')
    cy.intercept('POST', '/api/auth/login', { body: mockUser });
  });

  it('should logout successfully', () => {
    loginPage.visit();
    loginPage.fillLoginForm(mockUser);
    loginPage.submitForm();
    loginPage.checkUrlIncludes('/sessions');
    loginPage.logOut();
    cy.url().should('include', '/').should('not.include', '/sessions');
  });
});
