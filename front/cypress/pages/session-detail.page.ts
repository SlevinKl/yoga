export const sessionPage = {
  visit: () => cy.visit('/sessions'),
  checkUrlIncludes: (url: string) => cy.url().should('include', url),
  participate: () => cy.get('button').contains('Participate').click(),
  unparticipate: () => cy.get('button').contains('Do not participate').click(),
  detail: () => cy.get('button').contains('Detail').click(),

  createSession: () => cy.get('button[routerLink="create"]').contains('Create').click(),

  editSession: () => cy.get('button').contains('Edit').click(),
  selectTeacher: (teacherName: string) => {
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains(teacherName).click();
  },
  saveSession: () => cy.get('button[type="submit"]').contains('Save').click()
};
