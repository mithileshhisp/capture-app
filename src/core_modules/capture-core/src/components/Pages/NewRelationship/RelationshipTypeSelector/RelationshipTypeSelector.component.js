// @flow
import * as React from 'react';
import classNames from 'classnames';
import ClearIcon from '@material-ui/icons/Clear';
import withStyles from '@material-ui/core/styles/withStyles';
import RelationshipType from '../../../../metaData/RelationshipType/RelationshipType';

type Props = {
    relationshipTypes: ?Array<RelationshipType>,
    selectedRelationshipType?: ?RelationshipType,
    onSelectRelationshipType: (relationshipTypeId: string) => void,
    onDeselectRelationshipType: () => void,
    classes: {
        relationshipType: string,
        relationshipTypeSelected: string,
        relationshipTypeSelectable: string,
        container: string,
        relationshipTypeSelectedText: string,
    }
}

const getStyles = theme => ({
    relationshipType: {
        display: 'flex',
        padding: theme.typography.pxToRem(10),
        border: `1px solid ${theme.palette.grey.light}`,
        borderRadius: theme.typography.pxToRem(4),
        margin: theme.typography.pxToRem(10),

    },
    relationshipTypeSelectable: {
        cursor: 'pointer',
    },
    relationshipTypeSelected: {
        backgroundColor: '#f0f9f8',
    },
    relationshipTypeSelectedText: {
        paddingLeft: theme.typography.pxToRem(5),
        display: 'flex',
        alignItems: 'center',
        borderLeft: '2px solid #4ca899',
    },
    container: {
        display: 'flex',
    },
});


class RelationshipTypeSelector extends React.Component<Props> {
    renderRelationshipTypes = () => {
        const { classes, relationshipTypes, onSelectRelationshipType } = this.props;
        return relationshipTypes ? relationshipTypes.map(rt => (
            <div className={classNames(classes.relationshipType, classes.relationshipTypeSelectable)} key={rt.id} role="button" tabIndex="0" onClick={() => onSelectRelationshipType(rt.id)}>
                {rt.displayName}
            </div>
        )) : [];
    }

    renderSelectedRelationshipType = (selectedRelationshipType: RelationshipType) => {
        const { classes, onDeselectRelationshipType } = this.props;
        return (
            <div className={classNames(classes.relationshipType, classes.relationshipTypeSelected)}>
                <div className={classes.relationshipTypeSelectedText}>
                    <div>{selectedRelationshipType.displayName}</div>
                    <ClearIcon fontSize="small" onClick={onDeselectRelationshipType} />
                </div>
            </div>
        );
    }

    render() {
        const { selectedRelationshipType, classes } = this.props;
        return (
            <div className={classes.container}>
                {selectedRelationshipType ?
                    this.renderSelectedRelationshipType(selectedRelationshipType) :
                    this.renderRelationshipTypes()
                }
            </div>
        );
    }
}

export default withStyles(getStyles)(RelationshipTypeSelector);
