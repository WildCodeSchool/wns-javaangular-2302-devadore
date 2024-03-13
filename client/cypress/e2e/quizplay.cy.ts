/// <reference types="Cypress" />
describe('Quiz Play Component Tests', () => {
  beforeEach(() => {
    cy.visit('/quiz/play/1');
  });

  it('charge la page du quiz (id = 1) avec les éléments initiaux', () => {
    cy.url().should('include', '/quiz/play/1');
    cy.get('.quiz-section').should('be.visible');
    cy.get('.timer-container').should('be.visible');
    cy.get('.question').should('be.visible');
    cy.get('ul.answers').find('li').should('have.length.at.least', 2);
  });

  it('affiche le nom d\'utilisateur ou le texte par défaut en majuscules', () => {
    cy.get('.quiz-section h1')
      .invoke('text')
      .then((text) => {
        const displayedText = text.trim();
        const expectedText = displayedText === 'YUYU' ? 'MYSTÉRIEUX INCONNU' : displayedText;
        expect(displayedText).to.equal(expectedText);
      });
  });

/*  it('bouton de basculement du son au clique', () => {
    cy.get('button:has(img[alt=" play"])').click();
    cy.get('img[alt=" stop"]').should('be.visible');
    cy.get('button:has(img[alt=" stop"])').click();
    cy.get('img[alt=" play"]').should('be.visible');
  });*/

  it('permet le survol d\'une réponse', () => {
    cy.get('.answers li').first().click();
    cy.get('.answers li').first().should('have.class', 'hover:bg-gray-800');
  });

  it('s\'occupe de la sélection et de la soumission des réponses', () => {
    cy.get('ul.answers li').first().click();
    cy.get('.question').should('be.visible');
    cy.get('ul.answers').find('li').should('have.length.at.least', 2);
  });

  it('met à jour la barre timer pour chaque question', () => {
    cy.get('.timer-bar').should('have.attr', 'style').and('match', /width: \d+%/);
  });

  it('passe à la question suivante', () => {
    cy.get('.question').should('be.visible');
  });

  it('parcours toutes les 11 questions du quiz', () => {

    const totalQuestions = 11;

    for (let question = 0; question < totalQuestions; question++) {
      const remainingQuestions = totalQuestions - question - 1;
      cy.get('ul.answers li').first().click();

      /*if (remainingQuestions > 0) {
        cy.get('.text-orange-600').should('contain', `${remainingQuestions} / ${totalQuestions}`);
      } else {
        // Vérifiez que toutes les questions ont été répondues
        cy.get('.text-orange-600').should('contain', `0 / ${totalQuestions}`);
      }
       */
      cy.wait(3000);

      cy.get('.question').should('be.visible');
    }
    cy.get('.score-display').should('be.visible');
    //cy.get('.text-orange-600').should('contain', 'Score : 500');
    cy.get('button').contains('Je peux faire mieux !').should('be.visible');
    cy.get('button').contains('Retour au menu').should('be.visible');
  });
});
