export const registerPage = {
  visit: () => cy.visit('/register'),
  fillRegistrationForm: (user) => {
    cy.get('input[formControlName="firstName"]').type(user.firstName);
    cy.get('input[formControlName="lastName"]').type(user.lastName);
    cy.get('input[formControlName="email"]').type(user.email);
    cy.get('input[formControlName="password"]').type(user.password);
  },
  submitForm: () => cy.get('button[type="submit"]').click(),
  checkError: () => cy.get('span').contains('An error occurred')
};
