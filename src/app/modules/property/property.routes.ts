import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { propertyController } from './property.controller';
import { fileUploader } from '../../helper/fileUploder';
import optionalAuth from '../../middlewares/optionalAuth';
const router = express.Router();

// map nearly
router.get('/nearby', optionalAuth, propertyController.getNearbyProperties);

// create property
router.post(
  '/',
  auth(userRole.ADMIN, userRole.SUPPLIER, userRole.AGENT),
  fileUploader.upload.array('thumble'),
  propertyController.createProperty,
);

// admin access
router.get(
  '/admin',
  auth(userRole.ADMIN),
  propertyController.getAdminAllProperties,
);
router.put(
  '/admin/:id',
  auth(userRole.ADMIN),
  fileUploader.upload.array('thumble'),
  propertyController.updateProperty,
);
router.delete(
  '/admin/:id',
  auth(userRole.ADMIN),
  propertyController.deleteProperty,
);

// won property
router.get(
  '/my',
  auth(userRole.SUPPLIER, userRole.ADMIN),
  propertyController.getMyAllProperties,
);
router.put(
  '/my/:id',
  auth(userRole.SUPPLIER, userRole.ADMIN),
  fileUploader.upload.array('thumble'),
  propertyController.updateMyProperty,
);
router.delete(
  '/my/:id',
  auth(userRole.SUPPLIER, userRole.ADMIN),
  propertyController.deleteMyProperty,
);

// single property
router.get(
  '/my/:id',
  auth(userRole.ADMIN, userRole.SUPPLIER),
  propertyController.getAdminWonSingleProperty,
);

// all user access
router.get('/', optionalAuth, propertyController.getAllProperties);
router.get('/:id', optionalAuth, propertyController.getSingleProperty);

export const propertyRouter = router;
