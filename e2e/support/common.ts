import { createRequest } from "./helpers";

// -- request with auth token --
Cypress.Commands.add("authRequest", (options) => {
  if (localStorage.getItem("auth")) {
    return createRequest(options);
  }

  return cy.loginPartnerAdmin().then(() => {
    return createRequest(options);
  });
});

// command to clear db from the entities which were created in previous cypress run
Cypress.Commands.add("removeCypressEntities", (url: string) => {
  cy.authRequest({
    method: "GET",
    url,
  }).then(async (response) => {
    const toDelete = response.body.data.filter((entity: any) =>
      entity.name.toLowerCase().includes("cypress")
    );
    for (const entity of toDelete) {
      await cy.authRequest({
        method: "DELETE",
        url: `${url}/${entity.id}`,
      });
    }
  });
});
