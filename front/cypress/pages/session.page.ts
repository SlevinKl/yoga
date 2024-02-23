export const sessionPage = {
  visit: () => cy.visit('/session'),
  visitSession: () => cy.visit('/session/1'),
  checkUrlIncludes: (url: string) => cy.url().should('include', url),

  matCardItems: () => cy.get('mat-card.item'),

  participate: () => cy.get('button').contains('Participate').click(),
  unparticipate: () => cy.get('button').contains('Do not participate').click(),

  createSession: () => cy.get('button[routerLink="create"]').contains('Create').click(),
  editSession: () => cy.get('mat-card.item mat-card-actions button:nth-child(2)').first().click(),
  detail: () => cy.get('mat-card.item mat-card-actions button:nth-child(1)').first().click(),

  selectTeacher: (teacherName: string) => {
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains(teacherName).click();
  },
  saveSession: () => cy.get('button[type="submit"]').contains('Save').click()
};
