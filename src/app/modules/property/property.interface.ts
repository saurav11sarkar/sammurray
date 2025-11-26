import { Types } from 'mongoose';

export interface IProperty {
  type: Types.ObjectId;
  address: string;
  size: string;
  price: number;
  title: string;
  description?: string;
  thumble?: string[];
  user: Types.ObjectId;
  country?: string;
  city: string;
  areaya?: string;
  mounth?: string;
  extraLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  bookingUser?: Types.ObjectId[];
  supplyerIdCreateIdAgent?: Types.ObjectId;
  managedByThisAgency?: boolean;
}
