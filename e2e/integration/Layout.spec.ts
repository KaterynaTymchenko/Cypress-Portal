describe("Layout (authorized user)", () => {
  before(() => {
    cy.loginPartnerAdmin();
    cy.visit("/");
  });

  it("Should contain user menu", () => {
    cy.get("#user-menu")
      .should("be.visible")
      .and("contain", "partnerportal_testadmin@cengage.com");
  });

  it("Should move to url", () => {
    // partners
    cy.get("#Partners-item").click();
    cy.url().should("include", "/partners");

    // users
    cy.get("#Users-item").click();
    cy.url().should("include", "/users");

    // apps
    cy.get("#Apps-item").click();
    cy.url().should("include", "/apps");

    // tiles
    cy.get("#Tiles-item").click();
    cy.url().should("include", "/tiles");

    // documentation
    cy.get("#Documentation-item").click();
    cy.url().should("include", "/documentation");
  });

  it("Should successfully log out", () => {
    cy.get("#user-menu").click();
    cy.get("#sign-out-btn").click();

    // we should be redirected to /login
    cy.url().should("include", "/login");
  });
});

describe("Layout (unauthorized user)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should not contain user menu", () => {
    cy.get("#user-menu").should("not.exist");
  });

  it("Should not contain drawer menu", () => {
    cy.get("#menu-drawer-open > div").should("not.exist");
  });
});
