import { registerPage } from '../pages/register.page';

describe('Register test e2e', () => {
  beforeEach(() => {
    cy.intercept('POST', 'api/auth/register', []);
  });

  it('should register a user', () => {
    const user = require('../fixtures/register-user.json');
    registerPage.visit();
    registerPage.fillRegistrationForm(user);
    registerPage.submitForm();
    cy.url().should('include', '/login');
  });
});
