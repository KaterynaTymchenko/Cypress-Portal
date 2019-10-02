import { IApplication } from "./Application";
import { IScope } from "./Scope";
import { IShortUser, Role } from "./User";

export interface IShortPartner {
  id: number;
  name: string;
  scopes?: IScope[];
}

export interface IPartner extends IShortPartner {
  applications: IApplication[];
  users: IUserRole[];
}

export type IPartnerFormValue = Pick<IPartner, "name"> & { scopes: number[] } ;

export interface IPartnerUser extends IUserRole, IPartnerRole { }

export interface IUserRole {
  user: IShortUser;
  role: Role;
}
export interface IPartnerRole {
  partner: IShortPartner;
  role: Role;
}
