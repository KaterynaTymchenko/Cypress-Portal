describe("The Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Should successfully sign in", () => {
    // alias this route so we can wait on it later
    cy.server().route("POST", "/api/auth/login").as("postLogin");

    cy.fixture("partnerAdmin").then((user) => {
      cy.get("#uid-field").type(user.uid);
      cy.get("#password-field").type(user.password);

      cy.get("#submit-btn").click();
    });

    // wait for server response
    cy.wait("@postLogin");

    // we should be redirected to /apps
    cy.url().should("include", "/apps");

  });

  it("Should failure sign in with invalid credentials", () => {
    // alias this route so we can wait on it later
    cy.server().route("POST", "/api/auth/login").as("postLogin");

    cy.get("#uid-field").type("user");
    cy.get("#password-field").type("password");

    cy.get("#submit-btn").click();

    // wait for server response
    cy.wait("@postLogin");

    cy.get("#alert-notification")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });
});
