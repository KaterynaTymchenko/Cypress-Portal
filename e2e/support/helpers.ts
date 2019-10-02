export const createRequest = (options: any) => {
  const auth = localStorage.getItem("auth");
  const authObj = auth && JSON.parse(auth);

  return cy.request({
    ...options,
    headers: {
      Authorization: `Bearer ${authObj.token}`,
    },
  });
};

export const getAuthToken = () => {
  const OAUTH_SERVICE_URL = Cypress.env("OAUTH_SERVICE_URL");
  return cy
    .request({
      method: "POST",
      url: `${OAUTH_SERVICE_URL}/token`,
      form: true,
      body: {
        grant_type: "client_credentials",
        scope: "tile_admin",
      },
      headers: {
        Authorization: `Basic ${Cypress.env("OAUTH_SERVICE_AUTH_TOKEN")}`,
      },
    })
    .then((res) => res.body && res.body.access_token);
};
