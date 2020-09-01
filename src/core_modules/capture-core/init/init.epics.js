// @flow
import { ofType, ActionsObservable } from 'redux-observable';
import { concatMap } from 'rxjs/operators';
import { actionTypes, loadCoreFailed } from './init.actions';
import getOrgUnitRootsActions from './getOrgUnitRootsActions';
import { loadCoreSuccessBatch } from './init.actionBatches';

export const loadCoreEpic = (action$: typeof ActionsObservable) =>
    action$.pipe(
        ofType(actionTypes.CORE_LOAD),
        concatMap(() => getOrgUnitRootsActions()
            .then(rootsActions => loadCoreSuccessBatch(rootsActions))
            .catch(error => loadCoreFailed(error))));
