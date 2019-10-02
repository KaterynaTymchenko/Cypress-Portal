describe("Partners Page", () => {
  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.loginPartnerAdmin();
    cy.visit("/partners");
  });

  it("Should see add partners button and partners table", () => {
    cy.get("#add-partner-btn")
      .should("be.visible")
      .and("contain", "Add partner");

    cy.get("#partners-table")
      .should("be.visible");
  });

  it("Should open create partner modal and add new partner", () => {
    cy.server().route("POST", "/api/partners").as("createPartner");

    cy.get("#add-partner-btn").click();

    cy.get("#dialog-title")
      .should("be.visible")
      .and("contain", "Create partner");

    cy.get("#scopes-field > label").click();

    cy.get("li:first-child").click();

    cy.get("body").click(1, 1); // close dropdown

    cy.get("#name-field").type("cypress test partner");

    cy.get("#modal-button-save").click();

    cy.wait("@createPartner");

    cy.get("#alert-notification")
      .should("be.visible")
      .and("contain", "Partner successfully created");

    cy.get("#partners-table")
      .contains("cypress test partner")
      .should("be.visible");
  });

  it("Should validate name", () => {
    cy.server().route("GET", "/api/partners/validate/*/*").as("validateName");

    cy.get("#add-partner-btn").click();

    cy.get("#name-field").type("cypress test partner");

    cy.get("#modal-button-save").click();

    cy.wait("@validateName");
    cy.get("form p").should("be.visible").and("contain", "This name is already in use");

    cy.get("#modal-button-close").click();
  });

  it("Should open update partner modal and update partner", () => {
    cy.server().route({
      method: "PUT",
      url: "/api/partners"
    }).as("updatePartner");

    cy.get("#partners-table")
      .contains("cypress test partner")
      .click();

    cy.get("#dialog-title")
      .should("be.visible")
      .and("contain", "Edit partner");

    cy.get("#scopes-field > label").click();

    cy.get("li:last-child").click();

    cy.get("body").click(1, 1); // close dropdown

    cy.get("#name-field").type(" updated");

    cy.get("#modal-button-save").click();

    cy.wait("@updatePartner");

    cy.get("#alert-notification")
      .should("be.visible")
      .and("contain", "Partner successfully updated");

    cy.get("#partners-table")
      .contains("cypress test partner updated")
      .should("be.visible");
  });

  it("Should return validation error", () => {
    cy.get("#add-partner-btn").click();

    cy.get("#dialog-title")
      .should("be.visible")
      .and("contain", "Create partner");

    cy.get("#name-field").type("✬");

    cy.get("#modal-button-save").click();

    cy.get("#name-field-helper-text")
      .should("be.visible");
  });

  it("Should close modal form", () => {
    cy.get("#modal-button-close").click();
  });
});
