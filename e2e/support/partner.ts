import { IScope } from "../../src/models";

// -- select partner
Cypress.Commands.add("selectPartner", (partnerId) => {
  cy.get("#Partner-dropdown").click();
  cy.get(`#${partnerId}-menu-item`).click();
});

Cypress.Commands.add("createPartner", () => {
  return cy.authRequest({
    method: "GET",
    url: "/api/scopes/allowed"
  })
    .then((response) => {
      const scopes = response.body.data.map((scope: IScope) => scope.id);
      return cy.authRequest({
        method: "POST",
        url: "/api/partners",
        body: {
          name: "Cypress test partner",
          scopes
        }
      });
    });
});
