import React, { PureComponent } from 'react';

import RelativeDate from 'relative_date';

import '../styles/card.css';

export default class Card extends PureComponent {
    render() {
        const { body, createdAt } = this.props;

        return (
            <div className="card">
                <div className="card-data">{body}</div>
                <div className="card-created">
                    {RelativeDate(createdAt).text}
                </div>
            </div>
        );
    }
}
