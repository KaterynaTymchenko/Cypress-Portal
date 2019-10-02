import { IShortPartner } from "./Partner";
import { IShortUser } from "./User";
import { IScope } from "./Scope";

export interface IShortApplication {
  id: number;
  name: string;
  clientId: string;
  clientSecret: string;
}

export interface IApplication extends IShortApplication {
  partner: IShortPartner;
  users?: IShortUser[];
  scopes?: IScope[];
  partnerId: number;
}

export type IApplicationCreate = Pick<IApplication,
  "name"
  > & {
  partnerId: number;
  scopes: number[];
};

export type IApplicationUpdate = Pick<IApplication, "id" | "name"> & { scopes: number[]};
