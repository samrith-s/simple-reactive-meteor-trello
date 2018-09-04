import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { DragDropContext } from 'react-beautiful-dnd';

import Bucket from './Bucket.js';

import { Buckets } from '../api';

class App extends Component {
    addBucket = () => {
        const { buckets } = this.props;

        Buckets.insert({
            title: `Untitled ${buckets.length + 1}`,
            createdAt: Date.now()
        });
    };

    renderBuckets = () => {
        const { buckets } = this.props;

        if (!buckets.length) {
            return <div className="no-buckets">No buckets to show!</div>;
        }

        return this.props.buckets.map(bucket => (
            <Bucket {...bucket} key={bucket._id} />
        ));
    };

    onDragEnd = ({ draggableId: cardId, source, destination, reason }) => {
        if (reason === 'DROP') {
            Meteor.call('updateMultipleCards', cardId, source, destination);
        }
    };

    render() {
        const { isLoading } = this.props;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="app-container">
                    <header className="app-header">
                        <h1>
                            <a
                                href="https://github.com/samrith-s/simple-reactive-meteor-trello"
                                className="fa fa-github"
                            />{' '}
                            Simple Reactive Meteor Trello
                        </h1>
                        {!isLoading && (
                            <button
                                className="btn btn-info"
                                onClick={this.addBucket}
                            >
                                <i className="fa fa-plus" /> Add Bucket
                            </button>
                        )}
                    </header>
                    <div className="bucket-container">
                        {!isLoading && this.renderBuckets()}
                        {isLoading && (
                            <div className="buckets-loading">
                                <i className="fa fa-circle-o-notch fa-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </DragDropContext>
        );
    }
}

export default withTracker(() => {
    const handle = Meteor.subscribe('buckets');
    return {
        buckets: Buckets.find({}, { sort: { createdAt: 1 } }).fetch(),
        isLoading: !handle.ready()
    };
})(App);
