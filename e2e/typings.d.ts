interface UserEnv {
  partner: any;
  app: any;
  tile: any;
}

declare namespace Cypress {
  interface Chainable {
    login: () => void;
    loginPartnerAdmin: () => Chainable<Cypress.Response>;
    loginContributor: () => Chainable<Cypress.Response>;
    selectPartner: (id: number) => void;
    authRequest: (options: Partial<Cypress.RequestOptions>) => Promise<Cypress.Response>;
    createTile: (options: { clientId: string; name: string }) => Promise<any>;
    createTileDefinition: (options: { tileId: string; body: object }) => Promise<any>;
    createUserEnv: (email: string, role: string, user: object) => UserEnv;
    clearUserEnv: (partnerId: number, appId: number) => void;
    logout: () => void;
    removeCypressEntities: (url: string) => void;
    createPartner: () => Promise<Cypress.Response>;
  }
}
