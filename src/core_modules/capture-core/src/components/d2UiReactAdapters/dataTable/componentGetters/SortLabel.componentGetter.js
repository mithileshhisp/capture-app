// @flow
import * as React from 'react';
import classNames from 'classnames';
import { directions, placements } from './sortLabel.const';
import type { TableClasses } from '../../../d2Ui/dataTable/getTableComponents';

type Props = {
    children?: ?React.Node,
    initialDirection?: ?$Values<typeof directions>,
    isActive: boolean,
    direction?: ?$Values<typeof directions>,
    placement?: ?$Values<typeof placements>,
    onSort: (direction: $Values<typeof directions>) => void,
    onGetIcons?: ?(
        isActive: boolean,
        direction?: ?$Values<typeof directions>,
        onSort: (direction: $Values<typeof directions>) => void)
    => void,
    childrenClass?: ?string,
};

export default (defaultClasses: TableClasses) =>
    class SortLabel extends React.Component<Props> {
        handleSort = () => {
            const isActive = this.props.isActive;
            const direction = this.props.direction;

            if (isActive) {
                this.props.onSort(direction === directions.ASC ? directions.DESC : directions.ASC);
            } else {
                this.props.onSort(this.props.initialDirection || directions.DESC);
            }
        }

        renderChildrenContainer(classes: Array<string>) {
            return (
                <div
                    // $FlowSuppress
                    className={classNames(defaultClasses.sortLabelChildren, this.props.childrenClass, classes)}
                    onClick={this.handleSort}
                    role="button"
                    tabIndex={0}
                >
                    {this.props.children}
                </div>
            );
        }

        render() {
            const { children, isActive, direction, onSort, onGetIcons, placement } = this.props; // eslint-disable-line
            const icons = onGetIcons && onGetIcons(isActive, direction, onSort);
            const containerClasses = classNames(
                defaultClasses.sortLabelContainer,
                {
                    [defaultClasses.sortLabelRight]: placement === placements.RIGHT,
                },
            );

            return (
                <div
                    className={containerClasses}
                >
                    {
                        (() => {
                            if (placement === placements.RIGHT) {
                                return (
                                    <React.Fragment>
                                        <div
                                            className={defaultClasses.sortLabelIcon}
                                        >
                                            {icons}
                                        </div>
                                        {
                                            this.renderChildrenContainer([defaultClasses.sortLabelChildrenLast])
                                        }
                                    </React.Fragment>
                                );
                            }

                            return (
                                <React.Fragment>
                                    {
                                        this.renderChildrenContainer([defaultClasses.sortLabelChildrenFirst])
                                    }
                                    <div
                                        className={defaultClasses.sortLabelIcon}
                                    >
                                        {icons}
                                    </div>
                                </React.Fragment>
                            );
                        })()
                    }
                </div>
            );
        }
    };
