describe("Contributor specialities", () => {
  let tile = { tileId: "1", clientId: "" };
  let user = { id: 0 };

  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.removeCypressEntities("/api/apps");
    cy.loginContributor()
      .then((res) => {
        user = res.body.data.session.user;
        return cy.createUserEnv("partnerportal_testcontributor@cengage.com", "partnercontributor", user);
      })
      .then((res) => {
        tile = res.tile;
      });
  });

  beforeEach(() => {
    cy.loginContributor();
  });

  describe("Permissions for pages", () => {
    it("Users page should not be reached", () => {
      cy.visit("/users");
      cy.url().should("include", "/apps");
    });

    it("Partners page should not be reached", () => {
      cy.visit("/partners");
      cy.url().should("include", "/apps");
    });
  });

  describe("Layout", () => {
    it("Menu drawer should contain 3 items for authorized contributors", () => {
      cy.visit("/");
      cy.get("nav a").should("have.length", 3);
    });
  });

  describe("Apps page", () => {
    it("Add app button should not exist", () => {
      cy.get("#new-app-btn").should("not.exist");
    });

    it("Apps table should contain only contributors apps", () => {
      cy.get("#apps-table tbody tr")
        .should("have.length", 1);

      cy.get("#apps-table tbody tr:first-child")
        .should("contain", "Cypress Test App");
    });

    it("App modal name field should be disabled", () => {
      cy.get("#apps-table tbody tr")
        .click();

      cy.get("#app-form #name-field")
        .should("be.disabled");
    });

    it("App modal should not contain contributor form", () => {
      cy.get("#contributor-form")
        .should("not.exist");

      cy.get("#modal-button-close").click();
    });
  });

  describe("Tiles page", () => {
    before(() => {
      cy.server().route("GET", "/api/tiles").as("getTiles");
      cy.get("#Tiles-item").click();
      cy.wait("@getTiles", { timeout: 60000 });
    });

    it("Require approval switcher should not be visible", () => {
      cy.contains("Require approval").should("not.exist");
    });

    it("Tiles table should contain only contributors apps", () => {
      cy.get("#tiles-table #main-table tbody tr")
        .should("have.length", 1);

      cy.get("#tiles-table #main-table tbody tr:first-child")
        .should("contain", "Cypress Test Tile");
    });

    it("Stage and Approved buttons should be disabled", () => {
      cy.get(`#${tile.tileId}-STAGE`).should("be.disabled");
      cy.get(`#${tile.tileId}-APPROVED`).should("be.disabled");
    });
  });
});
