import { loginPage } from '../pages/login.page';

describe('Login test e2e', () => {
  const mockAdmin = require("../fixtures/admin-user.json");

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: mockAdmin,
    });
  });

  it('should login successfully', () => {
    const user = require("../fixtures/login-user.json");
    loginPage.visit();
    loginPage.fillLoginForm(user);
    loginPage.submitForm();
    loginPage.checkUrlIncludes('/sessions');
    cy.url().should('include', '/sessions');
  });
});
