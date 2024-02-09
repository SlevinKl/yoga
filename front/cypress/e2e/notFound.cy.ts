describe('empty spec', () => {
  it('should show page not found', () => {
    cy.visit('/login/test')
    cy.get('h1').contains('Page not found !')
    cy.url().should('include', '404')
  })
})
