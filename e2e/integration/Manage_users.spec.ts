describe("Manage users page", () => {
  let partner = { id: 0 };

  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.removeCypressEntities("/api/apps");
    cy.loginPartnerAdmin();
    cy.createPartner()
      .then((resp) => {
        partner = resp.body.data;
      });
    cy.visit("/partners");
  });

  it("Should open create user form", () => {
    cy.get(`#add-partner-user-btn-${partner.id}`).click();

    cy.get("#dialog-title")
      .should("be.visible")
      .and("contain", "Add user");
  });

  it("Should close user form", () => {
    cy.get("#modal-button-close").click();
    cy.get("#dialog-title").should("not.exist");
  });

  it("Should validate email", () => {
    cy.server().route("GET", "/api/users/validate/*/*").as("validateEmail");

    cy.get(`#add-partner-user-btn-${partner.id}`).click();

    // wrong email format
    cy.get("#email-field").type("cypressTest");
    cy.get("form p").should("be.visible").and("contain", "Invalid email");

    // empty field
    cy.get("#email-field").clear().blur();
    cy.get("form p").should("be.visible").and("contain", "Required");

    // user without partner
    // cy.fixture("user").then((admin) => cy.get("#email-field").type(admin.uid));
    // cy.wait("@validateEmail");
    // cy.get("form p")
    //   .should("be.visible")
    //   .and("contain", "This SSO account already exists. You can use this one or create a new account");

    // existed sso account
    cy.get("#email-field").clear().type("partnerapi_qa0@cengage.com");
    cy.wait("@validateEmail");
    cy.get("form p")
      .should("be.visible")
      .and("contain", "This SSO account already exists. You can use this one or create a new account");

  });

  it("Should create user", () => {
    cy.server().route("GET", "/api/users/validate/*/*").as("validateEmail");
    cy.server().route({
      method: "POST",
      url: "/api/users"
    }).as("createUser");

    cy.get("#email-field").clear().type("partnerapi_qa0@cengage.com");
    cy.wait("@validateEmail");

    cy.get("#modal-button-save").click();
    cy.wait("@createUser");

    cy.get("#alert-notification")
      .should("be.visible")
      .and("contain", "The invitation email has been sent to the user");
  });
});
