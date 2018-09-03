import { Mongo } from 'meteor/mongo';

export const Buckets = new Mongo.Collection('buckets');
export const Cards = new Mongo.Collection('cards');
