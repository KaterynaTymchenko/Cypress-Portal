describe("Apps Page", () => {
  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.removeCypressEntities("/api/apps");
    cy.loginPartnerAdmin();

    cy.createPartner()
      .then(response => {
        const { id } = response.body.data;

        cy.server().route({
          method: "GET",
          url: "/api/partners",
        }).as("fetchPartners");

        cy.visit("/apps");
        cy.wait("@fetchPartners");

        cy.selectPartner(id);
      });
  });

  it("Should see add apps button and apps table", () => {
    cy.get("#new-app-btn")
      .should("be.visible")
      .and("contain", "New app");

    cy.get("#apps-table").should("be.visible");
  });

  it("Should open app partner modal and add new app", () => {
    cy.server().route("POST", "/api/apps").as("createApp");
    cy.server().route("GET", "/api/apps/**/scopes").as("fetchScopes");

    cy.get("#new-app-btn").click();
    cy.get("#dialog-title")
      .should("be.visible")
      .and("contain", "New app");

    cy.get("#scopes-field > label").click();
    cy.get("#scopes-list-container ul > li").first().click();

    cy.get("body").click();

    cy.get("#name-field").type("cypress test app");
    cy.get("#modal-button-register").click();

    cy.wait("@createApp");
    cy.wait("@fetchScopes");

    cy.get("#alert-notification")
      .should("be.visible")
      .and("contain", "App successfully created");

    cy.get("#dialog-title")
      .should("be.visible")
      .and("contain", "Edit app");

    cy.get("#modal-button-close").click();

    cy.get("tr:last-child td:first-child")
      .should("contain", "cypress test app");
  });

  it("Should update app", () => {
    cy.server();

    cy.route({
      method: "PUT",
      url: "/api/apps/*"
    }).as("updateApp");

    cy.route({
      method: "GET",
      url: "/api/apps/*/scopes"
    }).as("findApplicationScopes");

    cy.get("td:contains(cypress test app)").click();

    cy.wait("@findApplicationScopes");

    cy.get("#name-field").type(" updated");
    cy.get("#modal-button-save").click();

    cy.wait("@updateApp");

    cy.get("#alert-notification")
      .should("be.visible")
      .and("contain", "App successfully updated");

    cy.get("tr:last-child td:first-child")
      .should("contain", "cypress test app updated");
  });

  it("Should return validation error", () => {
    cy.get("#new-app-btn").click();

    cy.get("#modal-button-register").click();

    cy.get("#name-field-helper-text").should("be.visible");
  });

  it("Should close modal form", () => {
    cy.get("#modal-button-close").click();
  });
});
