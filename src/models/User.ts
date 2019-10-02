import { Omit } from "../../types";
import { IPartnerRole } from "./Partner";
import { IApplication } from "./Application";

export enum Role {
  PORTAL_ADMIN = "portaladmin",
  PARTNER_ADMIN = "partneradmin",
  CONTRIBUTOR = "partnercontributor",
}

// Use object keys here for client
export const availableRoles = Object.keys(Role).map((key) => Role[key as keyof typeof Role]);

export interface IShortUser {
  id: number;
  ssoGuid: string;
  resetPasswordToken?: string;
  createdAt?: Date;
}

export interface IUser extends IShortUser {
  applications: IApplication[];
  partners: IPartnerRole[];
}

export interface ISsoUser extends ISecureSSOUser {
  guid: string;
  uid: string;
  roles: Role[];
}

export interface ISecureSSOUser {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface IUserSession {
  user: IUser;
  ssoUser: ISsoUser;
}

export interface IUserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  partners: IPartnerRole[];
}

export type IUpdateUserFormValues = Omit<IUserFormValues, "email">;

export interface IUserActivationInitialData {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface IUserActivationFormValues extends IUserActivationInitialData {
  password: string;
  confirmPassword: string;
}

export interface IUserFields {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface IContributors {
  users: Array<{ id: number }>;
  appId: number;
}

export interface IContributorsForm {
  users: number[];
  appId: number;
}
