// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import Button from '../../../../Buttons/Button.component';
import { DataElement } from '../../../../../metaData';
import makeAttributesSelector from './teiRelationshipSearchResults.selectors';
import CardList from '../../../../CardList/CardList.component';
import LoadingMask from '../../../../LoadingMasks/LoadingMask.component';

const SearchResultsPager = withNavigation()(Pagination);

type Props = {
    resultsLoading: ?boolean,
    teis: Array<any>,
    onNewSearch: () => void,
    onEditSearch: () => void,
    paging: Object,
    onChangePage: (page: number) => void,
    onAddRelationship: (entity: { id: string, displayName: string }) => void,
    trackedEntityTypeName: string,
    classes: {
        itemActionsContainer: string,
        addRelationshipButton: string,
        pagination: string,
        topActionsContainer: string,
        actionButton: string,
    },
}

const getStyles = (theme: Theme) => ({
    itemActionsContainer: {
        padding: theme.typography.pxToRem(10),
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    topActionsContainer: {
        margin: theme.typography.pxToRem(10),
        backgroundColor: theme.palette.grey.lighter,
    },
    actionButton: {
        margin: theme.typography.pxToRem(10),
        color: theme.palette.primary.dark,
        borderRadius: 0,
        border: `1px solid ${theme.palette.primary.dark}`,
    },
});

class TeiRelationshipSearchResults extends React.Component<Props> {
    getAttributes: Function;
    constructor(props: Props) {
        super(props);
        this.getAttributes = makeAttributesSelector();
    }

    onAddRelationship = (item, attributes) => {
        const displayName = this.getDisplayName(item, attributes);
        this.props.onAddRelationship({
            id: item.id,
            displayName,
        });
    }

    getDisplayName = (item, attributes) => {
        const valueIds = Object.keys(item.values);
        return attributes
            .filter(a => valueIds.some(id => id === a.id))
            .slice(0, 2)
            .map(a => item.values[a.id])
            .join(' ');
    };

    getItemActions = (itemProps: Object, attributes: Array<DataElement>) => {
        const classes = this.props.classes;
        return (
            <div className={classes.itemActionsContainer}>
                <Button
                    color="primary"
                    onClick={() => this.onAddRelationship(itemProps.item, attributes)}
                >
                    {i18n.t('Link')}
                </Button>
            </div>
        );
    }

    renderResults = () => {
        const attributes = this.getAttributes(this.props);
        const { teis, trackedEntityTypeName } = this.props;
        return (
            <React.Fragment>
                {this.renderTopActions()}
                <CardList
                    items={teis}
                    dataElements={attributes}
                    noItemsText={i18n.t('No {{trackedEntityTypeName}} found.', { trackedEntityTypeName })}
                    getCustomItemBottomElements={itemProps => this.getItemActions(itemProps, attributes)}
                />
                {this.renderPager()}
            </React.Fragment>
        );
    }

    renderTopActions = () => {
        const { onNewSearch, onEditSearch, classes } = this.props;
        return (
            <div className={classes.topActionsContainer}>
                <Button className={classes.actionButton} onClick={onNewSearch}>
                    {i18n.t('New search')}
                </Button>
                <Button className={classes.actionButton} onClick={onEditSearch}>
                    {i18n.t('Edit search')}
                </Button>
            </div>
        );
    }

    renderPager = () => {
        const { onChangePage, paging } = this.props;
        return (
            <div className={this.props.classes.pagination}>
                <SearchResultsPager
                    onChangePage={onChangePage}
                    onGetLabelDisplayedRows={(a, b) => `${a} of ${b}`}
                    {...paging}
                />
            </div>
        );
    }

    render() {
        return (
            <div>
                { this.props.resultsLoading ? <LoadingMask /> : this.renderResults() }
            </div>

        );
    }
}
// $FlowFixMe
export default withStyles(getStyles)(TeiRelationshipSearchResults);