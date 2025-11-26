import mongoose from 'mongoose';
import { IProperty } from './property.interface';

const porertySchema = new mongoose.Schema<IProperty>(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyType',
      required: true,
    },
    address: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    thumble: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    areaya: { type: String },
    mounth: { type: String },
    extraLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    bookingUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    supplyerIdCreateIdAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    managedByThisAgency: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Property = mongoose.model<IProperty>('Property', porertySchema);
export default Property;
