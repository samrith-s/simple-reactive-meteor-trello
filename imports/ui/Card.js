import React, { PureComponent } from 'react';
import RelativeDate from 'relative_date';
import Textarea from 'react-autosize-textarea';

import { Cards } from '../api';

import '../styles/card.css';

export default class Card extends PureComponent {
    state = {
        editing: false
    };

    toggleEditing = editing => () => {
        this.setState(
            {
                editing
            },
            () => {
                if (this.state.editing) {
                    this.input.setSelectionRange(0, this.input.value.length);
                }
            }
        );
    };

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    handleKeyUp = e => {
        const { _id } = this.props;
        const body = this.input.value.trim();

        if (e.key === 'Enter' && body) {
            Cards.update({ _id }, { $set: { body } });
            this.toggleEditing(false)();
        }

        if (e.key === 'Escape') {
            this.toggleEditing(false)();
        }
    };

    handleCardInputRef = ref => {
        this.input = ref;
    };

    render() {
        const { body, createdAt, provided } = this.props;
        const { editing } = this.state;

        return (
            <div
                className="card"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <div className="card-data" onClick={this.toggleEditing(true)}>
                    {editing && (
                        <Textarea
                            placeholder="Enter card body.."
                            innerRef={this.handleCardInputRef}
                            onKeyDown={this.handleKeyDown}
                            onKeyUp={this.handleKeyUp}
                            defaultValue={body}
                            autoFocus
                        />
                    )}
                    {!editing && <span>{body}</span>}
                </div>
                <div className="card-created">
                    {RelativeDate(createdAt).text}
                </div>
            </div>
        );
    }
}
