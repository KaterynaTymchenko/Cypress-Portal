describe("The Tile Page", () => {
  let partner = { id: 0, name: "" };
  let tile = { tileId: "1", clientId: "" };

  const visitTilePage = () => {
    cy.loginPartnerAdmin();
    cy.server().route("GET", "/api/tiles").as("getTiles");
    cy.server().route("GET", "/api/partners").as("getPartners");
    cy.visit("/tiles");
    cy.wait("@getTiles", { timeout: 60000 });
    cy.wait("@getPartners");
    cy.selectPartner(partner.id);
  };

  before(() => {
    cy.removeCypressEntities("/api/partners");
    cy.removeCypressEntities("/api/apps");
    cy.createPartner()
      .then((response) => {
        partner = response.body.data;
        return cy.authRequest({ method: "GET", url: "/api/scopes/allowed" });
      })
      .then((response) => {
        const scopes = response.body.data || [];

        return cy.authRequest({
          method: "POST",
          url: "/api/apps",
          body: {
            name: "Cypress Test Application",
            partnerId: partner.id,
            scopes: scopes.map((scope: any) => scope.id)
          }
        });
      })
      .then((response) => {
        const { clientId } = response.body.data;

        return cy.createTile({ clientId, name: "Cypress Test TIle" });
      }).then((response) => {
        tile = response;

        visitTilePage();
      });
  });

  it("Should see tiles table", () => {
    cy.get("#tiles-table").should("be.visible");
    cy.get("#tiles-table #main-table tbody").find("tr").should("have.length", 1);

    // tile just created and do not have definition
    cy.get("#tiles-table #main-table tbody td").last().should("contain", "―");

    // tile preview buttons
    cy.get(`#in-progress-preview-btn-${tile.tileId} > button`).should("be.disabled");
    cy.get(`#last-approved-preview-btn-${tile.tileId}`).should("not.exist");

  });

  it("Should see status buttons", () => {
    cy.fixture("testTile").then(body => {
      cy.createTileDefinition({ tileId: tile.tileId, body }).then(() => {
        visitTilePage();
        // all status button and their statuses
        cy.get(`#${tile.tileId}-DRAFT-active`).should("be.enabled");
        cy.get(`#${tile.tileId}-PENDING`).should("be.enabled");
        cy.get(`#${tile.tileId}-STAGE`).should("be.disabled");
        cy.get(`#${tile.tileId}-APPROVED`).should("be.disabled");

        // enabled preview button
        cy.get(`#in-progress-preview-btn-${tile.tileId} > button`).should("be.enabled");
      });
    });
  });

  it("Should be possible switch to 'Pending' status", () => {
    cy.server().route("PUT", "/api/tiles/*/definitions/*").as("changeTileStatus");
    cy.get(`#${tile.tileId}-PENDING`).click();
    cy.wait("@changeTileStatus");

    cy.get(`#${tile.tileId}-DRAFT`).should("be.enabled");
    cy.get(`#${tile.tileId}-PENDING-active`).should("be.enabled");
    cy.get(`#${tile.tileId}-STAGE`).should("be.enabled");
    cy.get(`#${tile.tileId}-APPROVED`).should("be.disabled");
  });

  it("Should be possible switch back to 'Draft' from 'Pending' status", () => {
    cy.server().route("PUT", "/api/tiles/*/definitions/*").as("changeTileStatus");
    cy.get(`#${tile.tileId}-DRAFT`).click();
    cy.wait("@changeTileStatus");

    cy.get(`#${tile.tileId}-DRAFT-active`).should("be.enabled");
    cy.get(`#${tile.tileId}-PENDING`).should("be.enabled");
    cy.get(`#${tile.tileId}-STAGE`).should("be.disabled");
    cy.get(`#${tile.tileId}-APPROVED`).should("be.disabled");
  });

  it("Should be possible switch to 'Stage' status", () => {
    cy.server().route("PUT", "/api/tiles/*/definitions/*").as("changeTileStatus");
    // move to pending
    cy.get(`#${tile.tileId}-PENDING`).click();
    cy.wait("@changeTileStatus");
    // move to stage
    cy.get(`#${tile.tileId}-STAGE`).click();
    cy.wait("@changeTileStatus");

    cy.get(`#${tile.tileId}-DRAFT`).should("be.enabled");
    cy.get(`#${tile.tileId}-PENDING`).should("be.disabled");
    cy.get(`#${tile.tileId}-STAGE-active`).should("be.enabled");
    cy.get(`#${tile.tileId}-APPROVED`).should("be.enabled");
  });

  it("Should be possible switch back to 'Draft' from 'Stage' status", () => {
    cy.server().route("PUT", "/api/tiles/*/definitions/*").as("changeTileStatus");
    cy.get(`#${tile.tileId}-DRAFT`).click();
    cy.wait("@changeTileStatus");

    cy.get(`#${tile.tileId}-DRAFT-active`).should("be.enabled");
    cy.get(`#${tile.tileId}-PENDING`).should("be.enabled");
    cy.get(`#${tile.tileId}-STAGE`).should("be.disabled");
    cy.get(`#${tile.tileId}-APPROVED`).should("be.disabled");
  });

  it("Should be possible approve tile and cancel confirmation", () => {
    cy.server().route("PUT", "/api/tiles/*/definitions/*").as("changeTileStatus");
    // move to pending
    cy.get(`#${tile.tileId}-PENDING`).click();
    cy.wait("@changeTileStatus");
    // move to stage
    cy.get(`#${tile.tileId}-STAGE`).click();
    cy.wait("@changeTileStatus");
    // approve
    cy.get(`#${tile.tileId}-APPROVED`).click();

    // confirmation modal
    cy.get("#dialog-title")
      .should("contain", "Approve tile definition?");

    // cancel confirmation
    cy.get("#modal-button-cancel").click();
    cy.get("#dialog-title").should("not.exist");
    cy.get(`#${tile.tileId}-STAGE-active`).should("be.enabled");
  });

  it("Should be possible approve tile and submit confirmation", () => {
    cy.server().route("PUT", "/api/tiles/*/definitions/*").as("changeTileStatus");
    // approve
    cy.get(`#${tile.tileId}-APPROVED`).click();

    // submit confirmation
    cy.get("#modal-button-approve").click();
    cy.wait("@changeTileStatus");
    cy.get(`#${tile.tileId}-DRAFT`).should("be.disabled");
    cy.get(`#${tile.tileId}-PENDING`).should("be.disabled");
    cy.get(`#${tile.tileId}-STAGE`).should("be.disabled");
    cy.get(`#${tile.tileId}-APPROVED`).should("be.enabled");

    visitTilePage(); // refresh page

    // tile do not have definition in progress
    cy.get("#tiles-table tbody tr").find("td").should("contain", "-"); // TODO last column should contain -

    // tile preview buttons
    cy.get(`#in-progress-preview-btn-${tile.tileId} > button`).should("be.disabled");
    cy.get(`#last-approved-preview-btn-${tile.tileId}`).should("be.enabled");
  });

  it("Should open tile preview modal", () => {
    cy.get(`#last-approved-preview-btn-${tile.tileId}`).click();

    cy.get("#dialog-title").should("contain", "Tile Preview");
    // default picture for tile
    cy.get("#tile-preview").should("be.visible");
  });

  it("Should validate invalid sso", () => {
    cy.server().route("GET", "/api/tiles/*/definitions/*/users/*").as("tilePreview");
    cy.get("#sso-guid-field").type("invalid-sso");
    cy.get("#modal-button-preview").click();

    cy.wait("@tilePreview");
    cy.get("#sso-guid-field-helper-text").should("contain", "Invalid sso guid");
  });

  it("Should show tile preview", () => {
    cy.server().route("GET", "/api/tiles/*/definitions/*/users/*").as("tilePreview");
    cy.get("#sso-guid-field").clear().type("e209bf32d6eb0939:-60713874:1669ab64992:-3e69");
    cy.get("#modal-button-preview").click();

    cy.wait("@tilePreview");

    cy.get("#tile").should("exist");
    // show code
    cy.get("#modal-button-show-code").should("contain", "Show code").click();
    cy.get("#code").scrollIntoView().should("be.visible");

    // hide code
    cy.get("#modal-button-hide-code").should("contain", "Hide code").click();
    cy.get("#code").should("not.exist");
  });

  it("Should close tile preview modal", () => {
    cy.get("#modal-button-close").click();

    cy.get("#dialog-title").should("not.exist");
  });
});
