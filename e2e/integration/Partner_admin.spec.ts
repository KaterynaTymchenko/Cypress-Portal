describe("Partner admin specialities", () => {
  let user = { id: 0 };

  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.loginPartnerAdmin()
      .then((res) => {
        user = res.body.data.session.user;
        return cy.createUserEnv("partner_admin@cengage.com", "partneradmin", user);
      });
  });

  beforeEach(() => {
    cy.loginPartnerAdmin();
  });

  describe("Layout", () => {
    it("Menu drawer should contain 5 items for authorized partner admins", () => {
      cy.visit("/");
      cy.get("nav a").should("have.length", 5);
    });
  });

});