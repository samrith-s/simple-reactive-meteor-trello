import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Buckets = new Mongo.Collection('buckets');
export const Cards = new Mongo.Collection('cards');

Meteor.methods({
    updateMultipleCards(
        cardId,
        { droppableId: sourceBucketId, index: startIndex },
        { droppableId: destinationBucketId, index: endIndex }
    ) {
        const cards = Cards.find(
            { bucketId: destinationBucketId },
            { sort: { seq: 1 } }
        ).fetch();
        const seq = cards[endIndex] ? cards[endIndex].seq : 0;

        if (startIndex === endIndex && sourceBucketId === destinationBucketId) {
            return;
        }

        if (sourceBucketId !== destinationBucketId) {
            for (let i = endIndex, len = cards.length; i < len; i++) {
                Cards.update({ _id: cards[i]._id }, { $inc: { seq: 1 } });
            }
        } else {
            if (startIndex < endIndex) {
                for (let i = startIndex + 1; i <= endIndex; i++) {
                    Cards.update({ _id: cards[i]._id }, { $inc: { seq: -1 } });
                }
            } else {
                for (let i = endIndex; i < startIndex; i++) {
                    Cards.update({ _id: cards[i]._id }, { $inc: { seq: 1 } });
                }
            }
        }

        Cards.update(
            { _id: cardId, bucketId: sourceBucketId },
            { $set: { seq, bucketId: destinationBucketId } }
        );
    },

    deleteBucketAndAllCards(bucketId) {
        Buckets.remove({ _id: bucketId });
        Cards.remove({ bucketId });
    }
});
