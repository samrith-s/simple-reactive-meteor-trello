import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Textarea from 'react-autosize-textarea';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import Card from './Card';

import { Cards, Buckets } from '../api';

import '../styles/bucket.css';

class Bucket extends Component {
    state = {
        cardAdd: false,
        titleEdit: false
    };

    addCard = () => {
        const { _id, cards } = this.props;
        const body = this.input.value.trim();

        if (body) {
            Cards.insert({
                body,
                createdAt: Date.now(),
                bucketId: _id,
                seq: cards.length
            });

            this.toggleCardAdd(false)();
            this.cardHolder.scrollTop = this.cardHolder.scrollHeight;
        }
    };

    editTitle = () => {
        const { _id } = this.props;
        const body = this.titleInput.value.trim();

        if (body) {
            Buckets.update(
                { _id },
                {
                    $set: {
                        title: body
                    }
                }
            );

            this.toggleTitleEdit(false)();
        }
    };

    toggleCardAdd = cardAdd => () => {
        this.setState(() => ({
            cardAdd
        }));
    };

    toggleTitleEdit = titleEdit => () => {
        this.setState(
            () => ({
                titleEdit
            }),
            () => {
                if (this.state.titleEdit) {
                    this.titleInput.setSelectionRange(
                        0,
                        this.titleInput.value.length
                    );
                }
            }
        );
    };

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    handleAddCardKeyUp = e => {
        if (e.key === 'Escape') {
            this.toggleCardAdd(false)();
        }

        if (e.key === 'Enter') {
            this.addCard();
        }
    };

    handleEditTitleKeyUp = e => {
        if (e.key === 'Escape') {
            this.toggleTitleEdit(false)();
        }

        if (e.key === 'Enter') {
            this.editTitle();
        }
    };

    handleInputRef = ref => {
        this.input = ref;
    };

    handleTitleInputRef = ref => {
        this.titleInput = ref;
    };

    handleCardHolderRef = ref => {
        this.cardHolder = ref;
    };

    deleteBucket = () => {
        const { _id, title } = this.props;
        if (
            confirm(
                `Are you sure you want to delete the "${title}" bucket? All cards associated will be lost!`
            )
        ) {
            Meteor.call('deleteBucketAndAllCards', _id);
        }
    };

    renderCards = () => {
        const { cards } = this.props;

        if (!cards.length) {
            return (
                <div className="no-cards">
                    No cards! Let's{' '}
                    <span onClick={this.toggleCardAdd(true)}>add a card</span>!
                </div>
            );
        }

        return cards.map((card, index) => (
            <Draggable draggableId={card._id} index={index} key={card._id}>
                {provided => <Card provided={provided} {...card} />}
            </Draggable>
        ));
    };

    render() {
        const { title, _id } = this.props;
        const { cardAdd, titleEdit } = this.state;

        return (
            <Droppable droppableId={_id}>
                {provided => (
                    <div
                        className="bucket"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <div className="bucket-inner">
                            <header>
                                {!titleEdit && (
                                    <strong
                                        onClick={this.toggleTitleEdit(true)}
                                    >
                                        {title}
                                    </strong>
                                )}
                                {titleEdit && (
                                    <Textarea
                                        placeholder="Bucket title.."
                                        onKeyDown={this.handleKeyDown}
                                        innerRef={this.handleTitleInputRef}
                                        onKeyUp={this.handleEditTitleKeyUp}
                                        defaultValue={title}
                                        autoFocus
                                    />
                                )}
                                <i
                                    className="fa fa-times"
                                    onClick={this.deleteBucket}
                                />
                            </header>
                            <div
                                className="bucket-cards"
                                ref={this.handleCardHolderRef}
                            >
                                {this.renderCards()}
                                {provided.placeholder}
                            </div>
                            <footer>
                                {!cardAdd && (
                                    <button
                                        className="bucket-add-card-btn btn btn-light"
                                        onClick={this.toggleCardAdd(true)}
                                    >
                                        <i className="fa fa-plus" /> Add Card
                                    </button>
                                )}
                                {cardAdd && (
                                    <div className="bucket-input">
                                        <Textarea
                                            placeholder="Enter card details.."
                                            onKeyDown={this.handleKeyDown}
                                            onKeyUp={this.handleAddCardKeyUp}
                                            innerRef={this.handleInputRef}
                                            autoFocus
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={this.addCard}
                                        >
                                            <i className="fa fa-check" /> Save
                                        </button>
                                    </div>
                                )}
                            </footer>
                        </div>
                    </div>
                )}
            </Droppable>
        );
    }
}

export default withTracker(props => ({
    cards: Cards.find({ bucketId: props._id }, { sort: { seq: 1 } }).fetch()
}))(Bucket);
