export default {
  port: process.env.PORT || 21075,
  folderStorage: process.env.URL_STORAGE || "./storage",
  pictureQuality: process.env.PICTURE_QUALITY || 80,
  secretyKey: process.env.SECRETYKEY || 'f5ccc0f3-cbb6-4788-b4c8-403c22cd110f',
  publicRoutes: process.env.PUBLICROUTES || [
    'user/create',
    'user/auth',
    'user/authsocial',
    'user/forgotpassword',
    'customer/auth',
    'admin/auth',
    'serviceprovider/create',
    'serviceprovider/auth',
    'customer/create',
    'storage',
    'address',
    'plans',
    'sales/checktransaction'
  ]
}