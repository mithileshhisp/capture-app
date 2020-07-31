// @flow
import type { SelectedSearchScopeId, TrackedEntityTypesWithCorrelatedPrograms } from '../SearchPage.types';

export type OwnProps = $ReadOnly<{|
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  onSelect: (scopeId: string) => void,
  selectedSearchScopeId: SelectedSearchScopeId
|}>

export type Props = {|
  ...CssClasses,
  ...OwnProps,
|}

