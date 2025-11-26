import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import PropertyType from '../propertyType/propertyType.model';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IProperty } from './property.interface';
import Property from './property.model';

// const getAllProperties = async (
//   params: any,
//   options: IOption,
//   isSubscriptionActive: boolean,
// ) => {
//   const { page, limit, skip, sortBy, sortOrder } = pagination(options);
//   const { searchTerm, ...filterData } = params;

//   const andCondition: any[] = [];
//   const searchableFields = [
//     'address',
//     'size',
//     'title',
//     'description',
//     'country',
//     'city',
//     'areaya',
//     'mounth',
//   ];

//   if (searchTerm) {
//     andCondition.push({
//       $or: [
//         ...searchableFields.map((field) => ({
//           [field]: { $regex: searchTerm, $options: 'i' },
//         })),
//         { 'type.name': { $regex: searchTerm, $options: 'i' } }, // ✅ search by PropertyType name
//       ],
//     });
//   }

//   if (Object.keys(filterData).length) {
//     andCondition.push({
//       $and: Object.entries(filterData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

//   let projection = {};

//   if (!isSubscriptionActive) {
//     projection = {
//       description: 0,
//       size: 0,
//       areaya: 0,
//       mounth: 0,
//       extaraLocation: 0,
//       createdAt: 0,
//       updatedAt: 0,

//       __v: 0,
//     };
//   }

//   const result = await Property.find(whereCondition)
//     .select(projection)
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder } as any)
//     .populate('type');

//   const total = await Property.countDocuments(whereCondition);

//   return {
//     data: result,
//     meta: { total, page, limit },
//   };
// };

// const getSingleProperty = async (id: string, isSubscriptionActive: boolean) => {
//   let projection = {};

//   if (!isSubscriptionActive) {
//     projection = {
//       description: 0,
//       size: 0,
//       areaya: 0,
//       mounth: 0,
//       extaraLocation: 0,
//       createdAt: 0,
//       updatedAt: 0,
//       user: 0,
//       __v: 0,
//     };
//   }
//   const property = await Property.findById(id)
//     .select(projection)
//     .populate('user')
//     .populate('type');
//   if (!property) {
//     throw new AppError(404, 'Property not found');
//   }
//   return property;
// };

const createProperty = async (
  userId: string,
  payload: IProperty,
  files?: Express.Multer.File[],
  supplyerIdCreateIdAgent?: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const propertyType = await PropertyType.findById(payload.type);
  if (!propertyType) throw new AppError(404, 'PropertyType not found');

  if (files) {
    const propertyImage = await Promise.all(
      files.map((file) => fileUploader.uploadToCloudinary(file)),
    );
    payload.thumble = propertyImage.map((image) => image.secure_url);
  }

  if (user.role === userRole.AGENT) {
    const property = await Property.create({
      ...payload,
      user: payload.supplyerIdCreateIdAgent,
      supplyerIdCreateIdAgent: user._id,
      managedByThisAgency: payload.managedByThisAgency,
    });
    if (!property) {
      throw new AppError(400, 'Property not created');
    }
    return property;
  }

  const property = await Property.create({ ...payload, user: user._id });
  if (!property) {
    throw new AppError(400, 'Property not created');
  }
  return property;
};

const getAllProperties = async (
  params: any,
  options: IOption,
  isSubscriptionActive: boolean,
  subscriptionSystemActive: boolean,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = [
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: [
        ...searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
        { 'type.name': { $regex: searchTerm, $options: 'i' } }, // ✅ search by PropertyType name
      ],
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  let projection = {};
  if (subscriptionSystemActive) {
    if (!isSubscriptionActive) {
      projection = {
        description: 0,
        size: 0,
        areaya: 0,
        mounth: 0,
        extaraLocation: 0,
        createdAt: 0,
        updatedAt: 0,

        __v: 0,
      };
    }
  } else {
    projection = {};
  }

  const result = await Property.find(whereCondition)
    .select(projection)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('type')
    .populate('supplyerIdCreateIdAgent');

  const total = await Property.countDocuments(whereCondition);

  return {
    data: result,
    meta: { total, page, limit },
  };
};

const getSingleProperty = async (
  id: string,
  isSubscriptionActive: boolean,
  subscriptionSystemActive: boolean,
) => {
  let projection = {};
  if (subscriptionSystemActive) {
    if (!isSubscriptionActive) {
      projection = {
        description: 0,
        size: 0,
        areaya: 0,
        mounth: 0,
        extaraLocation: 0,
        createdAt: 0,
        updatedAt: 0,

        __v: 0,
      };
    }
  } else {
    projection = {};
  }
  const property = await Property.findById(id)
    .select(projection)
    .populate('user')
    .populate('type');
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

const getAdminAllProperties = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = [
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: [
        ...searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
        { 'type.name': { $regex: searchTerm, $options: 'i' } }, // ✅ search by PropertyType name
      ],
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Property.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('type');
  if (!result) {
    throw new AppError(404, 'Property not found');
  }
  const total = await Property.countDocuments(whereCondition);
  return {
    data: result,
    meta: { total, page, limit },
  };
};

const updateProperty = async (
  id: string,
  payload: Partial<IProperty>,
  files?: Express.Multer.File[],
) => {
  if (files) {
    const propertyImage = await Promise.all(
      files.map((file) => fileUploader.uploadToCloudinary(file)),
    );
    payload.thumble = propertyImage.map((image) => image.secure_url);
  }
  const property = await Property.findByIdAndUpdate(id, payload, { new: true });
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

const deleteProperty = async (id: string) => {
  const property = await Property.findByIdAndDelete(id);
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

const updateMyProperty = async (
  id: string,
  userId: string,
  payload: Partial<IProperty>,
  files?: Express.Multer.File[],
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
 if (files) {
    const propertyImage = await Promise.all(
      files.map((file) => fileUploader.uploadToCloudinary(file)),
    );
    payload.thumble = propertyImage.map((image) => image.secure_url);
  }
  const property = await Property.findOneAndUpdate(
    { _id: id, user: userId },
    payload,
    { new: true },
  );
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

const getMyAllProperties = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = [
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: [
        ...searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
        { 'type.name': { $regex: searchTerm, $options: 'i' } }, // ✅ search by PropertyType name
      ],
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const result = await Property.find({ ...whereCondition, user: userId })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('type');
  if (!result) {
    throw new AppError(404, 'Property not found');
  }
  const total = await Property.countDocuments({
    ...whereCondition,
    user: userId,
  });
  return {
    data: result,
    meta: { total, page, limit },
  };
};

const deleteMyProperty = async (id: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const property = await Property.findOneAndDelete({ _id: id, user: userId });
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

const getAdminWonSingleProperty = async (id: string) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

// map

const getNearbyProperties = async (
  latitude: number,
  longitude: number,
  distanceInKm: number,
) => {
  // MongoDB expects [longitude, latitude] order
  return Property.find({
    extraLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude], // [lng, lat]
        },
        $maxDistance: distanceInKm * 1000, // Convert km to meters
      },
    },
  })
    .populate('type')
    .populate('user', 'fullName email profileImage');
};

export const propertyService = {
  createProperty,
  getAllProperties,
  getSingleProperty,

  getAdminAllProperties,
  updateProperty,
  deleteProperty,

  getAdminWonSingleProperty,

  getMyAllProperties,
  updateMyProperty,
  deleteMyProperty,

  getNearbyProperties,
};
