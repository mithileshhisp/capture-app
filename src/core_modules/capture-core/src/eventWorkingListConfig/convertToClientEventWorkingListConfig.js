// @flow
import {
    getBooleanFilterData,
    getDateFilterData,
    getMultiSelectOptionSetFilterData,
    getSingleSelectOptionSetFilterData,
    getNumericFilterData,
    getTextFilterData,
    getTrueOnlyFilterData,
} from '../components/FiltersForTypes';
import { dataElementTypes as elementTypes, DataElement, RenderFoundation } from '../metaData';
import eventStatusElement from '../events/eventStatusElement';
import {
    MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS,
} from '../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.const';


type EventQueryCriteria = {
    filters?: ?Array<Object>,
    order?: ?string,
    eventDate?: ?Object,
    status?: ?string,
}

type ServerWorkingListConfig = {
    id: string,
    name: string,
    eventQueryCriteria: EventQueryCriteria,
}

const getNumericFilter = (filter: Object) => {
    const value = { from: filter.ge, to: filter.le };
    return {
        ...getNumericFilterData(value),
        value,
    };
};

const getBooleanFilter = (filter: Object, element: DataElement) => {
    const value = [...(filter.in || [])];
    return {
        ...getBooleanFilterData(value, element.type, element.optionSet),
        value,
    };
};

const getMultiSelectOptionSetFilter = (filter: Object, element: DataElement) => {
    const value = [...(filter.in || [])];
    return {
        // $FlowFixMe
        ...getMultiSelectOptionSetFilterData(value, element.type, element.optionSet),
        value,
    };
};

const getSingleSelectOptionSetFilter = (filter: Object, element: DataElement) => {
    const value = filter.eq;
    return {
        // $FlowFixMe
        ...getSingleSelectOptionSetFilterData(value, element.optionSet),
        value,
    };
};

const getTrueOnlyFilter = (filter: Object, element: DataElement) => {
    const value = [...(filter.in || [])];
    return {
        ...getTrueOnlyFilterData(value, element.type),
        value,
    };
};

const getTextFilter = (filter: Object) => {
    const value = filter.like;
    return {
        ...getTextFilterData(value),
        value,
    };
};

const getDateFilter = (filter: Object) => {
    const value = {
        main: filter.period || 'CUSTOM_RANGE',
        from: filter.ge,
        to: filter.le,
    };
    return {
        ...getDateFilterData(value),
        value,
    };
};

const getFilterByType = {
    [elementTypes.TEXT]: getTextFilter,
    [elementTypes.NUMBER]: getNumericFilter,
    [elementTypes.INTEGER]: getNumericFilter,
    [elementTypes.INTEGER_POSITIVE]: getNumericFilter,
    [elementTypes.INTEGER_NEGATIVE]: getNumericFilter,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [elementTypes.DATE]: getDateFilter,
    [elementTypes.BOOLEAN]: getBooleanFilter,
    [elementTypes.TRUE_ONLY]: getTrueOnlyFilter,
};

const getSortOrder = (order: ?string) => {
    const sortOrderParts = order && order.split(':');
    if (sortOrderParts && sortOrderParts.length === 2) {
        return {
            sortById: sortOrderParts[0],
            sortByDirection: sortOrderParts[1],
        };
    }
    return null;
};

const getDataElementFilters = (filters: ?Array<any>, stageForm: RenderFoundation) => {
    if (filters) {
        return filters.map((serverFilter) => {
            const element = stageForm.getElement(serverFilter.elementId);
            if (element) {
                if (element.optionSet && element.optionSet.options.length <= MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS) {
                    return { id: serverFilter.elementId, ...getMultiSelectOptionSetFilter(serverFilter.filter, element) };
                }
                // $FlowFixMe
                return { id: serverFilter.elementId, ...(getFilterByType[element.type] ? getFilterByType[element.type](serverFilter.filter, element) : null) };
            }
            return null;
        }).filter(clientFilter => clientFilter !== null);
    }
    return [];
};

const getMainDataFilters = (eventQueryCriteria: EventQueryCriteria) => {
    const { eventDate, status } = eventQueryCriteria;
    const filters = [];
    if (status) {
        filters.push({ id: 'status', ...getSingleSelectOptionSetFilter({ eq: status }, eventStatusElement) });
    }
    if (eventDate) {
        filters.push({ id: 'eventDate', ...getDateFilter(eventDate.data) });
    }
    return filters;
};

export default function (serverWorkingListConfig: ServerWorkingListConfig, stageForm: RenderFoundation) {
    const { name, eventQueryCriteria } = serverWorkingListConfig;
    const { sortById, sortByDirection } = getSortOrder(eventQueryCriteria.order) || {};
    const filters = [...getDataElementFilters(eventQueryCriteria.filters, stageForm), ...getMainDataFilters(eventQueryCriteria)];
    return {
        name,
        filters,
        sortById,
        sortByDirection,
    };
}