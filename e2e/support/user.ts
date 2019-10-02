// -- login --
Cypress.Commands.add("login", (uid, password) => {
  return cy.request("POST", "/api/auth/login", { uid, password }).then((resp) => {
    // set token
    localStorage.setItem("auth", JSON.stringify({ ...resp.body.data }));
  });
});

// -- logout --
Cypress.Commands.add("logout", () => localStorage.removeItem("auth"));

// -- login with valid credentials --
Cypress.Commands.add("loginContributor", () => {
  return cy.fixture("contributor").then((user) => {
    return cy.request("POST", "/api/auth/login", user).then((resp) => {
      // set token
      localStorage.setItem("auth", JSON.stringify({ ...resp.body.data }));
      return resp;
    });
  });
});

Cypress.Commands.add("loginPartnerAdmin", () => {
  return cy.fixture("partnerAdmin").then((user) => {
    return cy.request("POST", "/api/auth/login", user).then((resp) => {
      // set token
      localStorage.setItem("auth", JSON.stringify({ ...resp.body.data }));
    });
  });
});

Cypress.Commands.add("createUserEnv", (email, role, user) => {
  let partner = { id: 0, name: "" };
  let app = { id: 0, clientId: "", name: "" };
  let tile = { tileId: "1", clientId: "" };

  const assignUserToPartner = (response: any) => {
    partner = response.body.data;

    return cy.authRequest({
      method: "POST",
      url: "/api/users",
      body: {
        firstName: "test",
        lastName: "contributor",
        email,
        partners: [
          {
            partner: { id: partner.id },
            role,
          },
        ],
      },
    });
  };

  const createApp = (response: any) => {
    const scopes = response.body.data || [];
    return cy.authRequest({
      method: "POST",
      url: "/api/apps",
      body: {
        name: "Cypress Test App",
        partnerId: partner.id,
        scopes: scopes.map((scope: any) => scope.id),
      },
    });
  };

  const assignCollaboratorToApp = (response: any) => {
    app = response.body.data;
    return cy.authRequest({
      method: "PUT",
      url: "api/apps/collaborators",
      body: { appId: app.id, users: [user] },
    });
  };

  const createTileDefinition = (response: any) => {
    tile = response;
    const body = {
      layout: "<div class=\"tileContainer\">\n Cypress Test Tile\n</div>\n",
      staticResources: [],
    };

    return cy.createTileDefinition({ tileId: tile.tileId, body });
  };

  cy.loginPartnerAdmin();

  cy.createPartner()
    .then(assignUserToPartner)
    .then(() => cy.authRequest({ method: "GET", url: "/api/scopes/allowed" }))
    .then(createApp)
    .then(assignCollaboratorToApp)
    .then(() => cy.createTile({ clientId: app.clientId, name: "Cypress Test Tile" }))
    // Ugly hack to deal with sometimes appearing 404 request for just created tiles
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    .then(createTileDefinition)
    .then(() => ({
      partner,
      app,
      tile,
    }));
});
