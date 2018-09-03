import { Meteor } from 'meteor/meteor';

import { Buckets, Cards } from '../imports/api';

Meteor.publish('buckets', () => {
    return Buckets.find({});
});
Meteor.publish('cards', bucketId => Cards.find({ bucketId }));
