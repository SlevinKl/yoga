export const loginPage = {
  visit: () => cy.visit('/login'),
  fillLoginForm: (user: { email: string; password: string; }) => {
    cy.get('input[formControlName=email]').type(user.email);
    cy.get('input[formControlName=password]').type(user.password);
  },
  checkUrlIncludes: (url: string) => cy.url().should('include', url),
  submitForm: () => cy.get('button[type="submit"]').click(),
  logOut: () => cy.get("span").contains("Logout").as("btnLogout").click(),
  account: () => cy.get("span").contains("Account").as("btnAccount").click(),
  admin: () => cy.get("p").contains("You are admin"),
  detail: () => cy.get("button").contains("Detail").as("btnDetail").click()
};
