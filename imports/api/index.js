import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Buckets = new Mongo.Collection('buckets');
export const Cards = new Mongo.Collection('cards');

Meteor.methods({
    updateMultipleCards({
        draggableId: _id,
        destination: { droppableId: bucketId, index }
    }) {
        Cards.update(
            { seq: { $eq: index }, seq: { $gt: index } },
            {
                $inc: { seq: 1 }
            },
            { multi: true }
        );

        Cards.update(
            { _id },
            {
                $set: {
                    bucketId,
                    seq: index
                }
            }
        );
    },

    deleteBucketAndAllCards(bucketId) {
        Buckets.remove({ _id: bucketId });
        Cards.remove({ bucketId }, {});
    }
});
