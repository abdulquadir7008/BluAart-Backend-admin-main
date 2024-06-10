/* Admin Authentication Schema */

exports.AuthenticationSchema = {
  tags: ["Authentication"],
  summary: "To Authentication",
  body: {
    description: "Login params",
    type: "object",
    required: ["Email", "Password"],
    properties: {
      Email: {
        type: "string",
        format: "email",
        description: "Email ID",
      },
      Password: {
        type: "string",
        description: "Password",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        auth2: { type: "boolean" },
        response: { type: "string" },
        message: { type: "string" },
        AuthId: { type: "number" },
      },
    },
  },
};

exports.Network2FASchema = {
  tags: ["Network"],
  summary: "Network 2FA",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        response: { type: "string" },
        message: { type: "string" },
      },
    },
  },
};

exports.WithdrawSchema = {
  tags: ["Admin Balance"],
  summary: "To Withdraw",
  body: {
    description: "Withdraw params",
    type: "object",
    required: ["Amount", "WalletAddress", "Currency"],
    properties: {
      Amount: {
        type: "string",
      },
      WalletAddress: {
        type: "string",
        description: "Ethereum Wallet Address",
        pattern: "^0x[0-9a-fA-F]{40}$",
      },
      Currency: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

/* Admin Verify 2FA Schema */

exports.Verify2FASchema = {
  tags: ["Authentication"],
  summary: "To Verify 2FA",
  body: {
    description: "Verify 2FA params",
    type: "object",
    required: ["Token", "OTP"],
    properties: {
      Token: {
        type: "string",
        description: "Token",
      },
      OTP: {
        type: "number",
        description: "OTP",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        response: { type: "string" },
        AuthId: { type: "string" },
      },
    },
  },
};

exports.NetworkVerify2FASchema = {
  tags: ["Network"],
  summary: "To Verify 2FA",
  body: {
    description: "Verify 2FA params",
    type: "object",
    required: ["Token", "OTP"],
    properties: {
      Token: {
        type: "string",
        description: "Token",
      },
      OTP: {
        type: "number",
        description: "OTP",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

/* Forgot Password Schema */

exports.ForgotPasswordSchema = {
  tags: ["Admin"],
  summary: "Forgot Password",
  body: {
    description: "Forgot Password Params",
    type: "object",
    required: ["Email"],
    properties: {
      Email: {
        type: "string",
        format: "email",
        description: "Email ID of the Account",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

/* Reset Password Schema */

exports.ResetPasswordSchema = {
  tags: ["Admin"],
  summary: "Reset Password",
  body: {
    description: "Reset Password Params",
    type: "object",
    required: ["ResetToken", "NewPassword"],
    properties: {
      ResetToken: {
        type: "string",
      },
      NewPassword: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Settings */

exports.SettingSchema = {
  tags: ["Settings"],
  summary: "Get Current System Settings Info",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Register: { type: "boolean" },
            Login: { type: "boolean" },
            ProfileUpdate: { type: "boolean" },
            KycUpdate: { type: "boolean" },
            Admin2FA: { type: "boolean" },
            EmailType: { type: "string" },
            SocialLinks: {
              type: "object",
              properties: {
                Facebook: { type: "string" },
                Twitter: { type: "string" },
                Linkedin: { type: "string" },
                Pinterest: { type: "string" },
                Youtube: { type: "string" },
                Instagram: { type: "string" },
              },
            },
            ProjectDetails: {
              type: "object",
              properties: {
                Logo: {
                  type: "string",
                },
                Favicon: {
                  type: "string",
                },
                ProjectName: { type: "string" },
                GoogleRecaptchaStatus: { type: "string" },
                CopyrightYear: { type: "string" },
                ContactEmail: { type: "string" },
                Weblink: { type: "string" },
              },
            },
            FooterLinks: {
              type: "object",
              properties: {
                Aboutus: { type: "string" },
                Events: { type: "string" },
                Press: { type: "string" },
                Support: { type: "string" },
                Features: { type: "string" },
                Terms: { type: "string" },
                Privacy: { type: "string" },
                Followus: { type: "string" },
              },
            },
            Captcha: {
              type: "object",
              properties: {
                SiteKey: { type: "string" },
                SecretKey: { type: "string" },
              },
            },
            SendGrid: {
              type: "object",
              properties: {
                User: { type: "string" },
                ApiKey: { type: "string" },
              },
            },
            Smtp: {
              type: "object",
              properties: {
                Host: { type: "string" },
                Port: { type: "string" },
                User: { type: "string" },
                Password: { type: "string" },
                Audience: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Users */

exports.UserListSchema = {
  tags: ["Users"],
  summary: "Get Users List",
  query: {
    description: "Get Users List",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.GetUserListSchema = {
  tags: ["Users"],
  summary: "Get Users List",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.SearchUsersSchema = {
  tags: ["Users"],
  summary: "Search Users",
  query: {
    description: "Search Users",
    type: "object",
    properties: {
      page: { type: "string" },
      limit: { type: "string" },
      email: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      accountStatus: { type: "string" },
      role: { type: "string" },
      kycStatus: {
        type: "string",
        enum: ["Pending", "Approved", "Rejected", "not_uploaded"],
      },
    },
    required: ["page", "limit"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Email: { type: "string" },
              UserId: { type: "number" },
              ProfileImage: { type: "string" },
              Password: { type: "string" },
              ReferralCode: { type: "string" },
              ReferredBy: { type: "string" },
              FirstName: { type: "string" },
              LastName: { type: "string" },
              PhoneNo: { type: "number" },
              CountryCode: { type: "string" },
              KycStatus: {
                type: "string",
                enum: ["Pending", "Approved", "Rejected", "not_uploaded"],
              },
              AccountStatus: { type: "number" },
              Passport: { type: "boolean" },
              License: { type: "boolean" },
              IdCard: { type: "boolean" },
              PassportInfo: {
                type: "object",
                properties: {
                  Front: { type: "string" },
                  Back: { type: "string" },
                },
              },
              LicenseInfo: {
                type: "object",
                properties: {
                  Front: { type: "string" },
                  Back: { type: "string" },
                },
              },
              IdInfo: {
                type: "object",
                properties: {
                  Front: { type: "string" },
                  Back: { type: "string" },
                },
              },
              ResetToken: { type: "string" },
              ResetExpiry: { type: "number" },
              UserName: { type: "string" },
              Role: { type: "string" },
              WalletAddress: { type: "string" },
              Address1: { type: "string" },
              Address2: { type: "string" },
              MobileNo: { type: "number" },
              Country: { type: "string" },
              City: { type: "string" },
              State: { type: "string" },
              Pincode: { type: "number" },
              ProofProfileName: { type: "string" },
              AddressProof: { type: "string" },
              IdentityProof: { type: "string" },
              ProfileName: { type: "string" },
              CoverVideo: { type: "string" },
              ProfilePicture: { type: "string" },
              UrlLink: { type: "array", items: { type: "string" } },
              Styles: { type: "array", items: { type: "string" } },
              Medium: { type: "array", items: { type: "string" } },
              Terms: { type: "number" },
              Subscription: { type: "number" },
              Agreement: { type: "number" },
              Steps: { type: "number" },
              FeaturedArtist: { type: "boolean" },
            },
          },
        },
      },
    },
  },
};

exports.CommonSearchSchema = {
  tags: ["Common"],
  summary: "Common Search",
  query: {
    description: "Common Search",
    type: "object",
    properties: {
      collectionName: { type: "string" },
      keyword: { type: "string" },
      page: { type: "string" },
      limit: { type: "string" },
    },
    required: ["collectionName", "keyword", "page", "limit"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: { type: "array" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: { type: "array", items: {} },
      },
    },
  },
};

/* Schema For to Get Admin */

exports.AdminListSchema = {
  tags: ["Admin"],
  summary: "Get Admin List",
  query: {
    description: "Get Admin List",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Email: { type: "string" },
              UserName: { type: "string" },
              Role: { type: "string" },
              Status: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Admin Roles */

exports.AdminRoleSchema = {
  tags: ["Admin"],
  summary: "Get Admin Roles",
  query: {
    description: "Get Admin Roles",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
          count: { type: "number" },
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Role: { type: "string" },
              Modules: {
                type: "object",
                properties: {
                  UserModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  SettingsModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  EmailTemplateModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  BioModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  TestimonialModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ExhibitionModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  CategoriesModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  MediumModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  MaterialModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  KeywordModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  NewsModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  CMSModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  NFTBlockchainModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  StylesModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  CollectionModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ArtworkModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  NetworkModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  LandingModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  HistoryModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ArtfairModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ArtcollectionModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  BidModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  OfferModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  UserRoleModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  MediaModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ArtistCategoryModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ArtistStyleModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ArtistMediumModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  ArtistLabelModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                  GiftModule: {
                    type: "object",
                    properties: {
                      Read: { type: "boolean" },
                      Write: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

exports.AdminRolesSchema = {
  tags: ["Admin"],
  summary: "Get Admin Roles",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Role: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Referred User's List By Id */

exports.ReferredUsersListSchema = {
  tags: ["Users"],
  summary: "To Get Referred User's List",
  body: {
    description: "Referred User's List params",
    type: "object",
    required: ["UserId"],
    properties: {
      UserId: {
        type: "string",
        description: "User Unique ID",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              Email: { type: "string" },
              ReferralCode: { type: "string" },
              FirstName: { type: "string" },
              LastName: { type: "string" },
              AccountStatus: { type: "number" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Kyc Info */

exports.KycInfoSchema = {
  tags: ["Users"],
  summary: "To Get User Kyc Info",
  body: {
    description: "To Get User Kyc Info",
    type: "object",
    required: ["UserId"],
    properties: {
      UserId: {
        type: "string",
        description: "User Unique ID",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Personal Info */

exports.PersonalInfoSchema = {
  tags: ["Users"],
  summary: "To Get Personal Info",
  body: {
    description: "To Get Personal Info",
    type: "object",
    required: ["UserId"],
    properties: {
      UserId: {
        type: "string",
        description: "User Unique ID",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema to Update User Account Status */

exports.AccountStatusUpdateSchema = {
  tags: ["Users"],
  summary: "To Update User Account Status",
  body: {
    description: "To Update User Account Status",
    type: "object",
    required: ["UserId", "AccountStatus"],
    properties: {
      UserId: {
        type: "string",
        description: "User Unique ID",
      },
      AccountStatus: {
        type: "boolean",
        description: "Account Status",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.FeatureStatusUpdateSchema = {
  tags: ["Admin"],
  summary: "To Update Artist Pinned Status",
  body: {
    description: "To Update Artist Pinned Status",
    type: "object",
    required: ["UserId", "FeaturedStatus"],
    properties: {
      UserId: {
        type: "string",
        description: "User Unique ID",
      },
      FeaturedStatus: {
        type: "boolean",
        description: "Featured Status",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.CountryStatusSchema = {
  tags: ["Countries"],
  summary: "To Update Country Status",
  body: {
    description: "To Update Country Status",
    type: "object",
    required: ["Id", "Status"],
    properties: {
      Id: {
        type: "number",
        description: "Country ID",
      },
      Status: {
        type: "boolean",
        description: "Status",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Update Kyc Status */

exports.KycStatusUpdateSchema = {
  tags: ["Users"],
  summary: "To Update User KYC Status",
  body: {
    description: "To Update User KYC Status",
    type: "object",
    required: ["UserId", "KycStatus"],
    properties: {
      UserId: {
        type: "string",
        description: "User Unique ID",
      },
      KycStatus: {
        type: "string",
        description: "KYC Status",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Admin */

exports.AddAdminSchema = {
  tags: ["Admin"],
  summary: "To Add Admin",
  body: {
    description: "To Add Admin",
    type: "object",
    required: ["UserName", "Email", "Password", "Role", "Status"],
    properties: {
      UserName: {
        type: "string",
      },
      Email: {
        type: "string",
        format: "email",
      },
      Password: {
        type: "string",
      },
      Role: {
        type: "string",
      },
      Status: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Admin */

exports.AddAdminRoleSchema = {
  tags: ["Admin"],
  summary: "To Add Admin Role",
  body: {
    description: "To Add Admin Role",
    type: "object",
    required: ["Role", "Modules"],
    properties: {
      Role: {
        type: "string",
      },
      Modules: {
        type: "object",
        properties: {
          UserModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          SettingsModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          EmailTemplateModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          BioModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          TestimonialModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ExhibitionModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          CategoriesModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          MediumModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          MaterialModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          KeywordModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          NewsModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          CMSModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          NFTBlockchainModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          StylesModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          CollectionModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtworkModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          NetworkModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          LandingModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          HistoryModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtfairModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtcollectionModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          BidModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          OfferModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          UserRoleModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          MediaModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistCategoryModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistStyleModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistMediumModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistLabelModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          GiftModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Admin Role */

exports.EditAdminRoleSchema = {
  tags: ["Admin"],
  summary: "To Edit Admin Role",
  body: {
    description: "To Edit Admin Role",
    type: "object",
    required: ["Role", "Modules", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Role: {
        type: "string",
      },
      Modules: {
        type: "object",
        properties: {
          UserModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          SettingsModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          EmailTemplateModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          BioModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          TestimonialModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ExhibitionModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          CategoriesModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          MediumModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          MaterialModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          KeywordModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          NewsModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          CMSModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          NFTBlockchainModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          StylesModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          CollectionModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtworkModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          NetworkModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          LandingModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          HistoryModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtfairModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtcollectionModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          BidModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          OfferModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          UserRoleModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          MediaModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistCategoryModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistStyleModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistMediumModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          ArtistLabelModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
          GiftModule: {
            type: "object",
            properties: {
              Read: { type: "boolean" },
              Write: { type: "boolean" },
            },
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Categories */

exports.EditCategoriesSchema = {
  tags: ["Admin"],
  summary: "To Edit Categories",
  body: {
    description: "To Edit Categories",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditBioSchema = {
  tags: ["Bio"],
  summary: "To Edit Bio Status",
  body: {
    description: "To Edit Bio Status",
    type: "object",
    required: ["Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditMediaSchema = {
  tags: ["Media & Publication"],
  summary: "To Edit Media Status",
  body: {
    description: "To Edit Media Status",
    type: "object",
    required: ["Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditExhibtionSchema = {
  tags: ["Exhibition"],
  summary: "To Edit Exhibtion Status",
  body: {
    description: "To Edit Exhibtion Status",
    type: "object",
    required: ["Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditTestimonialSchema = {
  tags: ["Testimonial"],
  summary: "To Edit Testimonial Status",
  body: {
    description: "To Edit Testimonial Status",
    type: "object",
    required: ["Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Update Admin */

exports.UpdateAdminSchema = {
  tags: ["Admin"],
  summary: "To Update Admin",
  body: {
    description: "To Update Admin",
    type: "object",
    required: ["UserName", "Email", "Password", "Role", "Status", "Id"],
    properties: {
      UserName: {
        type: "string",
      },
      Email: {
        type: "string",
        format: "email",
      },
      Password: {
        type: "string",
      },
      Role: {
        type: "string",
      },
      Status: {
        type: "string",
      },
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Update Email Templates */

exports.UpdateEmailTemplatesSchema = {
  tags: ["Email Templates"],
  summary: "To Update Email Templates",
  body: {
    description: "To Update Email Templates",
    type: "object",
    required: ["Subject", "Html", "Id"],
    properties: {
      Subject: {
        type: "string",
      },
      Html: {
        type: "string",
      },
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Email Templates */

exports.GetEmailTemplateSchema = {
  tags: ["Email Templates"],
  summary: "Get Email Templates Info",
  query: {
    description: "Get Email Templates Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Category: { type: "string" },
              Subject: { type: "string" },
              Html: { type: "string" },
              createdAt: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Email Template Info */

exports.GetOneEmailTemplateSchema = {
  tags: ["Email Templates"],
  summary: "Get One Email Templates Info",
  body: {
    description: "To Get One Email Template Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Category: { type: "string" },
            Subject: { type: "string" },
            Html: { type: "string" },
            createdAt: { type: "string" },
          },
        },
      },
    },
  },
};

exports.GetOneBioSchema = {
  tags: ["Bio"],
  summary: "Get One Bio Info",
  body: {
    description: "To Get One Bio Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Status: { type: "string" },
            Overview: { type: "string" },
            Inspired: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
  },
};

exports.GetOneArtfairSchema = {
  tags: ["Artfair"],
  summary: "Get One Artfair Info",
  body: {
    description: "To Get One Artfair Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: { type: "string" },
            Year: { type: "string" },
            Location: { type: "string" },
            Image: {
              type: "object",
              properties: {
                CDN: { type: "string" },
                CCDN: { type: "string" },
                Local: { type: "string" },
                CLocal: { type: "string" },
              },
            },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
  },
};

exports.GetOneArtcollectionSchema = {
  tags: ["Artcollection"],
  summary: "Get One Artcollection Info",
  body: {
    description: "To Get One Artcollection Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: { type: "string" },
            Year: { type: "string" },
            Location: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
  },
};

exports.GetOneTestimonialSchema = {
  tags: ["Testimonial"],
  summary: "Get One Testimonial Info",
  body: {
    description: "To Get One Testimonial Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Provider: { type: "string" },
            Description: { type: "string" },
            Status: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
  },
};

exports.GetOneExhibitionSchema = {
  tags: ["Exhibition"],
  summary: "Get One Exhibition Info",
  body: {
    description: "To Get One Exhibition Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Status: { type: "string" },
            Title: { type: "string" },
            Type: { type: "string" },
            Year: { type: "number" },
            Institude: { type: "string" },
            Location: { type: "string" },
            Image: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneMediaSchema = {
  tags: ["Media & Publication"],
  summary: "Get One Media & Publication Info",
  body: {
    description: "To Get One Media & Publication Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: { type: "string" },
            Status: { type: "string" },
            Description: { type: "string" },
            Type: { type: "string" },
            Author: { type: "string" },
            Year: { type: "number" },
            Link: { type: "string" },
            Published: { type: "string" },
            Image: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Admin Info */

exports.GetOneAdminSchema = {
  tags: ["Admin"],
  summary: "Get One Admin Info",
  body: {
    description: "To Get One Admin Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            UserName: { type: "string" },
            Email: { type: "string" },
            Role: { type: "string" },
            Status: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
        roleinfo: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Single Admin Role Info */

exports.GetOneAdminRoleSchema = {
  tags: ["Admin"],
  summary: "Get One Admin Role Info",
  body: {
    description: "To Get One Admin Role Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Role: { type: "string" },
            Modules: {
              type: "object",
              properties: {
                UserModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                SettingsModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                EmailTemplateModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                BioModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                TestimonialModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ExhibitionModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                CategoriesModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                MediumModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                MaterialModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                KeywordModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                NewsModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                CMSModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                NFTBlockchainModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                StylesModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                CollectionModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ArtworkModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                NetworkModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                LandingModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                HistoryModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ArtfairModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ArtcollectionModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                BidModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                OfferModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                UserRoleModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                MediaModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ArtistCategoryModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ArtistStyleModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ArtistMediumModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                ArtistLabelModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
                GiftModule: {
                  type: "object",
                  properties: {
                    Read: { type: "boolean" },
                    Write: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Admin Role Info */

exports.GetOneUserRoleSchema = {
  tags: ["UserRole"],
  summary: "Get One User Role Info",
  body: {
    description: "To Get One User Role Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Role: { type: "string" },
            Agreement: { type: "string" },
            Kyc: { type: "boolean" },
            Status: { type: "boolean" },
          },
        },
      },
    },
  },
};

/* Schema for to Update Project Settings */

exports.UpdateProjectSettingsSchema = {
  tags: ["Settings"],
  summary: "Update Project Settings",
  body: {
    description: "Update Project Settings",
    type: "object",
    required: [
      "ProjectName",
      "GoogleRecaptchaStatus",
      "CopyrightYear",
      "ContactEmail",
      "Weblink",
    ],
    properties: {
      ProjectName: {
        type: "string",
      },

      GoogleRecaptchaStatus: {
        type: "string",
      },
      CopyrightYear: {
        type: "string",
      },
      ContactEmail: {
        type: "string",
        format: "email",
      },
      Weblink: {
        type: "string",
        format: "uri",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema for to Update Module Enable Settings */

exports.UpdateModuleEnableSchema = {
  tags: ["Settings"],
  summary: "Update Module Settings",
  body: {
    description: "Update Module Settings",
    type: "object",
    required: ["Register", "Login", "ProfileUpdate", "KycUpdate", "Admin2FA"],
    properties: {
      Register: {
        type: "boolean",
      },
      Login: {
        type: "boolean",
      },
      ProfileUpdate: {
        type: "boolean",
      },
      KycUpdate: {
        type: "boolean",
      },
      Admin2FA: {
        type: "boolean",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema for to Update Social Media Settings */

exports.UpdateSocialMediaSchema = {
  tags: ["Settings"],
  summary: "Update Social Media Settings",
  body: {
    description: "Update Social Media Settings",
    type: "object",
    required: [
      "Facebook",
      "Twitter",
      "Linkedin",
      "Pinterest",
      "Youtube",
      "Instagram",
    ],
    properties: {
      Facebook: {
        type: "string",
        format: "uri",
      },
      Twitter: {
        type: "string",
        format: "uri",
      },
      Linkedin: {
        type: "string",
        format: "uri",
      },
      Pinterest: {
        type: "string",
        format: "uri",
      },
      Youtube: {
        type: "string",
        format: "uri",
      },
      Instagram: {
        type: "string",
        format: "uri",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema for to Update Footer Links */

exports.UpdateFooterLinkSchema = {
  tags: ["Settings"],
  summary: "Update Footer Links",
  body: {
    description: "Update Footer Link Settings",
    type: "object",
    required: [
      "Aboutus",
      "Events",
      "Press",
      "Support",
      "Features",
      "Terms",
      "Privacy",
      "Followus",
    ],
    properties: {
      Aboutus: {
        type: "string",
        format: "uri",
      },
      Events: {
        type: "string",
        format: "uri",
      },
      Press: {
        type: "string",
        format: "uri",
      },
      Support: {
        type: "string",
        format: "uri",
      },
      Features: {
        type: "string",
        format: "uri",
      },
      Terms: {
        type: "string",
        format: "uri",
      },
      Privacy: {
        type: "string",
        format: "uri",
      },
      Followus: {
        type: "string",
        format: "uri",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema for to Update Social Login Details */

exports.UpdateSocialLoginDetailSchema = {
  tags: ["Settings"],
  summary: "Update Social Login Details",
  body: {
    description: "Update Social Login Details",
    type: "object",
    required: [
      "GoogleClientId",
      "GoogleSecret",
      "FacebookId",
      "FacebookSecret",
      "AppleId",
      "AppleSecret",
    ],
    properties: {
      GoogleClientId: {
        type: "string",
      },
      GoogleSecret: {
        type: "string",
      },
      FacebookId: {
        type: "string",
      },
      FacebookSecret: {
        type: "string",
      },
      AppleId: {
        type: "string",
      },
      AppleSecret: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema for to Update Captcha Settings */

exports.UpdateCaptchaSchema = {
  tags: ["Settings"],
  summary: "Update Captcha Settings",
  body: {
    description: "Update Captcha Settings",
    type: "object",
    required: ["SiteKey", "SecretKey"],
    properties: {
      SiteKey: {
        type: "string",
      },
      SecretKey: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema for to Update Email Settings */

exports.UpdateEmailSettingsSchema = {
  tags: ["Settings"],
  summary: "Update Email Settings",
  body: {
    description: "Update Email Settings",
    type: "object",
    required: ["EmailType"],
    properties: {
      EmailType: {
        type: "string",
      },
      Host: {
        type: "string",
      },
      Port: {
        type: "number",
      },
      User: {
        type: "string",
      },
      Password: {
        type: "string",
      },
      Audience: {
        type: "string",
      },
      SendGridUser: {
        type: "string",
      },
      SendGridApiKey: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Language List */

exports.LanguageListSchema = {
  tags: ["Languages"],
  summary: "To Get Languages List",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              Name: { type: "string" },
              Value: { type: "string" },
              Status: { type: "boolean" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Activity List */

exports.ActivityListSchema = {
  tags: ["Admin"],
  summary: "To Get Activities List",
  query: {
    description: "Get Activities Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              Email: { type: "string" },
              Action: { type: "string" },
              Ip: { type: "string" },
              Status: { type: "string" },
              Device: { type: "string" },
              Reason: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.dashboardSchema = {
  tags: ["Admin"],
  summary: "Get dashboard details",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        ArtistCount: { type: "number" },
        BuyerCount: { type: "number" },
        CollectorCount: { type: "number" },
        TotalCollections: { type: "number" },
        TotalArtItem: { type: "number" },
        CorperateCollectorCount: { type: "number" },
        TotalProductItem: { type: "number" },
        TotalItem: { type: "number" },
        TotalGift: { type: "number" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

/* Schema For to Get BlackList */

exports.BlackListSchema = {
  tags: ["Admin"],
  summary: "To Get BlackList",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              Type: { type: "string" },
              Value: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Add Language*/

exports.AddLanguageSchema = {
  tags: ["Languages"],
  summary: "To Add Language",
  body: {
    description: "Add Language params",
    type: "object",
    required: ["Name", "Value", "Status"],
    properties: {
      Name: {
        type: "string",
      },
      Value: {
        type: "string",
      },
      Status: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Add Black List*/

exports.AddBlacklistSchema = {
  tags: ["Admin"],
  summary: "To Add Blacklist",
  body: {
    description: "Add Blacklist params",
    type: "object",
    required: ["Type", "Value"],
    properties: {
      Type: {
        type: "string",
      },
      Value: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Delete Black List*/

exports.DeleteBlacklistSchema = {
  tags: ["Admin"],
  summary: "To Delete Blacklist",
  body: {
    description: "Delete Blacklist params",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Referred User's List By Id*/

exports.UpdateLanguageSchema = {
  tags: ["Languages"],
  summary: "To Update Language",
  body: {
    description: "Update Language params",
    type: "object",
    required: ["Name", "Value", "Status", "Id"],
    properties: {
      Name: {
        type: "string",
      },
      Value: {
        type: "string",
      },
      Status: {
        type: "string",
      },
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.ImageUpdateSchema = {
  tags: ["File Upload"],
  summary: "To Upload Files",
  body: {
    description: "File Upload Params",
    properties: {
      File: {
        type: "string",
        description: "Image should contain binary data such as a file upload",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Logofilepath: { type: "string" },
        Faviconfilepath: { type: "string" },
        message: { type: "string" },
      },
    },
  },
};

/* Schema to Add Categories */

exports.AddCategoriesSchema = {
  tags: ["Categories"],
  summary: "To Add Categories",
  body: {
    description: "To Add Categories",
    type: "object",
    required: ["Title", "Status", "Image"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Medium */

exports.AddMediumSchema = {
  tags: ["Medium"],
  summary: "To Add Medium",
  body: {
    description: "To Add Medium",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Artist Categories */

exports.AddArtistCategorySchema = {
  tags: ["Artist Categories"],
  summary: "To Add Artist Categories",
  body: {
    description: "To Add Artist Categories",
    type: "object",
    required: ["Title", "Status", "Image"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Gift NFT */

exports.AddGiftNftSchema = {
  tags: ["Gift NFT"],
  summary: "To Add Gift NFT",
  body: {
    description: "To Add Gift NFT",
    type: "object",
    required: [
      "Name",
      "Thumb",
      "Media",
      "IPFSThumb",
      "IPFSMedia",
      "Status",
      "Currency",
    ],
    properties: {
      Name: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Currency: {
        type: "string",
      },
      Thumb: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
      IPFSThumb: {
        type: "string",
      },
      Media: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
      IPFSMedia: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Artist Style */

exports.AddArtistStyleSchema = {
  tags: ["Artist Styles"],
  summary: "To Add Artist Styles",
  body: {
    description: "To Add Artist Styles",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtistLabelSchema = {
  tags: ["Artist Labels"],
  summary: "To Add Artist Labels",
  body: {
    description: "To Add Artist Labels",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtistMediumSchema = {
  tags: ["Artist Medium"],
  summary: "To Add Artist Medium",
  body: {
    description: "To Add Artist Medium",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Material */

exports.AddMaterialSchema = {
  tags: ["Material"],
  summary: "To Add Material",
  body: {
    description: "To Add Material",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductCategorySchema = {
  tags: ["Art Product Category"],
  summary: "To Add Art Product Category",
  body: {
    description: "To Add Art Product Category",
    type: "object",
    required: ["Title", "Status", "Image"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductBrandSchema = {
  tags: ["Art Product Brand"],
  summary: "To Add Art Product Brand",
  body: {
    description: "To Add Art Product Brand",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductFabricSchema = {
  tags: ["Art Product Fabric"],
  summary: "To Add Art Product Fabric",
  body: {
    description: "To Add Art Product Fabric",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductMaterialSchema = {
  tags: ["Art Product Material"],
  summary: "To Add Art Product Material",
  body: {
    description: "To Add Art Product Material",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductStyleSchema = {
  tags: ["Art Product Style"],
  summary: "To Add Art Product Style",
  body: {
    description: "To Add Art Product Style",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductNameSchema = {
  tags: ["Art Product Name"],
  summary: "To Add Art Product Name",
  body: {
    description: "To Add Art Product Name",
    type: "object",
    required: ["Title", "Type", "Status", "Image"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Type: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductSizeSchema = {
  tags: ["Art Product Size"],
  summary: "To Add Art Product Size",
  body: {
    description: "To Add Art Product Size",
    type: "object",
    required: ["Title", "Type", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Type: {
        type: "string",
        enum: ["Cushions", "Rugs"],
        default: "Cushions",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductShapeSchema = {
  tags: ["Art Product Shape"],
  summary: "To Add Art Product Shape",
  body: {
    description: "To Add Art Product Shape",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },

      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductTypeSchema = {
  tags: ["Art Product Type"],
  summary: "To Add Art Product Type",
  body: {
    description: "To Add Art Product Type",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },

      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddArtProductTechniqueSchema = {
  tags: ["Art Product Technique"],
  summary: "To Add Art Product Technique",
  body: {
    description: "To Add Art Product Technique",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },

      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Add Keyword */

exports.AddKeywordSchema = {
  tags: ["Keyword"],
  summary: "To Add Keyword",
  body: {
    description: "To Add Keyword",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditKeywordSchema = {
  tags: ["Keyword"],
  summary: "To Edit Keyword",
  body: {
    description: "To Edit Keyword",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Single Keyword Info */

exports.GetOneKeywordSchema = {
  tags: ["Keyword"],
  summary: "Get One Keyword Info",
  body: {
    description: "To Get One Keyword Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
            count: { type: "number" },
          },
        },
      },
    },
  },
};

/* Schema For to Get Keyword */

exports.KeywordSchema = {
  tags: ["Keyword"],
  summary: "Get Keyword",
  query: {
    description: "Get Keyword Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
            },
          },
        },
      },
    },
  },
};

/* Schema to Add NFTBlockchainInfo */

exports.AddNFTBlockchainInfoSchema = {
  tags: ["NFTBlockchainInfo"],
  summary: "To Add NFTBlockchainInfo",
  body: {
    description: "To Add NFTBlockchainInfo",
    type: "object",
    required: ["Title", "Content"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Content: {
        type: "string",
        minlength: 20,
        maxlength: 1000,
        unique: true,
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditNFTBlockchainInfoSchema = {
  tags: ["NFTBlockchainInfo"],
  summary: "To Edit NFTBlockchainInfo",
  body: {
    description: "To Edit NFTBlockchainInfo",
    type: "object",
    required: ["Title", "Content", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Content: {
        type: "string",
        minlength: 20,
        maxlength: 1000,
        unique: true,
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Single NFTBlockchainInfo Info */

exports.GetOneNFTBlockchainInfoSchema = {
  tags: ["NFTBlockchainInfo"],
  summary: "Get One NFTBlockchainInfo Info",
  body: {
    description: "To Get One NFTBlockchainInfo Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Content: {
              type: "string",
              minlength: 20,
              maxlength: 1000,
              unique: true,
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get NFTBlockchainInfo */

exports.NFTBlockchainInfoSchema = {
  tags: ["NFTBlockchainInfo"],
  summary: "Get NFTBlockchainInfo",
  query: {
    description: "Get NFTBlockchain Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Content: {
                type: "string",
                minlength: 20,
                maxlength: 1000,
                unique: true,
              },
            },
          },
        },
      },
    },
  },
};

/* Schema to Add News */
exports.AddNewsSchema = {
  tags: ["News"],
  summary: "To Add News",
  body: {
    description: "To Add News",
    type: "object",
    required: ["Title", "Content", "Author", "Image"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Content: {
        type: "string",
        minlength: 20,
        maxlength: 1000,
        unique: true,
      },
      Author: {
        type: "string",
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
      Author: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddFeaturesSchema = {
  tags: ["Features"],
  summary: "To Add Features",
  body: {
    description: "To Add Features",
    type: "object",
    required: ["Name", "PublishDate", "Status", "Image", "Info"],
    properties: {
      Name: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Info: {
        type: "string",
      },
      PublishDate: {
        type: "string",
      },
      Status: {
        type: "string",
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.UpdateAboutSchema = {
  tags: ["CMS"],
  summary: "To Update About Info",
  body: {
    description: "To Update About Info",
    type: "object",
    properties: {
      Section1Text: {
        type: "string",
      },
      Section3Content: {
        type: "string",
      },
      Section3Title: {
        type: "string",
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddTeamSchema = {
  tags: ["Teams"],
  summary: "To Add Team Member",
  body: {
    description: "To Add Team Member",
    type: "object",
    required: ["Name", "Position", "Image", "Info"],
    properties: {
      Info: {
        type: "string",
      },
      Instagram: {
        type: "string",
      },
      Linkedin: {
        type: "string",
      },
      Facebook: {
        type: "string",
      },
      Name: {
        type: "string",
      },
      Position: {
        type: "string",
      },

      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.AddEventsSchema = {
  tags: ["Events"],
  summary: "To Add Events",
  body: {
    description: "To Add Events",
    type: "object",
    required: ["Name", "PublishDate", "Info", "Status", "Image"],
    properties: {
      Name: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Info: {
        type: "string",
      },
      PublishDate: {
        type: "string",
      },
      Status: {
        type: "string",
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditNewsSchema = {
  tags: ["News"],
  summary: "To Edit News",
  body: {
    description: "To Edit News",
    type: "object",
    required: ["Title", "Content", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Content: {
        type: "string",
        minlength: 20,
        maxlength: 1000,
        unique: true,
      },
      Author: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditFeaturesSchema = {
  tags: ["Features"],
  summary: "To Edit Features",
  body: {
    description: "To Edit Features",
    type: "object",
    required: ["Name", "PublishDate", "Id", "Status", "Info"],
    properties: {
      Id: {
        type: "string",
      },
      Info: {
        type: "string",
      },
      Name: {
        type: "string",
      },
      PublishDate: {
        type: "string",
      },
      Status: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditEventsSchema = {
  tags: ["Events"],
  summary: "To Edit Events",
  body: {
    description: "To Edit Events",
    type: "object",
    required: ["Name", "PublishDate", "Id", "Status", "Info"],
    properties: {
      Id: {
        type: "string",
      },
      Info: {
        type: "string",
      },
      Name: {
        type: "string",
      },
      PublishDate: {
        type: "string",
      },

      Status: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditTeamSchema = {
  tags: ["Teams"],
  summary: "To Edit Teams",
  body: {
    description: "To Edit Teams",
    type: "object",
    required: ["Name", "Position", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Name: {
        type: "string",
      },
      Position: {
        type: "string",
      },
      Info: {
        type: "string",
      },
      Facebook: {
        type: "string",
      },
      Linkedin: {
        type: "string",
      },
      Instagram: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Single News Info */
exports.GetOneNewsSchema = {
  tags: ["News"],
  summary: "Get One News Info",
  body: {
    description: "To Get One News Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Content: {
              type: "string",
              minlength: 20,
              maxlength: 1000,
              unique: true,
            },
            Image: {
              type: "string",
            },
            AuthorName: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            AuthorId: {
              type: "string",
            },
            AuthorContent: {
              type: "string",
              minlength: 20,
              maxlength: 1000,
              unique: true,
            },
            AuthorImage: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneFeaturesSchema = {
  tags: ["Features"],
  summary: "Get One Features Info",
  body: {
    description: "To Get One Features Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Name: {
              type: "string",
            },
            Info: {
              type: "string",
            },
            PublishDate: {
              type: "string",
            },
            Image: {
              type: "string",
            },
            ImageOrg: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneEventsSchema = {
  tags: ["Events"],
  summary: "Get One Events Info",
  body: {
    description: "To Get One Events Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Name: {
              type: "string",
            },
            Info: {
              type: "string",
            },
            PublishDate: {
              type: "string",
            },
            Image: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneTeamsSchema = {
  tags: ["Teams"],
  summary: "Get One Teams Info",
  body: {
    description: "To Get One Teams Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Name: {
              type: "string",
            },
            Position: {
              type: "string",
            },
            Image: {
              type: "string",
            },
            Status: {
              type: "string",
            },
            Info: {
              type: "string",
            },
            Instagram: {
              type: "string",
            },
            Linkedin: {
              type: "string",
            },
            Facebook: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get News */
exports.NewsSchema = {
  tags: ["News"],
  summary: "Get News",
  query: {
    description: "Get News Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Content: {
                type: "string",
                minlength: 20,
                maxlength: 1000,
                unique: true,
              },
              Image: {
                type: "string",
              },
              AuthorName: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              AuthorContent: {
                type: "string",
                minlength: 20,
                maxlength: 1000,
                unique: true,
              },
              AuthorImage: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

exports.FeaturesSchema = {
  tags: ["Features"],
  summary: "Get Features",
  query: {
    description: "Get Features Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.EventsSchema = {
  tags: ["Events"],
  summary: "Get Events",
  query: {
    description: "Get Events Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.FoundersSchema = {
  tags: ["Teams"],
  summary: "Get Founders",
  query: {
    description: "Get Founders Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.FeaturesImageUploadSchema = {
  tags: ["Features"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.TeamImageUploadSchema = {
  tags: ["Teams"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.EventsImageUploadSchema = {
  tags: ["Events"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.NewsImageUploadSchema = {
  tags: ["News"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.AboutImageUploadSchema = {
  tags: ["CMS"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

/* Schema to Add NewsAuthor */
exports.AddNewsAuthorSchema = {
  tags: ["NewsAuthor"],
  summary: "To Add NewsAuthor",
  body: {
    description: "To Add NewsAuthor",
    type: "object",
    required: ["Name", "Content"],
    properties: {
      Name: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Content: {
        type: "string",
        unique: true,
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditNewsAuthorSchema = {
  tags: ["NewsAuthor"],
  summary: "To Edit NewsAuthor",
  body: {
    description: "To Edit NewsAuthor",
    type: "object",
    required: ["Name", "Content", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Name: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Content: {
        type: "string",
        minlength: 20,
        maxlength: 1000,
        unique: true,
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Single NewsAuthor Info */
exports.GetOneNewsAuthorSchema = {
  tags: ["NewsAuthor"],
  summary: "Get One NewsAuthor Info",
  body: {
    description: "To Get One NewsAuthor Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Name: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Content: {
              type: "string",
              minlength: 20,
              maxlength: 1000,
              unique: true,
            },
            Image: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get NewsAuthor */
exports.NewsAuthorSchema = {
  tags: ["NewsAuthor"],
  summary: "Get NewsAuthor",
  query: {
    description: "Get NewsAuthor Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Name: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Content: {
                type: "string",
                minlength: 20,
                maxlength: 1000,
                unique: true,
              },
              Image: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

exports.NewsAuthorImageUploadSchema = {
  tags: ["NewsAuthor"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.EditCmsSchema = {
  tags: ["CMS"],
  summary: "To Edit CMS",
  body: {
    description: "To Edit CMS",
    type: "object",
    required: ["Content", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Content: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.GetOneCmsSchema = {
  tags: ["CMS"],
  summary: "Get One CMS Info",
  body: {
    description: "To Get One CMS Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Page: {
              type: "string",
            },
            Content: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.CMSSchema = {
  tags: ["CMS"],
  summary: "Get CMS",
  query: {
    description: "Get CMS Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema to Add Styles */

exports.AddStylesSchema = {
  tags: ["Styles"],
  summary: "To Add Styles",
  body: {
    description: "To Add Styles",
    type: "object",
    required: ["Title", "Status"],
    properties: {
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Categories */

exports.EditCategoriesSchema = {
  tags: ["Categories"],
  summary: "To Edit Categories",
  body: {
    description: "To Edit Categories",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Medium */

exports.EditMediumSchema = {
  tags: ["Medium"],
  summary: "To Edit Medium",
  body: {
    description: "To Edit Medium",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtistCategorySchema = {
  tags: ["Artist Categories"],
  summary: "To Edit Artist Categories",
  body: {
    description: "To Edit Artist Categories",
    type: "object",
    required: ["Title", "Status", "Image", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditGiftNFTSchema = {
  tags: ["Gift NFT"],
  summary: "To Edit Gift NFT",
  body: {
    description: "To Edit Gift NFT",
    type: "object",
    required: [
      "Name",
      "Status",
      "Thumb",
      "Media",
      "IPFSThumb",
      "IPFSMedia",
      "Id",
      "Currency",
    ],
    properties: {
      Id: {
        type: "string",
      },
      Currency: {
        type: "string",
      },

      IPFSThumb: {
        type: "string",
      },

      IPFSMedia: {
        type: "string",
      },
      Name: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.MintGiftNFTSchema = {
  tags: ["Gift NFT"],
  summary: "To Mint Gift NFT",
  body: {
    description: "To Mint Gift NFT",
    type: "object",
    required: ["Id", "UserId"],
    properties: {
      Id: {
        type: "string",
      },
      UserId: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

exports.MintArtworkSchema = {
  tags: ["As User"],
  summary: "To Mint NFT",
  body: {
    description: "To Mint NFT",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

exports.SellRequestSchema = {
  tags: ["As User"],
  summary: "To Send Request to Sell",
  body: {
    description: "To Send Request to Sell NFT",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

exports.EditArtistStyleSchema = {
  tags: ["Artist Styles"],
  summary: "To Edit Artist Styles",
  body: {
    description: "To Edit Artist Styles",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },

      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtistLabelSchema = {
  tags: ["Artist Labels"],
  summary: "To Edit Artist Labels",
  body: {
    description: "To Edit Artist Labels",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },

      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtistMediumSchema = {
  tags: ["Artist Medium"],
  summary: "To Edit Artist Medium",
  body: {
    description: "To Edit Artist Medium",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },

      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Material */

exports.EditMaterialSchema = {
  tags: ["Material"],
  summary: "To Edit Material",
  body: {
    description: "To Edit Material",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductBrandSchema = {
  tags: ["Art Product Brand"],
  summary: "To Edit Art Product Brand",
  body: {
    description: "To Edit Art Product Brand",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductCategorySchema = {
  tags: ["Art Product Category"],
  summary: "To Edit Art Product Category",
  body: {
    description: "To Edit Art Product Category",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },

      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductFabricSchema = {
  tags: ["Art Product Fabric"],
  summary: "To Edit Art Product Fabric",
  body: {
    description: "To Edit Art Product Fabric",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductMaterialSchema = {
  tags: ["Art Product Material"],
  summary: "To Edit Art Product Material",
  body: {
    description: "To Edit Art Product Material",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductStyleSchema = {
  tags: ["Art Product Style"],
  summary: "To Edit Art Product Style",
  body: {
    description: "To Edit Art Product Style",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductShapeSchema = {
  tags: ["Art Product Shape"],
  summary: "To Edit Art Product Shape",
  body: {
    description: "To Edit Art Product Shape",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductTypeSchema = {
  tags: ["Art Product Type"],
  summary: "To Edit Art Product Type",
  body: {
    description: "To Edit Art Product Type",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductTechniqueSchema = {
  tags: ["Art Product Technique"],
  summary: "To Edit Art Product Technique",
  body: {
    description: "To Edit Art Product Technique",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductNameSchema = {
  tags: ["Art Product Name"],
  summary: "To Edit Art Product Name",
  body: {
    description: "To Edit Art Product Name",
    type: "object",
    required: ["Title", "Type", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Type: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtProductSizeSchema = {
  tags: ["Art Product Size"],
  summary: "To Edit Art Product Size",
  body: {
    description: "To Edit Art Product Size",
    type: "object",
    required: ["Title", "Type", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
      },
      Type: {
        type: "string",
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Styles */

exports.EditStylesSchema = {
  tags: ["Styles"],
  summary: "To Edit Styles",
  body: {
    description: "To Edit Styles",
    type: "object",
    required: ["Title", "Status", "Id"],
    properties: {
      Id: {
        type: "string",
      },
      Title: {
        type: "string",
        minlength: 3,
        maxlength: 20,
        unique: true,
      },
      Status: {
        type: "string",
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Network */

exports.EditNetworkSchema = {
  tags: ["Network"],
  summary: "To Edit Network",
  body: {
    description: "To Edit Network",
    type: "object",
    required: ["Name", "Currency", "AdminAddress", "AdminKey", "FeeAddress", "RpcUrl", "ChainID", "BlockExplorer", "FactoryContract", "MultiContract", "GiftContract", "Id", "MultiAbiArray", "FactoryAbiArray", "GiftAbiArray", "AdminCommission"],
    properties: {
      Name: { type: "string" },
      Currency: { type: "string" },
      AdminAddress: { type: "string" },
      AdminKey: { type: "string" },
      FeeAddress: { type: "string" },
      RpcUrl: { type: "string" },
      ChainID: { type: "number" },
      BlockExplorer: { type: "string" },
      FactoryContract: { type: "string" },
      MultiContract: { type: "string" },
      GiftContract: { type: "string" },
      Id: { type: "string" },
      MultiAbiArray: { type: "string" },
      FactoryAbiArray: { type: "string" },
      GiftAbiArray: { type: "string" },
      AdminCommission: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditArtAccountStatusSchema = {
  tags: ["Artwork"],
  summary: "To Edit ArtItem Approve Status",
  body: {
    description: "To Edit ArtItem Approve Status",
    type: "object",
    required: ["Id", "ApproveStatus"],
    properties: {
      Id: { type: "string" },
      ApproveStatus: { type: "boolean" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.BulkArtworkApproveSchema = {
  tags: ["Artwork"],
  summary: "To Bulk Approve Artwork",
  body: {
    description: "To Bulk Approve Artwork",
    type: "object",
    required: ["AuthorId", "ApproveStatus", "Type"],
    properties: {
      AuthorId: { type: "number" },
      ApproveStatus: { type: "boolean" },
      Type: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

exports.EditMediaLimitSchema = {
  tags: ["Media Limit"],
  summary: "To Edit Media Limit",
  body: {
    description: "To Edit Media Limit",
    type: "object",
    required: ["Height", "Width", "Id", "Size"],
    properties: {
      Height: { type: "number" },
      Width: { type: "number" },
      Size: { type: "number" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema to Edit Network */

exports.EditUserRoleAgreementSchema = {
  tags: ["UserRole"],
  summary: "To Edit UserRole",
  body: {
    description: "To Edit UserRole",
    type: "object",
    required: ["Agreement", "Id"],
    properties: {
      Agreement: { type: "string" },
      Id: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
  },
};

/* Schema For to Get Single Admin Role Info */

exports.GetOneCategoriesSchema = {
  tags: ["Categories"],
  summary: "Get One Categories Info",
  body: {
    description: "To Get One Categories Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
            Image: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Medium Info */

exports.GetOneMediumSchema = {
  tags: ["Medium"],
  summary: "Get One Medium Info",
  body: {
    description: "To Get One Medium Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Artist Category Info */

exports.GetOneArtistCategorySchema = {
  tags: ["Artist Categories"],
  summary: "Get One Artist Category Info",
  body: {
    description: "To Get One Artist Category Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
            Image: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneGiftNftSchema = {
  tags: ["Gift NFT"],
  summary: "Get One Gift NFT Info",
  body: {
    description: "To Get One Gift NFT Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.GetArtEditionSchema = {
  tags: ["ArtEdition"],
  summary: "Get Art Edition Info",
  body: {
    description: "To Get Art Edition Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.GetOneArtistStyleSchema = {
  tags: ["Artist Styles"],
  summary: "Get One Artist Style Info",
  body: {
    description: "To Get One Artist Style Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtistLabelSchema = {
  tags: ["Artist Labels"],
  summary: "Get One Artist Label Info",
  body: {
    description: "To Get One Artist Label Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtistMediumSchema = {
  tags: ["Artist Medium"],
  summary: "Get One Artist Medium Info",
  body: {
    description: "To Get One Artist Medium Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Material Info */

exports.GetOneMaterialSchema = {
  tags: ["Material"],
  summary: "Get One Material Info",
  body: {
    description: "To Get One Material Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductBrandSchema = {
  tags: ["Art Product Brand"],
  summary: "Get One Art Product Brand Info",
  body: {
    description: "To Get One Art Product Brand Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductCategorySchema = {
  tags: ["Art Product Category"],
  summary: "Get One Art Product Category Info",
  body: {
    description: "To Get One Art Product Category Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Image: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductFabricSchema = {
  tags: ["Art Product Fabric"],
  summary: "Get One Art Product Fabric Info",
  body: {
    description: "To Get One Art Product Fabric Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductMaterialSchema = {
  tags: ["Art Product Material"],
  summary: "Get One Art Product Material Info",
  body: {
    description: "To Get One Art Product Material Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductShapeSchema = {
  tags: ["Art Product Shape"],
  summary: "Get One Art Product Shape Info",
  body: {
    description: "To Get One Art Product Shape Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductStyleSchema = {
  tags: ["Art Product Style"],
  summary: "Get One Art Product Style Info",
  body: {
    description: "To Get One Art Product Style Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductTypeSchema = {
  tags: ["Art Product Type"],
  summary: "Get One Art Product Type Info",
  body: {
    description: "To Get One Art Product Type Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductTechniqueSchema = {
  tags: ["Art Product Technique"],
  summary: "Get One Art Product Technique Info",
  body: {
    description: "To Get One Art Product Technique Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductNameSchema = {
  tags: ["Art Product Name"],
  summary: "Get One Art Product Name Info",
  body: {
    description: "To Get One Art Product Name Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Image: {
              type: "string",
            },
            Title: {
              type: "string",
            },
            Type: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtProductSizeSchema = {
  tags: ["Art Product Size"],
  summary: "Get One Art Product Size Info",
  body: {
    description: "To Get One Art Product Size Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
            },
            Type: {
              type: "string",
            },
            Status: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

exports.GetOneArtworkSchema = {
  tags: ["Artwork"],
  summary: "Get One Artwork Info",
  body: {
    description: "To Get One Artwork Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Artwork */

exports.ArtworkSchema = {
  tags: ["Artwork"],
  summary: "Get Artwork",
  query: {
    description: "Get Activities Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtproductSchema = {
  tags: ["Art Product"],
  summary: "Get Artproduct",
  query: {
    description: "Get Artproduct Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Single Collection Info */

exports.GetOneCollectionSchema = {
  tags: ["Collection"],
  summary: "Get One Collection Info",
  body: {
    description: "To Get One Collection Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Name: { type: "string", minLength: 3, maxLength: 255 },
            Description: { type: "string", minLength: 100, maxLength: 1000 },
            Currency: { type: "string" },
            ContractSymbol: { type: "string" },
            ContractAddress: { type: "string" },
            Banner: {
              type: "string",
            },
            Thumb: {
              type: "string",
            },
            Royalties: { type: "number", default: 0 },
            VolumeTraded: { type: "number", default: 0 },
            ItemCount: { type: "number", default: 0 },
            Status: { type: "number", enum: [0, 1], default: 1 },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Styles Info */

exports.GetOneStylesSchema = {
  tags: ["Styles"],
  summary: "Get One Styles Info",
  body: {
    description: "To Get One Styles Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Title: {
              type: "string",
              minlength: 3,
              maxlength: 20,
              unique: true,
            },
            Status: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Single Network Info */

exports.GetOneNetworkSchema = {
  tags: ["Network"],
  summary: "Get One Network Info",
  body: {
    description: "To Get One Network Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Name: { type: "string" },
            Currency: { type: "string" },
            AdminAddress: { type: "string" },
            FeeAddress: { type: "string" },
            RpcUrl: { type: "string" },
            ChainID: { type: "number" },
            BlockExplorer: { type: "string" },
            FactoryContract: { type: "string" },
            MultiContract: { type: "string" },
            GiftContract: { type: "string" },
            FactoryAbiArray: { type: "string" },
            GiftAbiArray: { type: "string" },
            MultiAbiArray: { type: "string" },
            AdminCommission: { type: "string" },
          },
        },
      },
    },
  },
};

exports.GetOneMediaLimitSchema = {
  tags: ["Media Limit"],
  summary: "Get One Media Limit Info",
  body: {
    description: "To Get One Media Limit Info",
    type: "object",
    required: ["Id"],
    properties: {
      Id: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "object",
          properties: {
            Width: { type: "number" },
            Height: { type: "number" },
            Size: { type: "number" },
          },
        },
      },
    },
  },
};

/* Schema For to Get Categories */

exports.CategoriesSchema = {
  tags: ["Categories"],
  summary: "Get Categories",
  query: {
    description: "Get Categories",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Medium */

exports.MediumSchema = {
  tags: ["Medium"],
  summary: "Get Medium",
  query: {
    description: "Get Medium Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Artist Categories */

exports.ArtistCategorySchema = {
  tags: ["Artist Categories"],
  summary: "Get Artist Categories",
  query: {
    description: "Get Artist Categories Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
              Image: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

exports.CountrySchema = {
  tags: ["Countries"],
  summary: "Get Countries",
  query: {
    description: "Get Countries Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.GiftNFTSchema = {
  tags: ["Gift NFT"],
  summary: "Get Gift NFT",
  query: {
    description: "Get Activities Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtistStyleSchema = {
  tags: ["Artist Styles"],
  summary: "Get Artist Styles",
  query: {
    description: "Get Artist Styles Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
            },
          },
        },
      },
    },
  },
};

exports.ArtistLabelSchema = {
  tags: ["Artist Labels"],
  summary: "Get Artist Labels",
  query: {
    description: "Get Artist Label Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
            },
          },
        },
      },
    },
  },
};

exports.ArtistMediumSchema = {
  tags: ["Artist Medium"],
  query: {
    description: "Get Artist Medium Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  summary: "Get Artist Medium",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Material */

exports.MaterialSchema = {
  tags: ["Material"],
  summary: "Get Material",
  query: {
    description: "Get Material Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Art Product Brand */

exports.ArtProductBrandSchema = {
  tags: ["Art Product Brand"],
  summary: "Get Art Product Brand",
  query: {
    description: "Get Art Product Brand Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Art Product Fabric */

exports.ArtProductFabricSchema = {
  tags: ["Art Product Fabric"],
  summary: "Get Art Product Fabric",
  query: {
    description: "Get Get Art Product Fabric Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductCategorySchema = {
  tags: ["Art Product Category"],
  summary: "Get Art Product Category",
  query: {
    description: "Get Art Product Category Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductMaterialSchema = {
  tags: ["Art Product Material"],
  summary: "Get Art Product Material",
  query: {
    description: "Get Art Product Material Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductNameSchema = {
  tags: ["Art Product Name"],
  summary: "Get Art Product Name",
  query: {
    description: "Get Art Product Name Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductSizeSchema = {
  tags: ["Art Product Size"],
  summary: "Get Art Product Size",
  query: {
    description: "Get Art Product Size Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductStyleSchema = {
  tags: ["Art Product Style"],
  summary: "Get Art Product Style",
  query: {
    description: "Get Art Product Style Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductShapeSchema = {
  tags: ["Art Product Shape"],
  summary: "Get Art Product Shape",
  query: {
    description: "Get Art Product Shape Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductTypeSchema = {
  tags: ["Art Product Type"],
  summary: "Get Art Product Type",
  query: {
    description: "Get Art Product Type Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.ArtProductTechniqueSchema = {
  tags: ["Art Product Technique"],
  summary: "Get Art Product Technique",
  query: {
    description: "Get Get Art Product Technique Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Styles */

exports.StylesSchema = {
  tags: ["Styles"],
  summary: "Get Styles",
  query: {
    description: "Get Styles Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: {
                type: "string",
                minlength: 3,
                maxlength: 20,
                unique: true,
              },
              Status: {
                type: "string",
                enum: ["Active", "Inactive"],
                default: "Active",
              },
            },
          },
        },
      },
    },
  },
};

exports.NotificationSchema = {
  tags: ["Notifications"],
  summary: "Get Notifications",
  query: {
    description: "Get Notifications Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Collection */

exports.CollectionSchema = {
  tags: ["Collection"],
  summary: "Get Collection",
  query: {
    description: "Get Collection Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Name: { type: "string", minLength: 3, maxLength: 255 },
              Description: { type: "string", minLength: 100, maxLength: 1000 },
              Currency: { type: "string" },
              ContractSymbol: { type: "string" },
              ContractAddress: { type: "string" },
              Banner: {
                type: "string",
              },
              Thumb: {
                type: "string",
              },
              Royalties: { type: "number", default: 0 },
              VolumeTraded: { type: "number", default: 0 },
              ItemCount: { type: "number", default: 0 },
              Status: { type: "number", enum: [0, 1], default: 1 },
              AuthorId: { type: "string", format: "uuid" },
              IsSetTokenUri: { type: "string", default: "false" },
              AdminKey: { type: "string", default: "false" },
              UserName: { type: "string" },
              Email: { type: "string" },
              ProfilePicture: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get History */

exports.HistorySchema = {
  tags: ["History"],
  summary: "Get History",
  query: {
    description: "Get History Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      HistoryType: {
        type: "string",
        enum: [
          "Minted",
          "Bid",
          "Transfer",
          "Listed",
          "Delisted",
          "Offer",
          "AdminCommission",
          "Royalty",
        ],
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              ItemId: { type: "string", format: "uuid" },
              CollectionId: { type: "string", format: "uuid" },
              FromId: { type: "string", format: "uuid" },
              ToId: { type: "string", format: "uuid" },
              TransactionHash: { type: "string" },
              Price: { type: "number" },
              HistoryType: {
                type: "string",
                enum: [
                  "Minted",
                  "Bid",
                  "Transfer",
                  "Listed",
                  "Delisted",
                  "Offer",
                  "AdminCommission",
                  "Royalty",
                ],
              },
              IsValid: { type: "boolean" },
              ToUserName: { type: "string" },
              ToEmail: { type: "string" },
              FromUserName: { type: "string" },
              FromEmail: { type: "string" },
              CollectionName: { type: "string" },
              ItemName: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get GIFT NFT History */

exports.GiftHistorySchema = {
  tags: ["Gift NFT"],
  summary: "Get History",
  query: {
    description: "Get History Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.BioSchema = {
  tags: ["Bio"],
  summary: "Get Bio",
  query: {
    description: "Get Bio List",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "boolean" },
        info: {
          type: "array",
          count: { type: "number" },
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Overview: { type: "string" },
              Inspired: { type: "string" },
              Status: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              UserName: { type: "string" },
              Email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.ArtfairSchema = {
  tags: ["Artfair"],
  summary: "Get Art fair",
  query: {
    description: "Get Art fair List",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: { type: "string" },
              Year: { type: "string" },
              Location: { type: "string" },
              Image: {
                type: "object",
                properties: {
                  CDN: { type: "string" },
                  CCDN: { type: "string" },
                  Local: { type: "string" },
                  CLocal: { type: "string" },
                },
              },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              UserName: { type: "string" },
              Email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.ArtcollectionSchema = {
  tags: ["Artcollection"],
  summary: "Get Art Collection",
  query: {
    description: "Get Art Collection",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Title: { type: "string" },
              Year: { type: "string" },
              Location: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              UserName: { type: "string" },
              Email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.TestimonialSchema = {
  tags: ["Testimonial"],
  summary: "Get Testimonials",
  query: {
    description: "Get Testimonials List",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Status: { type: "string" },
              Provider: { type: "string" },
              Description: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              UserName: { type: "string" },
              Email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.ExhibtionSchema = {
  tags: ["Exhibition"],
  summary: "Get Exhibition",
  query: {
    description: "Get Exhibition Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Status: { type: "string" },
              Title: { type: "string" },
              Type: { type: "string" },
              Year: { type: "number" },
              Institude: { type: "string" },
              Location: { type: "string" },
              Image: {
                type: "string",
              },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              UserName: { type: "string" },
              Email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.MediasSchema = {
  tags: ["Media & Publication"],
  summary: "Get Media & Publication",
  query: {
    description: "Get Media & Publication Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Description: { type: "string" },
              Status: { type: "string" },
              Title: { type: "string" },
              Type: { type: "string" },
              Author: { type: "string" },
              Year: { type: "number" },
              Link: { type: "string" },
              Published: { type: "string" },
              Image: {
                type: "string",
              },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              UserName: { type: "string" },
              Email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Bid */

exports.BidSchema = {
  tags: ["Bid"],
  summary: "Get Bid",
  query: {
    description: "Get Bid Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            required: ["ItemId", "Sender", "Receiver", "Price"],
            properties: {
              ItemId: { type: "string", format: "uuid" },
              Sender: { type: "string", format: "uuid" },
              Receiver: { type: "string", format: "uuid" },
              Price: { type: "number" },
              Status: {
                type: "string",
                enum: ["Pending", "Accepted", "Rejected"],
              },
              ReceiverUserName: { type: "string" },
              ReceiverEmail: { type: "string" },
              SenderUserName: { type: "string" },
              SenderEmail: { type: "string" },
              ItemName: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.OfferSchema = {
  tags: ["Offers"],
  summary: "Get Offers",
  query: {
    description: "Get Offers Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            required: ["ItemId", "Sender", "Receiver", "Price"],
            properties: {
              ItemId: { type: "string", format: "uuid" },
              Sender: { type: "string", format: "uuid" },
              Receiver: { type: "string", format: "uuid" },
              Price: { type: "number" },
              Status: {
                type: "string",
                enum: ["Pending", "Accepted", "Rejected"],
              },
              ReceiverUserName: { type: "string" },
              ReceiverEmail: { type: "string" },
              SenderUserName: { type: "string" },
              SenderEmail: { type: "string" },
              ItemName: { type: "string" },
            },
          },
        },
      },
    },
  },
};

/* Schema For to Get Network */

exports.NetworkSchema = {
  tags: ["Network"],
  summary: "Get Network",
  query: {
    description: "Get Network Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Name: { type: "string" },
              Currency: { type: "string" },
              AdminAddress: { type: "string" },
              RpcUrl: { type: "string" },
              ChainID: { type: "number" },
              BlockExplorer: { type: "string" },
              FactoryContract: { type: "string" },
              MultiContract: { type: "string" },
              AdminCommission: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.WithdrawHistorySchema = {
  tags: ["Admin Balance"],
  summary: "Get Withdraw History",
  query: {
    description: "Get History Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.AdminBalanceSchema = {
  tags: ["Admin Balance"],
  summary: "Get Admin Balance",
  query: {
    description: "Get Admin Balance Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Currency: { type: "string" },
              WalletAddress: { type: "string" },
              Balance: { type: "number" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
      },
    },
  },
};

exports.MediaLimitSchema = {
  tags: ["Media Limit"],
  summary: "Get Media Limit",
  query: {
    description: "Get Media Limit Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

exports.CsvSampleSchema = {
  tags: ["CSV Samples"],
  summary: "Get Csv Samples",
  query: {
    description: "Get Csv Samples Info",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
        },
      },
    },
  },
};

/* Schema For to Get Network */

exports.UserRoleInfoSchema = {
  tags: ["UserRole"],
  summary: "Get UserRole",
  query: {
    description: "Get UserRole",
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      search: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        count: { type: "number" },
        info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              Role: { type: "string" },
              Agreement: { type: "string" },
              Kyc: { type: "boolean" },
              Status: { type: "boolean" },
            },
          },
        },
      },
    },
  },
};

exports.singleImageUploadSchema = {
  tags: ["Landing"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Section1Image: { type: "array" },
    },
    required: ["Type", "Section1Image"],
  },  
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.csvUploadSchema = {
  tags: ["CSV Samples"],
  summary: "To Upload CSV",
  body: {
    properties: {
      Type: { type: "string" },
      CSV: { type: "array" },
    },
    required: ["Type", "CSV"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.BannerImageSchema = {
  tags: ["Banner"],
  summary: "To Upload Video",
  body: {
    properties: {
      Type: { type: "string" },
      Section1Image: { type: "array" },
    },
    required: ["Type", "Section1Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.MetamaskImageSchema = {
  tags: ["Metamask"],
  summary: "To Upload Video",
  body: {
    properties: {
      Type: { type: "string" },
      Section1Image: { type: "array" },
    },
    required: ["Type", "Section1Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.InnerBannerImageSchema = {
  tags: ["InnerBanner"],
  summary: "To Upload Video",
  body: {
    properties: {
      Type: { type: "string" },
      Section1Image: { type: "array" },
    },
    required: ["Type", "Section1Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.multiImageUploadSchema = {
  tags: ["Landing"],
  summary: "To Upload Multiple Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image1: { type: "array" },
      Image2: { type: "array" },
      Image3: { type: "array" },
      Image4: { type: "array" },
    },
    required: ["Type", "Image1", "Image2", "Image3", "Image4"],
  },
  files: {
    type: "object",
    properties: {
      Image1: { type: "array" },
      Image2: { type: "array" },
      Image3: { type: "array" },
      Image4: { type: "array" },
    },
    required: ["Image1", "Image2", "Image3", "Image4"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Section2Text: { type: "string" },
        Image1: {
          type: "string",
        },
        Image2: {
          type: "string",
        },
        Image3: {
          type: "string",
        },
        Image4: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.LogoFaviconUploadSchema = {
  tags: ["LogoFavicon"],
  summary: "To Upload Logo Favicon Image",
  body: {
    properties: {
      Type: { type: "string" },
      Logo: { type: "array" },
      Favicon: { type: "array" },
    },
    required: ["Type", "Logo", "Favicon"],
  },
  files: {
    type: "object",
    properties: {
      Logo: { type: "array" },
      Favicon: { type: "array" },
    },
    required: ["Logo", "Favicon"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Logo: {
          type: "string",
        },
        Favicon: {
          type: "string",
        },
        message: { type: "string" },
      },
    },
  },
  403: {
    type: "object",
    properties: {
      status: { type: "boolean" },
      info: { type: "string" },
    },
  },
  500: {
    type: "object",
    properties: {
      status: { type: "boolean" },
      message: { type: "string" },
      error: { type: "string" },
    },
  },
};

exports.ArtistCategoryUploadSchema = {
  tags: ["Artist Categories"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.ArtCategoryUploadSchema = {
  tags: ["Categories"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.APCategoryImageUploadSchema = {
  tags: ["Art Product"],
  summary: "To Upload Image",
  body: {
    properties: {
      Type: { type: "string" },
      Image: { type: "array" },
    },
    required: ["Type", "Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.GiftNftThumbUploadSchema = {
  tags: ["Gift NFT"],
  summary: "To Upload Gift NFT Thumb",
  body: {
    properties: {
      Type: { type: "string" },
      Thumb: { type: "array" },
    },
    required: ["Type", "Thumb"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        IPFSImage: {
          type: "string",
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.GiftNftMediaUploadSchema = {
  tags: ["Gift NFT"],
  summary: "To Upload Gift NFT Media",
  body: {
    properties: {
      Type: { type: "string" },
      Media: { type: "array" },
    },
    required: ["Type", "Media"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Image: {
          type: "object",
          properties: {
            CImage: {
              type: "string",
            },
            OImage: {
              type: "string",
            },
          },
        },
        IPFSImage: {
          type: "string",
        },
        message: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.landingSection1Schema = {
  tags: ["Landing"],
  summary: "To Update Landing Section1",
  body: {
    type: "object",
    summary: "To Update Landing Section1",
    properties: {
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
    required: ["Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        filepath: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.updatecsvSchema = {
  tags: ["CSV Samples"],
  summary: "To Update CSV Samples",
  body: {
    type: "object",
    summary: "To Update CSV Samples",
    properties: {
      Id: {
        type: "string",
      },
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
    required: ["Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        filepath: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.BannerSchema = {
  tags: ["Banner"],
  summary: "To Update Banner ",
  body: {
    type: "object",
    summary: "To Update Banner",
    properties: {
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
    required: ["Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        filepath: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.MetamaskSchema = {
  tags: ["Metamask"],
  summary: "To Update Metamask video",
  body: {
    type: "object",
    summary: "To Update Metamask video",
    properties: {
      Image: {
        type: "object",
        properties: {
          CDN: { type: "string" },
          Local: { type: "string" },
          CCDN: { type: "string" },
          CLocal: { type: "string" },
        },
      },
    },
    required: ["Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        filepath: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.InnerBannerSchema = {
  tags: ["InnerBanner"],
  summary: "To Update InnerBanner ",
  body: {
    type: "object",
    summary: "To Update InnerBanner",
    properties: {
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
    },
    required: ["Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        filepath: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.landingSection2Schema = {
  tags: ["Landing"],
  summary: "To Update Landing Section2",
  body: {
    type: "object",
    properties: {
      Section2Text: { type: "string" },
      Section2Title: { type: "string" },
      Section2Description: { type: "string" },
      Image1: {
        type: "string",
      },
      Image2: {
        type: "string",
      },
      Image3: {
        type: "string",
      },
      Image4: {
        type: "string",
      },
    },
    required: [
      "Section2Text",
      "Image1",
      "Image2",
      "Image3",
      "Image4",
      "Section2Title",
      "Section2Description",
    ],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Section2Text: { type: "string" },
        filepath1: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        filepath2: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        filepath3: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        filepath4: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.LogoFaviconSchema = {
  tags: ["LogoFavicon"],
  summary: "To Update LogoFavicon",
  body: {
    type: "object",
    properties: {
      Logo: {
        type: "string",
      },
      Favicon: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        filepathLogo: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        filepathFavicon: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

/* Landing Page Section 3 Details Update Schema */

exports.landingSection3Schema = {
  tags: ["Landing"],
  summary: "To Update Landing Section3",
  body: {
    type: "object",
    properties: {
      Image: {
        type: "object",
        properties: {
          CImage: {
            type: "string",
          },
          OImage: {
            type: "string",
          },
        },
      },
      Section3Text: { type: "string" },
      Section3Title: { type: "string" },
      Section3Description: { type: "string" },
    },
    required: ["Image"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Section3Text: { type: "string" },
        filepath: {
          type: "object",
          properties: {
            CDN: { type: "string" },
            Local: { type: "string" },
            CCDN: { type: "string" },
            CLocal: { type: "string" },
          },
        },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

/* Landing Page Info Get Schema */

exports.GetLandingPageDetails = {
  tags: ["Landing"],
  summary: "To Get Landing Page Details",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Info: { type: "array" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.GetAboutusPageDetails = {
  tags: ["CMS"],
  summary: "To Get About us Page Details",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Info: { type: "array" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.GetBannerDetails = {
  tags: ["Banner"],
  summary: "To Get Banner Details",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Info: { type: "array" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.GetMetamaskDetails = {
  tags: ["Metamask"],
  summary: "To Get Metamask video",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Info: { type: "array" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};

exports.GetInnerBannerDetails = {
  tags: ["InnerBanner"],
  summary: "To Get InnerBanner Details",
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        Info: { type: "array" },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "boolean" },
        info: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};