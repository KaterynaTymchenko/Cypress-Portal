describe("Users Page", () => {
  let partner = { id: 0 };
  let user = { id: 0 };

  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.removeCypressEntities("/api/apps");
    cy.loginPartnerAdmin();

    cy.createPartner()
      .then((response) => {
        partner = response.body.data;

        cy.authRequest({
          method: "POST",
          url: "/api/users",
          body: {
            firstName: "firstName",
            lastName: "lastName",
            email: "partnerapi_qa0@cengage.com",
            partners: [{
              partner: { id: partner.id },
              role: "partnercontributor"
            }]
          }
        }).then((userResponse) => {
          user = userResponse.body.data;
        });

        cy.server().route({
          method: "GET",
          url: "/api/partners",
        }).as("fetchPartners");

        cy.visit("/users");
        cy.wait("@fetchPartners");

        cy.selectPartner(partner.id);
      });
  });

  it("Should see add user button, partner dropdown and users table", () => {
    cy.get("#new-user-btn")
      .should("be.visible")
      .and("contain", "New user");

    cy.get("#Partner-dropdown")
      .should("be.visible");

    cy.get("#users-table")
      .should("be.visible");
  });

  it("Should open create users modal", () => {
    cy.get("#new-user-btn").click();

    cy.get("#dialog-title")
      .should("be.visible")
      .and("contain", "Add user");

    cy.get("#modal-button-close").click();
  });

  it("Should update user", () => {
    cy.server().route("PUT", "/api/users/*").as("updateUser");
    cy.get("#email-column").contains("partnerapi_qa0@cengage.com").click();

    cy.get("#first-name-field").clear().type("updated-first-name");
    cy.get("#modal-button-save").click();
    cy.wait("@updateUser");

    cy.get("#alert-notification").should("be.visible");
  });

  it("Should delete user", () => {
    cy.server().route("DELETE", "/api/users/*/*").as("deleteUser");

    cy.get(`#remove-user-btn-${user.id}`).click();
    cy.wait("@deleteUser");

    cy.get("#alert-notification").should("be.visible");
    cy.get(`#remove-user-btn-${partner.id}`).should("not.exist");
  });
});
