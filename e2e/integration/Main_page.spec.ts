describe("Main Page", () => {
  it("Should redirect to login page for unauthorized users", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
  });

  it("Should redirect to apps page for authorized users", () => {
    cy.loginPartnerAdmin();
    cy.visit("/");
    cy.url().should("include", "/apps");
  });
});
