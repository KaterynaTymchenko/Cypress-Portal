export interface IScope {
  id: number;
  name: string;
  description: string;
  isAllowed: boolean;
}

export type Scopes = "client_create"
  | "client_read"
  | "client_update"
  | "client_delete"
  | "tile_admin"
  | "tile_approve";
