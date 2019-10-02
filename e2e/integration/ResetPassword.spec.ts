describe("Reset Password Page", () => {
  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.logout();
    cy.visit("/login");

    cy.createPartner()
      .then((resp) => {
        const partner = resp.body.data;

        cy.authRequest({
          method: "POST",
          url: "/api/users",
          body: {
            email: "partnerapi_qa0@cengage.com",
            firstName: "PartnerAPI",
            lastName: "TestUser",
            partners: [{
              partner: { id: partner.id },
              role: "partneradmin",
            }]
          }
        });
      });
  });

  it("Should open reset password page", () => {
    cy.server().route("POST", "/api/auth/forgotPassword").as("forgotPassword");

    cy.get("a[href*='forgotPassword']").click();
    cy.url().should("include", "/forgotPassword");

    cy.get("#email-field").type("partnerapi_qa0@cengage.com");
    cy.get("#modal-button-reset").click();

    cy.wait("@forgotPassword");

    cy.get("#alert-notification")
      .should("be.visible");
  });
});
