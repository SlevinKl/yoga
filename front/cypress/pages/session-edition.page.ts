export const sessionEditionPage = {
  
  fillLoginForm: (session: { name: string; description: string; }) => {
    cy.get('input[formControlName="name"]').type(session.name)
    cy.get('input[formControlName="date"]').type('2024-01-01')
    cy.get('textarea[formControlName="description"]').type(session.description)
  },
  selectTeacher: (teacherName: string) => {
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains(teacherName).click();
  },
  save: () => cy.get('button[type="submit"]').contains('Save').click()
};
