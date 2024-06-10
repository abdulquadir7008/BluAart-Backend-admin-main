const AdminController = require("../controllers/AdminController");
const AdminSchema = require("../schemas/AdminSchema");

function AdminRoutes(fastify, options, done) {
  fastify.post("/Authentication", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.AuthenticationSchema,
    handler: AdminController.Authentication(fastify),
  });

  fastify.get("/Network2FA", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.Network2FASchema,
    handler: AdminController.Network2FA(fastify),
  });

  fastify.post("/Verify2FA", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.Verify2FASchema,
    handler: AdminController.Verify2FA(fastify),
  });

  fastify.post("/VerifyNetwork2FA", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.NetworkVerify2FASchema,
    handler: AdminController.VerifyNetwork2FA(fastify),
  });

  fastify.post("/ForgotPassword", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.ForgotPasswordSchema,
    handler: AdminController.ForgotPassword(fastify),
  });

  fastify.post("/ResetPassword", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.ResetPasswordSchema,
    handler: AdminController.ResetPassword,
  });

  fastify.get("/GetSiteSettings", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.SettingSchema,
    handler: AdminController.Settings,
  });

  fastify.get("/GetActivities", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ActivityListSchema,
    handler: AdminController.GetActivities,
  });

  fastify.post("/UpdateProjectDetailsSettings", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateProjectSettingsSchema,
    handler: AdminController.UpdateProjectDetailsSettings,
  });

  fastify.post("/UpdateModuleEnableSettings", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateModuleEnableSchema,
    handler: AdminController.UpdateModuleEnableSettings,
  });

  fastify.post("/UpdateSocialMediaSettings", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateSocialMediaSchema,
    handler: AdminController.UpdateSocialMediaSettings,
  });

  fastify.post("/UpdateSocialLoginDetails", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateSocialLoginDetailSchema,
    handler: AdminController.UpdateSocialLoginDetails,
  });

  fastify.post("/UpdateCaptchaSettings", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateCaptchaSchema,
    handler: AdminController.UpdateCaptchaSettings,
  });

  fastify.post("/UpdateEmailSettings", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateEmailSettingsSchema,
    handler: AdminController.UpdateEmailSettings,
  });

  fastify.get("/GetUserList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UserListSchema,
    handler: AdminController.UsersList,
  });

  fastify.get("/UserList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetUserListSchema,
    handler: AdminController.GetUsersList,
  });

  fastify.post("/GetKycDoc", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.KycInfoSchema,
    handler: AdminController.UserInfo,
  });

  fastify.post("/GetPersonalInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.PersonalInfoSchema,
    handler: AdminController.UserInfo,
  });

  fastify.post("/UpdateAccountStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AccountStatusUpdateSchema,
    handler: AdminController.UpdateAccountStatus,
  });

  fastify.post("/ChooseArtist", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.FeatureStatusUpdateSchema,
    handler: AdminController.UpdateFeaturedStatus,
  });

  fastify.post("/UpdateCountryStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.CountryStatusSchema,
    handler: AdminController.UpdateCountryStatus,
  });

  fastify.post("/UpdateKycStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.KycStatusUpdateSchema,
    handler: AdminController.UpdateKYCStatus,
  });

  fastify.get("/GetAdminList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AdminListSchema,
    handler: AdminController.AdminList,
  });

  fastify.post("/GetOneAdminInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneAdminSchema,
    handler: AdminController.GetOneAdmin,
  });

  fastify.get("/GetAdminRoleList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AdminRoleSchema,
    handler: AdminController.AdminRoleList,
  });

  fastify.get("/GetAdminRoleLists", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AdminRolesSchema,
    handler: AdminController.AdminRoleLists,
  });

  fastify.post("/GetOneAdminRoleInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneAdminRoleSchema,
    handler: AdminController.GetOneAdminRole,
  });

  fastify.post("/AddAdmin", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddAdminSchema,
    handler: AdminController.AddAdmin,
  });

  fastify.post("/AddAdminRole", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddAdminRoleSchema,
    handler: AdminController.AddAdminRole,
  });

  fastify.post("/EditAdminRole", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditAdminRoleSchema,
    handler: AdminController.EditAdminRole,
  });

  fastify.post("/UpdateAdmin", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateAdminSchema,
    handler: AdminController.UpdateAdmin,
  });

  fastify.get("/GetEmailTemplates", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetEmailTemplateSchema,
    handler: AdminController.GetEmailTemplates,
  });

  fastify.post("/UpdateEmailTemplates", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateEmailTemplatesSchema,
    handler: AdminController.UpdateEmailTemplates,
  });

  fastify.post("/GetOneEmailTemplateInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneEmailTemplateSchema,
    handler: AdminController.GetOneEmailTemplate,
  });

  fastify.post("/GetOneBioInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneBioSchema,
    handler: AdminController.GetOneBio,
  });

  fastify.post("/GetOneTestimonialInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneTestimonialSchema,
    handler: AdminController.GetOneTestimonial,
  });

  fastify.post("/GetOneExhibitionInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneExhibitionSchema,
    handler: AdminController.GetOneExhibition,
  });

  fastify.post("/GetOneMediasInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneMediaSchema,
    handler: AdminController.GetOneMedias,
  });

  fastify.get("/GetProfileViewsByMonth", {
    handler: AdminController.GetProfileViewsByMonth,
  });

  fastify.get("/GetItemViewsByMonth", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetItemViewsByMonth,
  });

  fastify.get("/GetProfileViewsByCountry", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetProfileViewsByCountry,
  });

  fastify.get("/GetItemViewsByCountry", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetItemViewsByCountry,
  });

  fastify.get("/GetItemDetail", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetItemDetail,
  });

  fastify.get("/GetSalesDetail", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetSalesDetail,
  });

  fastify.get("/GetUserDetail", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetUserDetail,
  });

  fastify.get("/GetArtProductItemDetail", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetArtProductItemDetail,
  });

  fastify.get("/SalesDetail", {
    preHandler: [fastify.domainauthenticate],
    handler: AdminController.GetArtProductItemDetail,
  });

  // Category routes
  fastify.post("/AddCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddCategoriesSchema,
    handler: AdminController.AddCategories,
  });

  fastify.post("/EditCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditCategoriesSchema,
    handler: AdminController.EditCategories,
  });

  fastify.post("/GetOneCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneCategoriesSchema,
    handler: AdminController.GetOneCategories,
  });

  fastify.get("/GetCategoryList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.CategoriesSchema,
    handler: AdminController.CategoriesList,
  });

  // Artist Category Routes
  fastify.post("/AddArtistCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtistCategorySchema,
    handler: AdminController.AddArtistCategory,
  });

  fastify.post("/EditArtistCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtistCategorySchema,
    handler: AdminController.EditArtistCategory,
  });

  fastify.get("/GetArtistCategoryList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtistCategorySchema,
    handler: AdminController.ArtistCategoryList,
  });

  fastify.get("/GetCountryList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.CountrySchema,
    handler: AdminController.CountryList,
  });

  fastify.post("/GetOneArtistCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtistCategorySchema,
    handler: AdminController.GetOneArtistCategory,
  });

  fastify.post("/UpdateArtistCategoryImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.ArtistCategoryUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/UpdateArtCategoryImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.ArtCategoryUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  // Artist Style Routes
  fastify.post("/AddArtistStyle", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtistStyleSchema,
    handler: AdminController.AddArtistStyle,
  });

  fastify.post("/AddArtistLabel", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtistLabelSchema,
    handler: AdminController.AddArtistLabel,
  });

  fastify.post("/EditArtistStyle", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtistStyleSchema,
    handler: AdminController.EditArtistStyle,
  });

  fastify.post("/EditArtistLabel", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtistLabelSchema,
    handler: AdminController.EditArtistLabel,
  });

  fastify.get("/GetArtistStyleList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtistStyleSchema,
    handler: AdminController.ArtistStyleList,
  });

  fastify.get("/GetArtistLabelList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtistLabelSchema,
    handler: AdminController.ArtistLabelList,
  });

  fastify.post("/GetOneArtistStyle", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtistStyleSchema,
    handler: AdminController.GetOneArtistStyle,
  });

  fastify.post("/GetOneArtistLabel", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtistLabelSchema,
    handler: AdminController.GetOneArtistLabel,
  });

  // Artist Medium Routes
  fastify.post("/AddArtistMedium", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtistMediumSchema,
    handler: AdminController.AddArtistMedium,
  });

  fastify.post("/EditArtistMedium", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtistMediumSchema,
    handler: AdminController.EditArtistMedium,
  });

  fastify.get("/GetArtistMediumList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtistMediumSchema,
    handler: AdminController.ArtistMediumList,
  });

  fastify.post("/GetOneArtistMedium", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtistMediumSchema,
    handler: AdminController.GetOneArtistMedium,
  });

  // Medium routes
  fastify.post("/AddMedium", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddMediumSchema,
    handler: AdminController.AddMedium,
  });

  fastify.post("/EditMedium", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditMediumSchema,
    handler: AdminController.EditMedium,
  });

  fastify.post("/GetOneMedium", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneMediumSchema,
    handler: AdminController.GetOneMedium,
  });

  fastify.get("/GetMediumList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.MediumSchema,
    handler: AdminController.MediumList,
  });

  // Material routes
  fastify.post("/AddMaterial", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddMaterialSchema,
    handler: AdminController.AddMaterial,
  });

  fastify.post("/AddArtProductCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductCategorySchema,
    handler: AdminController.AddArtProductCategory,
  });

  fastify.post("/UpdateArtProductImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.APCategoryImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/AddArtProductBrand", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductBrandSchema,
    handler: AdminController.AddArtProductBrand,
  });

  fastify.post("/AddArtProductFabric", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductFabricSchema,
    handler: AdminController.AddArtProductFabric,
  });

  fastify.post("/AddArtProductMaterial", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductMaterialSchema,
    handler: AdminController.AddArtProductMaterial,
  });

  fastify.post("/AddArtProductName", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductNameSchema,
    handler: AdminController.AddArtProductName,
  });

  fastify.post("/AddArtProductStyle", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductStyleSchema,
    handler: AdminController.AddArtProductStyle,
  });

  fastify.post("/AddArtProductSize", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductSizeSchema,
    handler: AdminController.AddArtProductSize,
  });

  fastify.post("/AddArtProductShape", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductShapeSchema,
    handler: AdminController.AddArtProductShape,
  });

  fastify.post("/AddArtProductType", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductTypeSchema,
    handler: AdminController.AddArtProductType,
  });

  fastify.post("/AddArtProductTechnique", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddArtProductTechniqueSchema,
    handler: AdminController.AddArtProductTechnique,
  });

  fastify.post("/EditMaterial", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditMaterialSchema,
    handler: AdminController.EditMaterial,
  });

  fastify.post("/EditArtproductCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductCategorySchema,
    handler: AdminController.EditArtProductCategory,
  });

  fastify.post("/EditArtproductBrand", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductBrandSchema,
    handler: AdminController.EditArtProductBrand,
  });

  fastify.post("/EditArtproductFabric", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductFabricSchema,
    handler: AdminController.EditArtProductFabric,
  });

  fastify.post("/EditArtproductMaterial", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductMaterialSchema,
    handler: AdminController.EditArtProductMaterial,
  });

  fastify.post("/EditArtproductName", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductNameSchema,
    handler: AdminController.EditArtProductName,
  });

  fastify.post("/EditArtproductSize", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductSizeSchema,
    handler: AdminController.EditArtProductSize,
  });

  fastify.post("/EditArtproductStyle", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductStyleSchema,
    handler: AdminController.EditArtProductStyle,
  });

  fastify.post("/EditArtproductShape", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductShapeSchema,
    handler: AdminController.EditArtProductShape,
  });

  fastify.post("/EditArtproductType", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductTypeSchema,
    handler: AdminController.EditArtProductType,
  });

  fastify.post("/EditArtproductTechnique", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtProductTechniqueSchema,
    handler: AdminController.EditArtProductTechnique,
  });

  fastify.post("/GetOneMaterial", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneMaterialSchema,
    handler: AdminController.GetOneMaterial,
  });

  fastify.post("/GetOneArtProductBrand", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductBrandSchema,
    handler: AdminController.GetOneArtProductBrand,
  });

  fastify.post("/GetOneArtProductCategory", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductCategorySchema,
    handler: AdminController.GetOneArtProductCategory,
  });

  fastify.post("/GetOneArtProductFabric", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductFabricSchema,
    handler: AdminController.GetOneArtProductFabric,
  });

  fastify.post("/GetOneArtProductMaterial", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductMaterialSchema,
    handler: AdminController.GetOneArtProductMaterial,
  });

  fastify.post("/GetOneArtProductName", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductNameSchema,
    handler: AdminController.GetOneArtProductName,
  });

  fastify.post("/GetOneArtProductSize", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductSizeSchema,
    handler: AdminController.GetOneArtProductSize,
  });

  fastify.post("/GetOneArtProductShape", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductShapeSchema,
    handler: AdminController.GetOneArtProductShape,
  });

  fastify.post("/GetOneArtProductStyle", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductStyleSchema,
    handler: AdminController.GetOneArtProductStyle,
  });

  fastify.post("/GetOneArtProductType", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductTypeSchema,
    handler: AdminController.GetOneArtProductType,
  });

  fastify.post("/GetOneArtProductTechnique", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneArtProductTechniqueSchema,
    handler: AdminController.GetOneArtProductTechnique,
  });

  fastify.get("/GetMaterialList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.MaterialSchema,
    handler: AdminController.MaterialList,
  });

  fastify.get("/GetArtProductBrandList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductBrandSchema,
    handler: AdminController.ArtProductBrandList,
  });

  fastify.get("/GetArtProductCategoryList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductCategorySchema,
    handler: AdminController.ArtProductCategoryList,
  });

  fastify.get("/GetArtProductFabricList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductFabricSchema,
    handler: AdminController.ArtProductFabricList,
  });

  fastify.get("/GetArtProductMaterialList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductMaterialSchema,
    handler: AdminController.ArtProductMaterialList,
  });

  fastify.get("/GetArtProductNameList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductNameSchema,
    handler: AdminController.ArtProductNameList,
  });

  fastify.get("/GetArtProductStyleList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductStyleSchema,
    handler: AdminController.ArtProductStyleList,
  });

  fastify.get("/GetArtProductSizeList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductSizeSchema,
    handler: AdminController.ArtProductSizeList,
  });

  fastify.get("/GetArtProductShapeList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductShapeSchema,
    handler: AdminController.ArtProductShapeList,
  });

  fastify.get("/GetArtProductTypeList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductTypeSchema,
    handler: AdminController.ArtProductTypeList,
  });

  fastify.get("/GetArtProductTechniqueList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtProductTechniqueSchema,
    handler: AdminController.ArtProductTechniqueList,
  });
  // keyword routes
  fastify.post("/AddKeyword", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddKeywordSchema,
    handler: AdminController.AddKeyword,
  });

  fastify.post("/EditKeyword", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditKeywordSchema,
    handler: AdminController.EditKeyword,
  });

  fastify.post("/GetOneKeyword", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneKeywordSchema,
    handler: AdminController.GetOneKeyword,
  });

  fastify.get("/GetKeywordList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.KeywordSchema,
    handler: AdminController.KeywordList,
  });

  // News routes
  fastify.post("/AddNews", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddNewsSchema,
    handler: AdminController.AddNews,
  });

  fastify.post("/UpdateNewsImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.NewsImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/EditNews", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditNewsSchema,
    handler: AdminController.EditNews,
  });

  fastify.post("/GetOneNews", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneNewsSchema,
    handler: AdminController.GetOneNews,
  });

  fastify.get("/GetNewsList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.NewsSchema,
    handler: AdminController.NewsList,
  });

  fastify.get("/GetFeaturesList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.FeaturesSchema,
    handler: AdminController.FeaturesList,
  });

  fastify.post("/GetOneFeatures", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneFeaturesSchema,
    handler: AdminController.GetOneFeatures,
  });

  fastify.post("/AddFeatures", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddFeaturesSchema,
    handler: AdminController.AddFeatures,
  });

  fastify.post("/EditFeatures", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditFeaturesSchema,
    handler: AdminController.EditFeatures,
  });

  fastify.post("/UpdateFeaturesImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.FeaturesImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.get("/GetEventsList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EventsSchema,
    handler: AdminController.EventsList,
  });

  fastify.get("/GetTeamList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.FoundersSchema,
    handler: AdminController.FoundersList,
  });

  fastify.post("/UpdateTeamImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.TeamImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/AddTeamMember", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.AddTeamSchema,
    handler: AdminController.AddTeam,
  });

  fastify.post("/EditTeamMember", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditTeamSchema,
    handler: AdminController.EditTeams,
  });

  fastify.post("/GetOneTeamMember", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneTeamsSchema,
    handler: AdminController.GetOneTeam,
  });

  fastify.post("/AddEvents", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddEventsSchema,
    handler: AdminController.AddEvents,
  });

  fastify.post("/EditEvents", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditEventsSchema,
    handler: AdminController.EditEvents,
  });

  fastify.post("/GetOneEvents", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneEventsSchema,
    handler: AdminController.GetOneEvents,
  });

  fastify.post("/UpdateEventsImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.EventsImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/AddNewsAuthor", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddNewsAuthorSchema,
    handler: AdminController.AddNewsAuthor,
  });

  fastify.post("/UpdateNewsAuthorImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.NewsAuthorImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/EditNewsAuthor", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditNewsAuthorSchema,
    handler: AdminController.EditNewsAuthor,
  });

  fastify.post("/GetOneNewsAuthor", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneNewsAuthorSchema,
    handler: AdminController.GetOneNewsAuthor,
  });

  fastify.get("/GetNewsAuthorList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.NewsAuthorSchema,
    handler: AdminController.NewsAuthorList,
  });

  fastify.get("/GetCMSList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.CMSSchema,
    handler: AdminController.CMSList,
  });

  fastify.post("/EditCms", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditCmsSchema,
    handler: AdminController.EditCMS,
  });

  fastify.post("/GetOneCms", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneCmsSchema,
    handler: AdminController.GetOneCMS,
  });

  // Styles routes
  fastify.post("/AddStyles", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddStylesSchema,
    handler: AdminController.AddStyles,
  });

  fastify.post("/EditStyles", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditStylesSchema,
    handler: AdminController.EditStyles,
  });

  fastify.post("/GetOneStyles", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneStylesSchema,
    handler: AdminController.GetOneStyles,
  });

  fastify.get("/GetStylesList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.StylesSchema,
    handler: AdminController.StylesList,
  });

  fastify.get("/GetNotifications", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.NotificationSchema,
    handler: AdminController.NotificationList,
  });

  fastify.get("/GetCollectionList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.CollectionSchema,
    handler: AdminController.CollectionList,
  });

  fastify.get("/GetArtworkList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtworkSchema,
    handler: AdminController.ArtworkList,
  });

  fastify.get("/GetArtproductList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ArtproductSchema,
    handler: AdminController.ArtproductList,
  });

  fastify.post("/GetOneCollection", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneCollectionSchema,
    handler: AdminController.GetOneCollection,
  });

  fastify.post("/GetOneArtwork", {
    preHandler: [fastify.domainauthenticate],
    schema: AdminSchema.GetOneArtworkSchema,
    handler: AdminController.GetOneArtwork,
  });

  fastify.post("/EditNetwork", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditNetworkSchema,
    handler: AdminController.EditNetwork,
  });

  fastify.post("/EditArtItemAccountStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditArtAccountStatusSchema,
    handler: AdminController.UpdateArtworkStatus,
  });

  fastify.post("/BulkArtItemApprove", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.BulkArtworkApproveSchema,
    handler: AdminController.BulkUpdateArtworkStatus,
  });

  fastify.post("/EditMediaLimit", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditMediaLimitSchema,
    handler: AdminController.EditMediaLimit,
  });

  fastify.post("/GetOneNetwork", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneNetworkSchema,
    handler: AdminController.GetOneNetwork,
  });

  fastify.post("/GetOneMediaLimit", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneMediaLimitSchema,
    handler: AdminController.GetOneMediaLimit,
  });

  fastify.get("/GetNetworkList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.NetworkSchema,
    handler: AdminController.NetworkList,
  });

  fastify.get("/GetWithdrawHistoryList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.WithdrawHistorySchema,
    handler: AdminController.WithdrawHistoryList,
  });

  fastify.get("/GetAdminBalanceDetails", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AdminBalanceSchema,
    handler: AdminController.AdminBalanceList,
  });

  fastify.post("/WithdrawAdminBalance", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.WithdrawSchema,
    handler: AdminController.AdminWithdraw(fastify),
  });

  fastify.get("/GetMediaLimitList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.MediaLimitSchema,
    handler: AdminController.MediaLimitList,
  });

  fastify.get("/GetCsvSamples", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.CsvSampleSchema,
    handler: AdminController.CsvSamplesList,
  });

  fastify.post("/UploadCsvSamples", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.CsvUpdate,
    ],
    schema: AdminSchema.csvUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/UpdateCsvSamples", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.updatecsvSchema,
    handler: AdminController.CsvsampleUpdate(fastify),
  });

  fastify.post("/UpdateLandingSection1Image", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.Section1ImageUpdate,
    ],
    schema: AdminSchema.singleImageUploadSchema,
    handler: AdminController.SingleVideoUpload,
  });

  fastify.post("/UpdateLandingSection1", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.landingSection1Schema,
    handler: AdminController.LandingSection1(fastify),
  });

  fastify.post("/UpdateAboutusCMS", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UpdateAboutSchema,
    handler: AdminController.AboutusSection(fastify),
  });

  fastify.post("/UpdateAboutImage", {
    preHandler: [
      fastify.domainauthenticate,
      AdminController.ArtistCategoryImageUpdate,
    ],
    schema: AdminSchema.AboutImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/UpdateBannerVideo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.Section1ImageUpdate,
    ],
    schema: AdminSchema.BannerImageSchema,
    handler: AdminController.SingleVideoUpload,
  });

  fastify.post("/UpdateBanner", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.BannerSchema,
    handler: AdminController.Banner(fastify),
  });

  fastify.get("/GetBannerDetails", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetBannerDetails,
    handler: AdminController.GetBannerDetails(fastify),
  });

  fastify.post("/UpdateInnerBannerImage", {
    preHandler: [AdminController.Section1ImageUpdate],
    schema: AdminSchema.InnerBannerImageSchema,
    handler: AdminController.SingleVideoUpload,
  });

  fastify.post("/UpdateInnerBanner", {
    schema: AdminSchema.InnerBannerSchema,
    handler: AdminController.InnerBanner(fastify),
  });

  fastify.get("/GetInnerBannerDetails", {
    schema: AdminSchema.GetInnerBannerDetails,
    handler: AdminController.GetInnerBannerDetails(fastify),
  });

  fastify.post("/UpdateLandingSection2Image", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.Section2ImageUpdate,
    ],
    schema: AdminSchema.multiImageUploadSchema,
    handler: AdminController.MultiImageUpload,
  });

  fastify.post("/UpdateLandingSection2", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.landingSection2Schema,
    handler: AdminController.LandingSection2(fastify),
  });

  fastify.post("/UpdateLandingSection3Image", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.Section3ImageUpdate,
    ],
    schema: AdminSchema.singleImageUploadSchema,
    handler: AdminController.SingleImageUpload,
  });

  fastify.post("/UpdateLandingSection3", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.landingSection3Schema,
    handler: AdminController.LandingSection3(fastify),
  });

  fastify.get("/GetLandingPageDetails", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetLandingPageDetails,
    handler: AdminController.GetLandingPageDetails(fastify),
  });

  fastify.get("/GetAboutusPageDetails", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetAboutusPageDetails,
    handler: AdminController.GetAboutusPageDetails(fastify),
  });

  fastify.post("/LogoFavFilesUpload", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.LogoFavFilesUpload,
    ],
    schema: AdminSchema.LogoFaviconUploadSchema,
    handler: AdminController.MultiImageUpload,
  });

  fastify.post("/UpdateLogoFavicon", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.LogoFaviconSchema,
    handler: AdminController.LogoFavicon(fastify),
  });

  fastify.get("/Dashboard", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.dashboardSchema,
    handler: AdminController.Dashboard,
  });

  fastify.get("/GetHistoryList", {
    schema: AdminSchema.HistorySchema,
    handler: AdminController.HistoryList,
  });

  fastify.get("/GetBioList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.BioSchema,
    handler: AdminController.BioList,
  });

  fastify.post("/EditBioStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditBioSchema,
    handler: AdminController.EditBioStatus,
  });

  fastify.post("/EditTestimonialStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditTestimonialSchema,
    handler: AdminController.EditTestimonialStatus,
  });

  fastify.post("/EditMediaStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditMediaSchema,
    handler: AdminController.EditMediaStatus,
  });

  fastify.post("/EditExhibtionStatus", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditExhibtionSchema,
    handler: AdminController.EditExhibtionStatus,
  });

  fastify.get("/GetTestimonial", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.TestimonialSchema,
    handler: AdminController.TestimonialList,
  });

  fastify.get("/GetMedias", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.MediasSchema,
    handler: AdminController.MediasList,
  });

  fastify.get("/GetExhibition", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.ExhibtionSchema,
    handler: AdminController.ExhibitionList,
  });

  fastify.get("/GetVisitors", { handler: AdminController.GetVisitors });

  fastify.get("/GetBidList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.BidSchema,
    handler: AdminController.BidList,
  });

  fastify.get("/GetOfferList", {
    schema: AdminSchema.OfferSchema,
    handler: AdminController.OfferList,
  });

  fastify.get("/GetUserRoleInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.UserRoleInfoSchema,
    handler: AdminController.GetUserRoles,
  });

  fastify.post("/GetOneUserRoleInfo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneUserRoleSchema,
    handler: AdminController.GetOneUserRole,
  });

  fastify.post("/EditUserAgreement", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditUserRoleAgreementSchema,
    handler: AdminController.EditUserRoleAgreement,
  });

  fastify.post("/GiftNftThumb", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.GiftNftThumbImageUpdate,
    ],
    schema: AdminSchema.GiftNftThumbUploadSchema,
    handler: AdminController.SingleImageUploadss,
  });

  fastify.post("/GiftNftMedia", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.GiftNftMediaImageUpdate,
    ],
    schema: AdminSchema.GiftNftMediaUploadSchema,
    handler: AdminController.SingleImageUploadss,
  });

  fastify.post("/AddGiftNft", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.AddGiftNftSchema,
    handler: AdminController.AddGiftNFT,
  });

  fastify.post("/EditGiftNft", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.EditGiftNFTSchema,
    handler: AdminController.EditGiftNFT,
  });

  fastify.post("/MintGiftNft", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.MintGiftNFTSchema,
    handler: AdminController.MintGiftNft(fastify),
  });

  fastify.post("/MintArtwork", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.MintArtworkSchema,
    handler: AdminController.MintArtwork(fastify),
  });

  fastify.post("/SellRequest", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.SellRequestSchema,
    handler: AdminController.SellRequest(fastify),
  });

  fastify.get("/GetGiftNFTList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GiftNFTSchema,
    handler: AdminController.GiftNFTList,
  });

  fastify.post("/GetOneGiftNFT", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GetOneGiftNftSchema,
    handler: AdminController.GetOneGiftNFT,
  });

  fastify.post("/GetArtEdition", {
    schema: AdminSchema.GetArtEditionSchema,
    handler: AdminController.GetArtEdition,
  });

  fastify.get("/GetGiftNFTHistoryList", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
    ],
    schema: AdminSchema.GiftHistorySchema,
    handler: AdminController.GiftHistoryList,
  });

  fastify.post("/UpdateMetamaskVideo", {
    preHandler: [
      fastify.domainauthenticate,
      fastify.authenticate,
      fastify.serverauthenticate,
      AdminController.Section1ImageUpdate,
    ],
    schema: AdminSchema.MetamaskImageSchema,
    handler: AdminController.SingleVideoUpload,
  });

  done();
}

module.exports = AdminRoutes;
