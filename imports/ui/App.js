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

    onDragEnd = args => {
        Meteor.call('updateMultipleCards', args);
    };

    render() {
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
                        <button
                            className="btn btn-info"
                            onClick={this.addBucket}
                        >
                            <i className="fa fa-plus" /> Add Bucket
                        </button>
                    </header>
                    <div className="bucket-container">
                        {this.renderBuckets()}
                    </div>
                </div>
            </DragDropContext>
        );
    }
}

export default withTracker(() => ({
    buckets: Buckets.find({}, { sort: { seq: -1 } }).fetch()
}))(App);
