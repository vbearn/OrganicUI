import * as CoreMod from './core';
import * as Components from "bloomer";
import { View, funcAsViewClass, ViewWithFluentAPI } from "./lib/view";
import { ActionManager } from "./lib/action-manager";

import * as  DataMod from './lib/data';
import * as UiKit from './lib/ui-kit';
import * as  FabricUiMod from 'office-ui-fabric-react';
import * as  ReactMod from 'react';

declare global {


  export type FuncView<S, AC> = (props: any, state: S, repatch: (delta, target?) => void, actions: AC) => React.ReactNode;
  export type FuncComponent<P, S> = (p: P, s: S, repatch: (delta, target?) => void) => React.ReactNode;

  export interface ResultSet<T> {
    results: T[];
  }
  export interface PromisedResultSet<T> extends Promise<IListData<T>> {

  }
  export interface ActionResult extends Promise<any> {

  }
  export interface IListData<TRow=any> {
    totalRows: number;
    rows: TRow[];

  }
  export type PureView<TState, TAPI> =
    (state: TState, api?: TAPI, discover?, repatch?: (delta, target?) => void) => React.ReactNode;
  export interface ICRUDActionsForSingleView<T> {
    handleCreate(entity: T): ActionResult;
    handleRead(id): Promise<T>;
    handleUpdate(id, entity: T): ActionResult;
    handleDelete(id): ActionResult;
    getId?(entity: T): any;
    customActions?:
    {
      queries?: { [key: string]: Function },
      record?: { [key: string]: Function },
      multipleRecords?: { [key: string]: Function }
    }
 
  }
  
  export const FabricUI: typeof FabricUiMod;
  export const React: typeof ReactMod;
  export const Core: typeof CoreMod & {
    Components: typeof Components,
    View: typeof View,
    UiKit: typeof UiKit,
    ViewWithFluentAPI: typeof ViewWithFluentAPI,
    ActionManager: typeof ActionManager,
    funcAsViewClass: typeof funcAsViewClass,
    Data: typeof DataMod
  };

}
declare module Array {
  export var joinNotEmpty: Function;
}
