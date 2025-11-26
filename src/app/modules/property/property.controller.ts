import AppError from '../../error/appError';
import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import PropertyType from '../propertyType/propertyType.model';
import Subscription from '../subscription/subscription.model';
import { propertyService } from './property.service';

// const getAllProperties = catchAsync(async (req, res) => {
//   const filters = pick(req.query, [
//     'searchTerm',
//     'type',
//     'address',
//     'size',
//     'title',
//     'description',
//     'country',
//     'city',
//     'areaya',
//     'mounth',
//   ]);

//   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//   if (filters.type) {
//     const typeDoc = await PropertyType.findOne({ name: filters.type });
//     if (typeDoc)
//       filters.type = typeDoc._id.toString(); // replace string with ObjectId
//     else delete filters.type; // if not found, ignore filter
//   }

//   const isSubscriptionActive =
//     req.user?.isSubscription === true &&
//     req.user?.subscriptionExpiry &&
//     new Date(req.user.subscriptionExpiry) > new Date();

//   const result = await propertyService.getAllProperties(
//     filters,
//     options,
//     isSubscriptionActive,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Properties retrieved successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getSingleProperty = catchAsync(async (req, res) => {
//   const isSubscriptionActive =
//     req.user?.isSubscription === true &&
//     req.user?.subscriptionExpiry &&
//     new Date(req.user.subscriptionExpiry) > new Date();
//   const id = req.params.id!;
//   const result = await propertyService.getSingleProperty(
//     id,
//     isSubscriptionActive,
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Property retrieved successfully',
//     data: result,
//   });
// });

const createProperty = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const files = req.files as Express.Multer.File[];
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await propertyService.createProperty(userId, fromData, files);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Property created successfully',
    data: result,
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'type',
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ]);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  if (filters.type) {
    const typeDoc = await PropertyType.findOne({ name: filters.type });
    if (typeDoc)
      filters.type = typeDoc._id.toString(); // replace string with ObjectId
    else delete filters.type; // if not found, ignore filter
  }

  const isSubscriptionActive =
    req.user?.isSubscription === true &&
    req.user?.subscriptionExpiry &&
    new Date(req.user.subscriptionExpiry) > new Date();

  const subscriptionSystemActive =
    (await Subscription.countDocuments({ status: 'active' })) > 0;

  const result = await propertyService.getAllProperties(
    filters,
    options,
    isSubscriptionActive,
    subscriptionSystemActive,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProperty = catchAsync(async (req, res) => {
  const isSubscriptionActive =
    req.user?.isSubscription === true &&
    req.user?.subscriptionExpiry &&
    new Date(req.user.subscriptionExpiry) > new Date();
  const id = req.params.id!;
  const subscriptionSystemActive =
    (await Subscription.countDocuments({ status: 'active' })) > 0;
  const result = await propertyService.getSingleProperty(
    id,
    isSubscriptionActive,
    subscriptionSystemActive,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property retrieved successfully',
    data: result,
  });
});

const getAdminAllProperties = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'type',
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  if (filters.type) {
    const typeDoc = await PropertyType.findOne({ name: filters.type });
    if (typeDoc)
      filters.type = typeDoc._id.toString(); // replace string with ObjectId
    else delete filters.type; // if not found, ignore filter
  }
  const result = await propertyService.getAdminAllProperties(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateProperty = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const files = req.files as Express.Multer.File[];
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await propertyService.updateProperty(id, fromData, files);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

const deleteProperty = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const result = await propertyService.deleteProperty(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property deleted successfully',
    data: result,
  });
});

const getAdminWonSingleProperty = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const result = await propertyService.getAdminWonSingleProperty(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property retrieved successfully',
    data: result,
  });
});

const getMyAllProperties = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'type',
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  if (filters.type) {
    const typeDoc = await PropertyType.findOne({ name: filters.type });
    if (typeDoc) filters.type = typeDoc._id.toString();
    else delete filters.type;
  }
  const userId = req.user.id;
  const result = await propertyService.getMyAllProperties(
    userId,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const updateMyProperty = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const files = req.files as Express.Multer.File[];
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const userId = req.user.id;
  const result = await propertyService.updateMyProperty(
    id,
    userId,
    fromData,
    files,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});
const deleteMyProperty = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const userId = req.user.id;
  const result = await propertyService.deleteMyProperty(id, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property deleted successfully',
    data: result,
  });
});

// map
const getNearbyProperties = catchAsync(async (req, res) => {
  const { latitude, longitude, distance = 5 } = req.query;

  // Validate required parameters
  if (!latitude || !longitude) {
    throw new AppError(400, 'latitude and longitude are required');
  }

  const lat = Number(latitude);
  const lng = Number(longitude);
  const dist = Number(distance);

  // Validate numeric values
  if (isNaN(lat) || isNaN(lng) || isNaN(dist)) {
    throw new AppError(400, 'Invalid latitude, longitude, or distance value');
  }

  // Validate coordinate ranges
  if (lat < -90 || lat > 90) {
    throw new AppError(400, 'Latitude must be between -90 and 90');
  }
  if (lng < -180 || lng > 180) {
    throw new AppError(400, 'Longitude must be between -180 and 180');
  }

  const nearbyProperties = await propertyService.getNearbyProperties(
    lat,
    lng,
    dist,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Nearby properties retrieved successfully',
    data: nearbyProperties,
  });
});

export const propertyController = {
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
