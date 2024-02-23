import { loginPage } from '../pages/login.page';

describe('Login test e2e', () => {
  
  describe('As admin', () => {
    it('should show account admin', () => {
      const mockAdmin = require("../fixtures/admin-user.json");
      cy.intercept('GET','/api/user/1',{ body : mockAdmin }).as('me')
      cy.intercept('POST', '/api/auth/login', { body: mockAdmin });

      loginPage.visit();
      loginPage.fillLoginForm(mockAdmin);
      loginPage.submitForm();
      loginPage.checkUrlIncludes('/sessions');
      loginPage.account();
      cy.url().should('include', '/me');
      cy.get('p').should('contain.text', `Email: ${mockAdmin.email}`);
      cy.get('p').should('contain', 'You are admin');
    });
  });
  
  describe('As user', () => {
    it('should show account user', () => {
      const mockUser = require('../fixtures/login-user.json');
      cy.intercept('GET','/api/user/1',{ body : mockUser }).as('me')
      cy.intercept('POST', '/api/auth/login', { body: mockUser });
      
      loginPage.visit();
      loginPage.fillLoginForm(mockUser);
      loginPage.submitForm();
      loginPage.checkUrlIncludes('/sessions');
      loginPage.account();
      cy.url().should('include', '/me');
      cy.get('p').should('contain.text', `Email: ${mockUser.email}`);
      cy.get('p').should('not.contain', 'You are admin');
    });
  });
});
