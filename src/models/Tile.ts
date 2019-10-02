import { TileStatuses } from "../../constants";
import { IApplication } from "./Application";

export interface ITileWithApp extends ITile {
  application: IApplication;
}

export interface ITile {
  tileId: string;
  clientId: string;
  name: string;
  createdDate: Date;
  latestApprovedVersion?: number;
  latestDraftVersion?: number;
  latestDraftStatus?: TileStatuses;
  latestDraftId?: string;
  lastModifiedDate?: Date;
}

export interface ITileDefinition {
  definitionId: string;
  layout: string;
  clientId: string;
  version: number;
  status: TileStatuses;
  staticResources: Array<any>;
  createdDate: Date;
  lastModifiedDate: Date;
}

export interface ITilePreviewFormValues {
  ssoGuid: string;
  tileId: string;
  tileDefinitionId: string;
}

export interface IRenderedTile {
  tileId: string;
  definitionId: string;
  name: string;
  renderWithoutUserData: boolean;
  content: string;
  userId?: string;
}
