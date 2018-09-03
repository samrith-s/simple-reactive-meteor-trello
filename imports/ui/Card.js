import React, { PureComponent } from 'react';

import RelativeDate from 'relative_date';

import '../styles/card.css';

export default class Card extends PureComponent {
    render() {
        const { body, createdAt, provided } = this.props;

        return (
            <div
                className="card"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <div className="card-data">{body}</div>
                <div className="card-created">
                    {RelativeDate(createdAt).text}
                </div>
            </div>
        );
    }
}
