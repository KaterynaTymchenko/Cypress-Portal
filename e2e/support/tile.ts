import { getAuthToken } from "./helpers";

// -- create tile --
Cypress.Commands.add("createTile", ({ clientId, name }) => {
  const TILE_API = Cypress.env("TILE_API_SERVICE_URL");
  return getAuthToken()
    .then((token) => {
      return cy.request({
        method: "POST",
        url: `${TILE_API}/tiles`,
        body: { clientId, name },
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/vnd.cengage-tile.tile-v1.0+json",
        },
      });
    })
    .then((response) => response.body);
});

// -- create tile definition--
Cypress.Commands.add("createTileDefinition", ({ tileId, body }) => {
  const TILE_API = Cypress.env("TILE_API_SERVICE_URL");
  return getAuthToken()
    .then((token) => {
      return cy.request({
        method: "POST",
        url: `${TILE_API}/tiles/${tileId}/definitions`,
        body,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/vnd.cengage-tile.tile-definition-v1.0+json",
        },
      });
    })
    .then((response) => response.body);
});
