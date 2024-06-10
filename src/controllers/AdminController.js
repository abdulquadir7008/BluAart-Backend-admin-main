const Config = require("../Config");
const sizeOf = require("image-size");
let Web3 = require("web3");
const sanitizeHtml = require("sanitize-html");
const { Pool } = require("pg");
const pool = new Pool(Config.sqldb);

const {
  Encrypt,
  ActivityUpdate,
  Schema,
  storage,
  FileFilter,
  GetOneArtworkInfo,
  sanitizeObject,
  IPFSUpload,
  Decrypt,
} = require("../Helper.js");

const { v4: Uuidv4 } = require("uuid");
const mime = require("mime-types");
const Axios = require("axios");
const fs = require("fs");
const Multer = require("fastify-multer");

const LogoFavUpload = Multer({ storage: storage, fileFilter: FileFilter });
const LogoFavFilesUpload = LogoFavUpload.fields([
  { name: "Logo", maxCount: 1 },
  { name: "Favicon", maxCount: 1 },
]);

const Section1ImageUpload = Multer({ storage: storage });
let Section1ImageUpdate = Section1ImageUpload.single("Section1Image");
let BannerImageUpdate = Section1ImageUpload.single("Banner");

const CsvUpload = Multer({ storage: storage });
let CsvUpdate = CsvUpload.single("CSV");

const Section2ImageUpload = Multer({ storage: storage });
const Section2ImageUpdate = Section2ImageUpload.fields([
  { name: "Image1", maxCount: 1 },
  { name: "Image2", maxCount: 1 },
  { name: "Image3", maxCount: 1 },
  { name: "Image4", maxCount: 1 },
]);

const Section3ImageUpload = Multer({ storage: storage });
let Section3ImageUpdate = Section3ImageUpload.single("Section3Image");

const ArtistCategoryImageUpload = Multer({ storage: storage });
const ArtistCategoryImageUpdate = ArtistCategoryImageUpload.single("Image");

const GiftNftThumbImageUpload = Multer({ storage: storage });
const GiftNftThumbImageUpdate = GiftNftThumbImageUpload.single("Thumb");

const GiftNftMediaImageUpload = Multer({ storage: storage });
const GiftNftMediaImageUpdate = GiftNftMediaImageUpload.single("Media");

const FormData = require("form-data");

console.log("Password", Encrypt('Zaj11362') )
// Single Image Upload

const SingleVideoUpload = async (req, res) => {
  try {
    const { Type } = req.body;
    const { file } = req;
    if (!file) {
      return res.status(200).send({
        status: false,
        message: "Image is required",
      });
    }
    const ThumbImage = file.filename;

    let s3Image = "";
    let s3CImage = "";

    if (ThumbImage) {
      try {
        let formData = new FormData();
        let filename = file.filename + "." + mime.extension(file.mimetype);
        formData.append("Image", fs.createReadStream(file.path), filename);
        formData.append("Location", `uploads/${Type}`);
        let s3Store = await Axios.post(
          Config.Services.FileServiceApi,
          formData
        );

        if (s3Store.status) {
          s3Image = s3Store.data.s3Image;
          s3CImage = s3Store.data.s3CImage;
        } else {
          return res.status(200).send({
            status: false,
            message: "Error In Image Upload",
          });
        }
      } catch (error) {
        console.error(`Error occurred during S3 upload for ${Type}:`);
      }

      let Img = {
        CImage: s3CImage,
        OImage: s3Image,
      };

      return res.status(200).send({
        status: true,
        Image: Img,
        message: "Video Uploaded Successfully",
      });
    } else {
      return res.status(403).send({
        status: false,
        info: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.log("error-/collectionthumb", error);
    return res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: error.message,
    });
  }
};
// Single Image Upload
const SingleImageUpload = async (req, res) => {
  try {
    const { Type } = req.body;
    const { file } = req;
    // Check if file exists
    if (!file) {
      return res.status(200).send({
        status: false,
        message: "Image is required",
      });
    }
    const ThumbImage = file.filename;

    let s3Image = "";
    let s3CImage = "";

    if (ThumbImage) {
      if (
        Type === "LandingSection1" ||
        Type === "LandingSection3" ||
        Type === "ArtProductCategory" ||
        Type === "ArtistCategory" ||
        Type === "ArtProductName" ||
        Type === "ArtCategory" ||
        Type === "BulkArtworkCSVSample" ||
        Type === "BulkArtproductCSVSample" ||
        Type === "Thumb" ||
        Type === "Teams" ||
        Type === "Media" ||
        Type === "Art" ||
        Type === "News" ||
        Type === "Events" ||
        Type === "Features" ||
        Type === "About"
      ) {
        try {
          let formData = new FormData();
          let filename = file.filename + "." + mime.extension(file.mimetype);
          formData.append("Image", fs.createReadStream(file.path), filename);
          formData.append("Location", `uploads/${Type}`);
          let s3Store = await Axios.post(
            Config.Services.FileServiceApi,
            formData
          );

          if (s3Store.status) {
            s3Image = s3Store.data.s3Image;
            s3CImage = s3Store.data.s3CImage;
          } else {
            return res.status(200).send({
              status: false,
              message: "Error In Image Upload",
            });
          }
        } catch (error) {
          console.error(`Error occurred during S3 upload for ${Type}:`);
        }
      }

      let Img = {
        CImage: s3CImage,
        OImage: s3Image,
      };

      return res.status(200).send({
        status: true,
        Image: Img,
        message: "Image Uploaded Successfully",
      });
    } else {
      return res.status(403).send({
        status: false,
        info: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.log("error-/collectionthumb", error);
    return res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: error.message,
    });
  }
};

const SingleImageUploadss = async (req, res) => {
  try {
    const { Type } = req.body;
    const { file } = req;

    // Check if file exists
    if (!file) {
      return res.status(200).send({
        status: false,
        message: "Image is required",
      });
    }

    const Dimensions = await sizeOf(file.path);

    const Width = Dimensions.width;
    const Height = Dimensions.height;

    if (Width * Height > 268402689) {
      res.code(200).send({
        status: false,
        message: `Image Size is too Large`,
      });
      return;
    }

    const ThumbImage = file.filename;

    let IPFS = "";
    let s3Image = "";
    let s3CImage = "";

    if (ThumbImage) {
      if (Type === "Thumb" || Type === "Media") {
        // Upload file to IPFS and get IPFS URL
        try {
          const IpfsUrl = await IPFSUpload(file);
          IPFS = `https://ipfs.io/ipfs/${IpfsUrl}`;
        } catch (error) {
          console.error(`Error occurred during IPFS upload for ${Type}:`);
        }

        try {
          let formData = new FormData();
          let filename = file.filename + "." + mime.extension(file.mimetype);
          formData.append("Image", fs.createReadStream(file.path), filename);
          formData.append("Location", `uploads/${Type}`);
          let s3Store = await Axios.post(
            Config.Services.FileServiceApi,
            formData
          );
          s3Image = s3Store.data.s3Image;
          s3CImage = s3Store.data.s3CImage;
        } catch (error) {
          console.error(`Error occurred during S3 upload for ${Type}:`);
        }
      }

      let Img = {
        CImage: s3CImage,
        OImage: s3Image,
      };

      return res.status(200).send({
        status: true,
        Image: Img,
        IPFSImage: IPFS,
        message: "Image Uploaded Successfully",
      });
    } else {
      return res.status(403).send({
        status: false,
        info: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.log("error-/collectionthumb", error);
    return res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: error.message,
    });
  }
};

// Dashboard
const Dashboard = async (req, res) => {
  try {
    let TotalGift = 0;
    let ArtistCount = 0;
    let BuyerCount = 0;
    let CollectorCount = 0;
    let CorperateCollectorCount = 0;
    let TotalCollections = 0;
    let TotalArtItem = 0;
    let TotalArtProductItem = 0;

    const TotalArtistQuery = `SELECT COUNT(u."RoleId") AS artist_count FROM "Users" u JOIN "UserRole" ur ON u."RoleId" = ur."_id" WHERE ur."Role" = 'Artist'`;

    try {
      const result = await pool.query(TotalArtistQuery);
      ArtistCount = result.rows[0].artist_count;
    } catch (err) {
      console.error("Error fetching total artist count:", err);
    }

    const TotalBuyerQuery = `SELECT COUNT(u."RoleId") AS buyer_count FROM "Users" u JOIN "UserRole" ur ON u."RoleId" = ur."_id" WHERE ur."Role" = 'Buyer'`;

    try {
      const result = await pool.query(TotalBuyerQuery);
      BuyerCount = result.rows[0].buyer_count;
    } catch (err) {
      console.error("Error fetching total buyer count:", err);
    }

    const TotalCollectorQuery = `SELECT COUNT(u."RoleId") AS collector_count FROM "Users" u JOIN "UserRole" ur ON u."RoleId" = ur."_id" WHERE ur."Role" = 'Collector'`;

    try {
      const result = await pool.query(TotalCollectorQuery);
      CollectorCount = result.rows[0].collector_count;
    } catch (err) {
      console.error("Error fetching total collector count:", err);
    }

    const TotalCCollectorQuery = `SELECT COUNT(u."RoleId") AS ccollector_count FROM "Users" u JOIN "UserRole" ur ON u."RoleId" = ur."_id" WHERE ur."Role" = 'Corporate Collector'`;

    try {
      const result = await pool.query(TotalCCollectorQuery);
      CorperateCollectorCount = result.rows[0].ccollector_count;
    } catch (err) {
      console.error("Error fetching total corporate collector count:", err);
    }

    const TotalCollectionQuery =
      'SELECT COUNT(*) as "total" FROM "Collections"';

    try {
      const result = await pool.query(TotalCollectionQuery);
      TotalCollections = result.rows[0].total;
    } catch (err) {
      console.error("Error fetching total gift count:", err);
    }

    const TotalArtItemQuery = `SELECT COUNT(*) as "total" FROM "ArtItems" WHERE "Type" = 'Artwork';`;

    try {
      const result = await pool.query(TotalArtItemQuery);
      TotalArtItem = result.rows[0].total;
    } catch (err) {
      console.error("Error fetching total gift count:", err);
    }

    const TotalArtProductItemQuery = `SELECT COUNT(*) as "total" FROM "ArtItems" WHERE "Type" = 'ArtProduct';`;

    try {
      const result = await pool.query(TotalArtProductItemQuery);
      TotalArtProductItem = result.rows[0].total;
    } catch (err) {
      console.error("Error fetching total gift count:", err);
    }

    const TotalGiftQuery = 'SELECT COUNT(*) as "total" FROM "GiftNFT"';

    try {
      const result = await pool.query(TotalGiftQuery);
      TotalGift = result.rows[0].total;
    } catch (err) {
      console.error("Error fetching total gift count:", err);
    }

    res.code(200).send({
      status: true,
      ArtistCount: ArtistCount,
      BuyerCount: BuyerCount,
      CollectorCount: CollectorCount,
      CorperateCollectorCount: CorperateCollectorCount,
      TotalCollections: TotalCollections,
      TotalArtItem: TotalArtItem,
      TotalProductItem: TotalArtProductItem,
      TotalGift: TotalGift,
    });
  } catch (error) {
    console.log("error-/getDashboard", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Activities */
const GetActivities = async (req, res) => {
  try {
    // Fetch activity information sorted by ID in descending order
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];

    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Email", "Action", "Ip", "Device", "Reason", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Activities" ${query}`,
        params
      );

      const result = await pool.query(
        `
              SELECT * FROM "Activities"
              ${query}
              ORDER BY _id DESC
              LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
            `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getactivities", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getactivity", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Get Visitors

const GetVisitors = async (req, res) => {
  try {
    // Retrieve visitor data and count
    const [dataResult, countResult] = await Promise.all([
      pool.query('SELECT "Email", "createdAt" FROM "Activities"'),
      pool.query('SELECT COUNT(DISTINCT "Email") as "count" FROM "Activities"'),
    ]);

    const data = dataResult.rows;
    const totalCount = countResult.rows[0].count;

    // Group data by month and count unique emails
    const monthlyCounts = {};

    data.forEach((row) => {
      const createdAt = new Date(row.createdAt);
      const yearMonth = `${(createdAt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${createdAt.getFullYear()}`;

      if (!monthlyCounts[yearMonth]) {
        monthlyCounts[yearMonth] = {
          count: 1,
          emails: new Set([row.Email]),
        };
      } else {
        monthlyCounts[yearMonth].count += 1;
        monthlyCounts[yearMonth].emails.add(row.Email);
      }
    });

    // Format data for response
    const formattedMonthlyCounts = {};

    for (const yearMonth in monthlyCounts) {
      if (monthlyCounts.hasOwnProperty(yearMonth)) {
        formattedMonthlyCounts[yearMonth] = monthlyCounts[yearMonth].count;
      }
    }

    const response = {
      data: formattedMonthlyCounts,
      totalCount: totalCount,
    };

    res.code(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Users List
const GetUsersList = async (req, res) => {
  try {
    let UserInfo = await pool.query(`SELECT "_id", "Email"
    FROM "Users" ORDER BY "_id" DESC`);
    UserInfo = UserInfo.rows;

    if (UserInfo) {
      res.code(200).send({
        status: true,
        info: UserInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: [],
      });
    }
  } catch (error) {
    console.log("error-/getuserslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const UsersList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Users" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*, 
                   CASE 
                      WHEN ar."Role" = 'Collector' THEN 'Private Collector'
                      ELSE ar."Role"
                   END AS "Role"
            FROM "Users" a
            LEFT JOIN "UserRole" ar ON a."RoleId" = ar._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getuserslist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getuserslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get History Listing */
const HistoryList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["ItemName"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Histories" ${query}`,
        params
      );

      const result = await pool.query(
        `
                SELECT a.*, ar."Email" as "FromEmail", ar."UserName" as "FromUserName",
                rr."Email" as "ToEmail", rr."UserName" as "ToUserName", cc."Name" as "CollectionName", Art."Title" as "ItemName"
                FROM "Histories" a
                LEFT JOIN "Users" ar ON a."FromId" = ar._id
                LEFT JOIN "Users" rr ON a."ToId" = rr._id
                LEFT JOIN "Collections" cc ON a."CollectionId" = cc._id
                LEFT JOIN "ArtItems" Art ON a."ItemId" = Art._id
                ${query}
                ORDER BY a._id DESC
                LIMIT $${params.push(limitnw)} OFFSET $${params.push(
          skipIndex
        )};
            `,
        params
      );

      if (result.rowCount > 0) {
        res.status(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.status(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getuserslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// User Info
const UserInfo = async (req, res) => {
  const { UserId } = req.body;
  try {
    let UserInfo = await pool.query(`
        SELECT U.*,
               CASE
                 WHEN UR."Role" = 'Collector' THEN 'Private Collector'
                 ELSE UR."Role"
               END AS "Role"
        FROM "Users" U
        JOIN "UserRole" UR ON U."RoleId" = UR."_id"
        WHERE U."_id" = '${UserId}'
      `);

    UserInfo = UserInfo.rows;

    if (UserInfo) {
      res.code(200).send({
        status: true,
        info: UserInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getkycinfo", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Update Account Status
const UpdateAccountStatus = async (req, res) => {
  let { UserId, AccountStatus } = req.body;
  const newAccountStatus = AccountStatus ? 1 : 0;

  try {
    let userInfo = await pool.query(
      `SELECT * FROM "Users" WHERE _id = '${UserId}'`
    );
    userInfo = userInfo.rows[0];

    if (!userInfo) {
      return res.code(200).send({
        status: false,
        info: "Invalid User",
      });
    }

    if (userInfo.AccountStatus === newAccountStatus) {
      return res.code(200).send({
        status: false,
        info:
          newAccountStatus === 1
            ? "Already Account is Active"
            : "Already Account is Inactive",
      });
    }

    if (newAccountStatus === 1 && userInfo.KycStatus !== "Approved") {
      return res.code(200).send({
        status: false,
        info: "User KYC is not Approved",
      });
    }

    const query = 'UPDATE "Users" SET "AccountStatus" = $1 WHERE "_id" = $2';
    const values = [newAccountStatus, UserId];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        await Axios.post(
          Config.Services.EmailService + "/AccountConfirmEmail",
          {
            To: userInfo.Email,
            Message: newAccountStatus === 1 ? "Approved" : "Rejected",
          }
        );

        return res.code(200).send({
          status: true,
          info:
            newAccountStatus === 1
              ? "Account Activated"
              : "Account Deactivated",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating account status:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/updateaccountstatus", error);
    return res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const UpdateFeaturedStatus = async (req, res) => {
  let { UserId, FeaturedStatus } = req.body;

  try {
    let userInfo = await pool.query(
      `SELECT * FROM "Users" WHERE _id = '${UserId}'`
    );
    userInfo = userInfo.rows[0];

    let count = 0;

    const TotalQuery = `SELECT COUNT(*) AS total_count FROM "Users" WHERE "FeaturedArtist" = true`;

    try {
      const result = await pool.query(TotalQuery);
      count = result.rows[0].total_count;
    } catch (err) {
      console.error("Error fetching total artist count:", err);
    }

    if (FeaturedStatus && count.length >= 3) {
      return res.code(200).send({
        status: false,
        info: "Already 3 users are Pinned. Unpinned Anyone and Try",
      });
    }

    if (!userInfo) {
      return res.code(200).send({
        status: false,
        info: "Invalid User",
      });
    }

    let RoleInfo = await pool.query(
      `SELECT * FROM "UserRole" WHERE _id = '${userInfo.RoleId}'`
    );
    RoleInfo = RoleInfo.rows[0];

    if (RoleInfo.Role != "Artist") {
      return res.code(200).send({
        status: false,
        info: "Not an Artist",
      });
    }

    if (userInfo.FeaturedArtist === FeaturedStatus) {
      return res.code(200).send({
        status: false,
        info: FeaturedStatus
          ? "Already it is Pinned"
          : "Already It is UnPinned",
      });
    }

    const query = 'UPDATE "Users" SET "FeaturedArtist" = $2 WHERE _id = $1';
    const values = [UserId, FeaturedStatus];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      return res.code(200).send({
        status: true,
        info: FeaturedStatus ? "Successfully Pinned" : "Successfully UnPinned",
      });
    } else {
      return res.code(200).send({
        status: false,
        info: "Error in Updating Feature Artist",
      });
    }
  } catch (error) {
    console.log("error-/updateaccountstatus", error);
    return res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const UpdateCountryStatus = async (req, res) => {
  let { Id, Status } = req.body;

  try {
    let Info = await pool.query(`SELECT * FROM "Country" WHERE id = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      return res.code(200).send({
        status: false,
        info: "Invalid Id",
      });
    }

    if (Info.Status === Status) {
      return res.code(200).send({
        status: false,
        info: Status ? "Already it is Enabled" : "Already It is Disabled",
      });
    }

    const query = 'UPDATE "Country" SET "Status" = $2 WHERE id = $1';
    const values = [Id, Status];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      return res.code(200).send({
        status: true,
        info: "Successfully Updated",
      });
    } else {
      return res.code(200).send({
        status: false,
        info: "Error in Updating Status",
      });
    }
  } catch (error) {
    console.log("error-/updateaccountstatus", error);
    return res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Update KYC Status */

const UpdateKYCStatus = async (req, res) => {
  let { UserId, KycStatus } = req.body;
  KycStatus = sanitizeHtml(KycStatus);
  const values = "Pending,Approved,Rejected";
  const arr = values.split(",");

  try {
    // Find the user information by UserId

    let UserInfo = await pool.query(
      `SELECT * FROM "Users" WHERE "_id" = '${UserId}'`
    );
    UserInfo = UserInfo.rows[0];

    if (UserInfo) {
      // Check if the provided KycStatus is valid
      if (!arr.includes(KycStatus)) {
        res.code(403).send({
          status: false,
          info: "Invalid Value For Identity Status",
        });
        return;
      }

      // Check if the KycStatus is already the same as the provided value
      if (UserInfo.KycStatus == KycStatus) {
        res.code(403).send({
          status: false,
          info: "Identity Proof Already is in " + KycStatus.toUpperCase(),
        });
        return;
      } else {
        // Update the user's KycStatus and AccountStatus if necessary

        let accstatus = KycStatus === "Rejected" ? 0 : undefined;

        const query =
          'UPDATE "Users" SET "KycStatus" = $2, "AccountStatus" = $3 WHERE _id = $1';
        const values = [UserId, KycStatus, accstatus];
        const result = await pool.query(query, values);

        res.code(200).send({
          status: true,
          info: "Identity Proof Status Updated to " + KycStatus.toUpperCase(),
        });
        return;
      }
    } else {
      res.code(403).send({
        status: false,
        info: "Invalid User",
      });
      return;
    }
  } catch (error) {
    console.log("error-/kycupdate", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Admin Role */
const AddAdminRole = async (req, res) => {
  const { Role, Modules } = req.body;

  try {
    // Check if the role already exists
    let roleInfo = await pool.query(
      `SELECT * FROM "AdminRoles" WHERE "Role" = $1`,
      [Role]
    );
    roleInfo = roleInfo.rows[0];

    if (roleInfo) {
      res.status(200).send({
        status: false,
        info: "This Role Already Exists",
      });
      return;
    }

    const moduleColumns = Object.keys(Modules)
      .map((moduleName) => `"${moduleName}_Read", "${moduleName}_Write"`)
      .join(", ");

    const valuesPlaceholders = Object.keys(Modules)
      .map(() => "($1, $2)")
      .join(", ");

    const params = [Role];
    const moduleValues = [];
    for (const moduleName in Modules) {
      const module = Modules[moduleName];
      moduleValues.push(module.Read, module.Write);
    }
    params.push(...moduleValues);

    const insertQuery = `
            INSERT INTO "AdminRoles" ("Role", ${moduleColumns})
            VALUES ${valuesPlaceholders}
        `;

    await pool.query(insertQuery, params);

    // Role inserted successfully
    res.status(200).send({
      status: true,
      info: "Role inserted successfully",
    });
  } catch (error) {
    console.error("Error inserting admin role:", error);
    res.status(500).send({
      status: false,
      info: "Error occurred while inserting the role",
      error: error.message,
    });
  }
};

/* Edit Admin Role */
const EditAdminRole = async (req, res) => {
  const { Role, Modules, Id } = req.body;

  // Sanitize input values
  const sanitizedRole = sanitizeHtml(Role);

  try {
    // Check if the role with the provided ID exists
    let roleInfo = await pool.query(
      `SELECT * FROM "AdminRoles" WHERE "_id" = $1`,
      [Id]
    );
    roleInfo = roleInfo.rows[0];

    if (!roleInfo) {
      res.status(200).send({
        status: false,
        info: "Role for this ID does not exist",
      });
      return;
    }

    const updateQueryParts = [];
    const params = [Id];

    for (const moduleName in Modules) {
      const module = Modules[moduleName];
      for (const permissionType in module) {
        const columnName = `${moduleName}_${permissionType}`;
        updateQueryParts.push(
          `"${columnName}" = $${params.push(module[permissionType])}`
        );
      }
    }

    const updateQuery = `
            UPDATE "AdminRoles"
            SET ${updateQueryParts.join(", ")}
            WHERE "_id" = $1`;

    try {
      await pool.query(updateQuery, params);
      // Role updated successfully
      res.status(200).send({
        status: true,
        info: "Role updated successfully",
      });
    } catch (error) {
      console.error("Error updating admin roles:", error);
      res.status(500).send({
        status: false,
        info: "Error occurred while updating the role",
        error: error.message, // You can provide more specific error details here if needed
      });
    }
  } catch (error) {
    console.log("error-/editadminrole", error);
    res.status(500).send({
      status: false,
      message: "Invalid ID",
      error: "error",
    });
  }
};

/* Get One Admin Role Info */
const GetOneAdminRole = async (req, res) => {
  const { Id } = req.body;
  try {
    let RoleInfo = await pool.query(
      `SELECT * FROM "AdminRoles" WHERE _id = '${Id}'`
    );
    RoleInfo = RoleInfo.rows[0];

    let RoleData = [];

    let CustomizedRoleData = {
      _id: RoleInfo._id,
      Role: RoleInfo.Role,
      Modules: {
        SettingsModule: {
          Read: RoleInfo.SettingsModule_Read,
          Write: RoleInfo.SettingsModule_Write,
        },
        EmailTemplateModule: {
          Read: RoleInfo.EmailTemplateModule_Read,
          Write: RoleInfo.EmailTemplateModule_Write,
        },
        LandingModule: {
          Read: RoleInfo.LandingModule_Read,
          Write: RoleInfo.LandingModule_Write,
        },
        CMSModule: {
          Read: RoleInfo.CMSModule_Read,
          Write: RoleInfo.CMSModule_Write,
        },
        NewsModule: {
          Read: RoleInfo.NewsModule_Read,
          Write: RoleInfo.NewsModule_Write,
        },
        NetworkModule: {
          Read: RoleInfo.NetworkModule_Read,
          Write: RoleInfo.NetworkModule_Write,
        },
        MaterialModule: {
          Read: RoleInfo.MaterialModule_Read,
          Write: RoleInfo.MaterialModule_Write,
        },
        CategoriesModule: {
          Read: RoleInfo.CategoriesModule_Read,
          Write: RoleInfo.CategoriesModule_Write,
        },
        UserRoleModule: {
          Read: RoleInfo.UserRoleModule_Read,
          Write: RoleInfo.UserRoleModule_Write,
        },
        UserModule: {
          Read: RoleInfo.UserModule_Read,
          Write: RoleInfo.UserModule_Write,
        },
        GiftModule: {
          Read: RoleInfo.GiftModule_Read,
          Write: RoleInfo.GiftModule_Write,
        },
        KeywordModule: {
          Read: RoleInfo.KeywordModule_Read,
          Write: RoleInfo.KeywordModule_Write,
        },
        MediumModule: {
          Read: RoleInfo.MediumModule_Read,
          Write: RoleInfo.MediumModule_Write,
        },
        StylesModule: {
          Read: RoleInfo.StylesModule_Read,
          Write: RoleInfo.StylesModule_Write,
        },
        BioModule: {
          Read: RoleInfo.BioModule_Read,
          Write: RoleInfo.BioModule_Write,
        },
        TestimonialModule: {
          Read: RoleInfo.TestimonialModule_Read,
          Write: RoleInfo.TestimonialModule_Write,
        },
        ExhibitionModule: {
          Read: RoleInfo.ExhibitionModule_Read,
          Write: RoleInfo.ExhibitionModule_Write,
        },
        MediaModule: {
          Read: RoleInfo.MediaModule_Read,
          Write: RoleInfo.MediaModule_Write,
        },
        OfferModule: {
          Read: RoleInfo.OfferModule_Read,
          Write: RoleInfo.OfferModule_Write,
        },
        BidModule: {
          Read: RoleInfo.BidModule_Read,
          Write: RoleInfo.BidModule_Write,
        },
        HistoryModule: {
          Read: RoleInfo.HistoryModule_Read,
          Write: RoleInfo.HistoryModule_Write,
        },
        ArtworkModule: {
          Read: RoleInfo.ArtworkModule_Read,
          Write: RoleInfo.ArtworkModule_Write,
        },
        CollectionModule: {
          Read: RoleInfo.CollectionModule_Read,
          Write: RoleInfo.CollectionModule_Write,
        },
      },
    };

    RoleData.push(CustomizedRoleData);

    if (RoleData) {
      res.code(200).send({
        status: true,
        info: CustomizedRoleData,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneroleinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

// Get One User Role
const GetOneUserRole = async (req, res) => {
  const { Id } = req.body;
  try {
    let UserRoleInfo = await pool.query(
      `SELECT * FROM "UserRole" WHERE "_id" = '${Id}'`
    );
    UserRoleInfo = UserRoleInfo.rows[0];

    if (UserRoleInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(UserRoleInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/UserRoleInfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Update Project Details Settings */
/* Add Categories */
const AddCategories = async (req, res) => {
  let { Title, Status, Image } = req.body;
  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);
  try {
    // Check if the category already exists

    let CategoriesInfo = await pool.query(
      `SELECT * FROM "Categories" WHERE "Title" = $1`,
      [Title]
    );
    CategoriesInfo = CategoriesInfo.rows[0];

    if (CategoriesInfo) {
      res.code(200).send({
        status: false,
        info: "This Category Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "Categories" ("Title", "Status", "Image", "ImageOrg") VALUES ($1, $2, $3, $4)`;
    const values = [Title, Status, Image.CImage, Image.OImage];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Categories Added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addCategories", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Medium */
const AddMedium = async (req, res) => {
  let { Title, Status } = req.body;
  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);
  try {
    // Check if the category already exists

    let Info = await pool.query(`SELECT * FROM "Medium" WHERE "Title" = $1`, [
      Title,
    ]);
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Medium Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "Medium" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Medium Added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addMedium", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

function extractKeywordFromTitle(title) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanedTitle = title.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
  const words = cleanedTitle.split(" ");
  const keyword = words.join("");
  return keyword;
}

/* Add Artist Categories */
const AddArtistCategory = async (req, res) => {
  let { Title, Status, Image } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    // Check if the category already exists

    let Info = await pool.query(
      `SELECT * FROM "ArtistCategories" WHERE "Title" = $1`,
      [Title]
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Category Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtistCategories" ("Title", "Status", "Image", "ImageOrg") VALUES ($1, $2, $3, $4)`;
    const values = [Title, Status, Image.CImage, Image.OImage];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Category Added Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addArtistCategory", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Gift Nft */
const AddGiftNFT = async (req, res) => {
  let { Name, Thumb, Media, IPFSThumb, IPFSMedia, Status, Currency } = req.body;

  Name = sanitizeHtml(Name);

  try {
    // Check if the gift NFT already exists

    let Info = await pool.query(
      `SELECT * FROM "GiftNFT" WHERE "Name" = '${Name}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Gift NFT Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "GiftNFT" ("Name", "Currency", "Thumb", "Media", "Status", "IPFSThumb", "IPFSMedia", "ThumbOrg", "MediaOrg") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const values = [
      Name,
      Currency,
      Thumb.CImage,
      Media.CImage,
      Status,
      IPFSThumb,
      IPFSMedia,
      Thumb.OImage,
      Thumb.OImage,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Gift NFT added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addGiftNft", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Edit Gift NFT */
const EditGiftNFT = async (req, res) => {
  let { Name, Status, Thumb, Media, IPFSThumb, IPFSMedia, Id, Currency } =
    req.body;
  Name = sanitizeHtml(Name);
  Status = sanitizeHtml(Status);
  try {
    // Check if the gift NFT exists

    let Info = await pool.query(`SELECT * FROM "GiftNFT" WHERE _id = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Gift NFT for this ID does not exist",
      });
      return;
    }

    if (Info.PublishStatus) {
      Currency = Info.Currency;
    }

    const query =
      'UPDATE "GiftNFT" SET "Name" = $1, "Thumb" = $2, "Media" = $3, "Status" = $4, "Currency" = $5, "IPFSThumb" = $7, "IPFSMedia" = $8, "ThumbOrg" = $9, "MediaOrg" = $10 WHERE "_id" = $6';
    const values = [
      Name,
      Thumb.CImage ? Thumb.CImage : Info.Thumb,
      Media.CImage ? Media.CImage : Info.Media,
      Status,
      Currency,
      Id,
      IPFSThumb,
      IPFSMedia,
      Thumb.OImage ? Thumb.OImage : Info.ThumbOrg,
      Media.OImage ? Media.OImage : Info.MediaOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Gift NFT Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editGiftNft", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Add Artist Categories */
const AddArtistStyle = async (req, res) => {
  let { Title, Status } = req.body;
  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);
  try {
    // Check if the artist style already exists

    let Info = await pool.query(
      `SELECT * FROM "ArtistStyles" WHERE "Title" = $1`,
      [Title]
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Style Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtistStyles" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Style added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addArtistStyle", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtistLabel = async (req, res) => {
  let { Title, Status } = req.body;

  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtistLabels" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtistLabels" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Label added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addArtistLabel", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Artist Medium */
const AddArtistMedium = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    // Check if the artist medium already exists

    let Info = await pool.query(
      `SELECT * FROM "ArtistMedium" WHERE "Title" = $1`,
      [Title]
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Medium Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtistMedium" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Medium added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addArtistMedium", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Material */
const AddMaterial = async (req, res) => {
  let { Title, Status } = req.body;
  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    // Check if the category already exists

    let Info = await pool.query(
      `SELECT * FROM "Materials" WHERE "Title" = $1`,
      [Title]
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Material Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "Materials" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Materials Added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addMaterial", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductBrand = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductBrand" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductBrand" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Brand added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductCategory = async (req, res) => {
  let { Title, Status, Image } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductCategory" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductCategory" ("Title", "Status", "Image", "ImageOrg") VALUES ($1, $2, $3, $4)`;
    const values = [Title, Status, Image.CImage, Image.OImage];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Category added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductFabric = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductFabric" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductFabric" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Fabric added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductMaterial = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductMaterial" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductMaterial" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Material added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductName = async (req, res) => {
  let { Title, Status, Type, Image } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);
  Type = sanitizeHtml(Type);

  if (Type != "Furniture" && Type != "Furnishing" && Type != "Lighting") {
    res.code(200).send({
      status: false,
      info: "Type Should be Furniture / Furnishing / Lighting",
    });
    return;
  }

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductName" WHERE "Title" = $1 AND "Type" = $2`,
      [Title, Type]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductName" ("Title", "Type", "Status", "Image", "ImageOrg") VALUES ($1, $2, $3, $4, $5)`;
    const values = [Title, Type, Status, Image.CImage, Image.OImage];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Name added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductStyle = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductStyle" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductStyle" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Style added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductSize = async (req, res) => {
  let { Title, Status, Type } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  if (Type !== "Cushions" && Type !== "Rugs") {
    res.code(200).send({
      status: false,
      info: "Type Should be Cushions / Rugs",
    });
    return;
  }

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductSize" WHERE "Title" = $1 AND "Type" = $2`,
      [Title, Type]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductSize" ("Title", "Status", "Type") VALUES ($1, $2, $3)`;
    const values = [Title, Status, Type];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Size added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductShape = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductShape" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductShape" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Shape added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductType = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductType" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductType" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Type added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddArtProductTechnique = async (req, res) => {
  let { Title, Status } = req.body;

  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    let EInfo = await pool.query(
      `SELECT * FROM "ArtProductTechnique" WHERE "Title" = $1`,
      [Title]
    );
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "Title Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "ArtProductTechnique" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Art Product Technique added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addartproduct", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Keyword */
const AddKeyword = async (req, res) => {
  let { Title, Status } = req.body;
  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);

  try {
    // Check if the category already exists

    let Info = await pool.query(`SELECT * FROM "KeyWords" WHERE "Title" = $1`, [
      Title,
    ]);
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Keyword Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "KeyWords" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Keywords Added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addKeyword", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Edit Keyword */
const EditKeyword = async (req, res) => {
  let { Title, Status, Id } = req.body;
  Title = sanitizeHtml(Title);
  Status = sanitizeHtml(Status);
  try {
    // Find the material by ID

    let Info = await pool.query(`SELECT * FROM "KeyWords" WHERE _id = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "KeyWords" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Keywords Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editKeyword", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get one Keyword */
const GetOneKeyword = async (req, res) => {
  const { Id } = req.body;

  try {
    // Find the keyword with the given Id

    let KeywordInfo = await pool.query(
      `SELECT * FROM "KeyWords" WHERE "_id" = '${Id}'`
    );
    KeywordInfo = KeywordInfo.rows[0];

    if (KeywordInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(KeywordInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneKeywordinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get Keyword Listing */
const KeywordList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "KeyWords" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "KeyWords"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getKeywordlist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add News */
const AddNews = async (req, res) => {
  let { Title, Content, Image, Author } = req.body;

  try {
    // Check if the news already exists
    let NewsInfo = await pool.query(`SELECT * FROM "News" WHERE "Title" = $1`, [
      Title,
    ]);
    NewsInfo = NewsInfo.rows[0];

    let AuthorInfo = await pool.query(
      `SELECT * FROM "NewsAuthor" WHERE _id = $1`,
      [Author]
    );
    AuthorInfo = AuthorInfo.rows[0];

    if (NewsInfo) {
      res.code(200).send({
        status: false,
        info: "This News Already Exists",
      });
      return;
    }

    if (!AuthorInfo) {
      res.code(200).send({
        status: false,
        info: "Invalid input for Author",
      });
      return;
    }

    const query = `INSERT INTO "News" ("Title", "Content", "Image", "AuthorId", "ImageOrg") VALUES ($1, $2, $3, $4, $5)`;
    const values = [Title, Content, Image.CImage, Author, Image.OImage];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "News added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addNews", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddFeatures = async (req, res) => {
  let { Name, PublishDate, Image, Status, Info } = req.body;
  try {
    let EInfo = await pool.query(`SELECT * FROM "Features" WHERE "Name" = $1`, [
      Name,
    ]);
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "This Features Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "Features" ("Name", "PublishDate", "Info", "Image", "Status", "ImageOrg") VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      Name,
      PublishDate,
      Info,
      Image.CImage,
      Status,
      Image.OImage,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Features added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addFeatures", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddEvents = async (req, res) => {
  let { Name, PublishDate, Image, Status, Info } = req.body;
  try {
    let EInfo = await pool.query(`SELECT * FROM "Events" WHERE "Name" = $1`, [
      Name,
    ]);
    EInfo = EInfo.rows[0];

    if (EInfo) {
      res.code(200).send({
        status: false,
        info: "This Event Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "Events" ("Name", "PublishDate", "Info", "Image", "Status", "ImageOrg") VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      Name,
      PublishDate,
      Info,
      Image.CImage,
      Status,
      Image.OImage,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Events added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addFeatures", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AddTeam = async (req, res) => {
  let { Name, Position, Image, Info, Instagram, Linkedin, Facebook } = req.body;
  try {
    let TeamInfos = await pool.query(
      `SELECT * FROM "Teams" WHERE "Name" = $1`,
      [Name]
    );
    TeamInfos = TeamInfos.rows[0];

    if (TeamInfos) {
      res.code(200).send({
        status: false,
        info: "This Team Member Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "Teams" ("Name", "Position", "Info", "Instagram", "Facebook", "Linkedin", "Image", "ImageOrg") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values = [
      Name,
      Position,
      Info,
      Instagram,
      Facebook,
      Linkedin,
      Image.CImage,
      Image.OImage,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Team Member Added Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addFeatures", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Edit News */
const EditNews = async (req, res) => {
  let { Title, Content, Image, Author, Id } = req.body;
  try {
    let NewsInfo = await pool.query(`SELECT * FROM "News" WHERE _id = '${Id}'`);
    NewsInfo = NewsInfo.rows[0];

    if (!NewsInfo) {
      res.code(200).send({
        status: false,
        info: "News for this ID does not exist",
      });
      return;
    }

    const query =
      'UPDATE "News" SET "Title" = $1, "Content" = $2, "Image" = $3, "AuthorId" = $4, "ImageOrg" = $6 WHERE "_id" = $5';
    const values = [
      Title,
      Content,
      Image.CImage ? Image.CImage : NewsInfo.Image,
      Author,
      Id,
      Image.OImage ? Image.OImage : NewsInfo.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "News Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating news:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating news",
      });
    }
  } catch (error) {
    console.log("error-/editNews", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditFeatures = async (req, res) => {
  let { Name, PublishDate, Info, Image, Status, Id } = req.body;

  try {
    // Check if the news exists

    let NewsInfo = await pool.query(
      `SELECT * FROM "Features" WHERE _id = '${Id}'`
    );
    NewsInfo = NewsInfo.rows[0];

    if (!NewsInfo) {
      res.code(200).send({
        status: false,
        info: "Features for this ID does not exist",
      });
      return;
    }

    const query =
      'UPDATE "Features" SET "Name" = $1, "PublishDate" = $2, "Info" = $3, "Image" = $4, "Status" = $5, "ImageOrg" = $7 WHERE "_id" = $6';
    const values = [
      Name,
      PublishDate,
      Info,
      Image.CImage ? Image.CImage : NewsInfo.Image,
      Status,
      Id,
      Image.OImage ? Image.OImage : NewsInfo.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Features Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editNews", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditEvents = async (req, res) => {
  let { Name, PublishDate, Image, Status, Id, Info } = req.body;

  try {
    // Check if the news exists
    let NewsInfo = await pool.query(
      `SELECT * FROM "Events" WHERE _id = '${Id}'`
    );
    NewsInfo = NewsInfo.rows[0];

    if (!NewsInfo) {
      res.code(200).send({
        status: false,
        info: "Events for this ID does not exist",
      });
      return;
    }

    const query =
      'UPDATE "Events" SET "Name" = $1, "PublishDate" = $2, "Info" = $3, "Image" = $4, "Status" = $5, "ImageOrg" = $7 WHERE "_id" = $6';
    const values = [
      Name,
      PublishDate,
      Info,
      Image.CImage ? Image.CImage : NewsInfo.Image,
      Status,
      Id,
      Image.OImage ? Image.OImage : NewsInfo.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Events Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editNews", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditTeams = async (req, res) => {
  let { Name, Info, Position, Instagram, Linkedin, Facebook, Image, Id } =
    req.body;

  try {
    let TInfo = await pool.query(`SELECT * FROM "Teams" WHERE _id = '${Id}'`);
    TInfo = TInfo.rows[0];

    if (!TInfo) {
      res.code(200).send({
        status: false,
        info: "Team for this ID does not exist",
      });
      return;
    }

    const query = `UPDATE "Teams" SET "Name" = $1, "Position" = $2, "Info" = $3, "Facebook" = $4, "Instagram" = $5, "Linkedin" = $6, "Image" = $7, "ImageOrg" = $8 WHERE _id = $9`;
    const values = [
      Name,
      Position,
      Info,
      Facebook,
      Instagram,
      Linkedin,
      Image.CImage ? Image.CImage : TInfo.Image,
      Image.OImage ? Image.OImage : TInfo.ImageOrg,
      Id,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Team Members Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating admin:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating admin",
      });
    }
  } catch (error) {
    console.log("error-/editNews", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get One News */
const GetOneNews = async (req, res) => {
  const { Id } = req.body;
  try {
    let NewsInfo = await pool.query(
      `SELECT a.*, ar."Name" as "AuthorName", ar."Content" as "AuthorContent", ar."Image" as "AuthorImage" FROM "News" a LEFT JOIN "NewsAuthor" ar ON a."AuthorId" = ar._id WHERE a._id = '${Id}' ORDER BY a._id DESC`
    );
    NewsInfo = NewsInfo.rows[0];

    if (NewsInfo) {
      res.code(200).send({
        status: true,
        info: NewsInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneNewsinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const GetOneFeatures = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the news by ID and populate the author details
    let NewsInfo = await pool.query(
      `SELECT * FROM "Features" WHERE "_id" = '${Id}'`
    );
    NewsInfo = NewsInfo.rows[0];

    if (NewsInfo) {
      res.code(200).send({
        status: true,
        info: NewsInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneNewsinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const GetOneEvents = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the news by ID and populate the author details

    let NewsInfo = await pool.query(
      `SELECT * FROM "Events" WHERE "_id" = '${Id}'`
    );
    NewsInfo = NewsInfo.rows[0];

    if (NewsInfo) {
      res.code(200).send({
        status: true,
        info: NewsInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneNewsinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const GetOneTeam = async (req, res) => {
  const { Id } = req.body;
  try {
    let TeamInfo = await pool.query(`SELECT * FROM "Teams" WHERE _id = ${Id}`);
    TeamInfo = TeamInfo.rows[0];

    if (TeamInfo) {
      res.code(200).send({
        status: true,
        info: TeamInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneNewsinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get News Listing */
const NewsList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "News" ${query}`,
        params
      );

      const result = await pool.query(
        `
        SELECT a.*, ar."Name" as "AuthorName", ar."Content" as "AuthorContent", ar."Image" as "AuthorImage" FROM "News" a
        LEFT JOIN "NewsAuthor" ar ON a."AuthorId" = ar._id
        ${query}
        ORDER BY a._id DESC
        LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
      `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getNewslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const EventsList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Events" ${query}`,
        params
      );

      const result = await pool.query(
        `
          SELECT * FROM "Events"
          ${query}
          ORDER BY _id DESC
          LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getevents", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getNewslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const FeaturesList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Features" ${query}`,
        params
      );

      const result = await pool.query(
        `
              SELECT * FROM "Features"
              ${query}
              ORDER BY _id DESC
              LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
            `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getfeatures", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getFeatureslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const FoundersList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name", "Position"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Teams" ${query}`,
        params
      );

      const result = await pool.query(
        `
          SELECT * FROM "Teams"
          ${query}
          ORDER BY _id DESC
          LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getfounderslist", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getFounderslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add News */
const AddNewsAuthor = async (req, res) => {
  let { Name, Content, Image } = req.body;
  try {
    let NewsAuthorInfo = await pool.query(
      `SELECT * FROM "NewsAuthor" WHERE "Name" = $1`,
      [Name]
    );
    NewsAuthorInfo = NewsAuthorInfo.rows[0];

    if (NewsAuthorInfo) {
      res.code(200).send({
        status: false,
        info: "This NewsAuthor Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "NewsAuthor" ("Name", "Content", "Image", "ImageOrg") VALUES ($1, $2, $3, $4)`;
    const values = [Name, Content, Image.CImage, Image.OImage];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "News Author added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addNewsAuthor", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Edit News */
const EditNewsAuthor = async (req, res) => {
  let { Name, Content, Image, Id } = req.body;
  try {
    let NewsAuthorInfo = await pool.query(
      `SELECT * FROM "NewsAuthor" WHERE _id = '${Id}'`
    );
    NewsAuthorInfo = NewsAuthorInfo.rows[0];

    if (!NewsAuthorInfo) {
      res.code(200).send({
        status: false,
        info: "NewsAuthor for this ID does not exist",
      });
      return;
    }

    const query =
      'UPDATE "NewsAuthor" SET "Name" = $1, "Content" = $2, "Image" = $3, "ImageOrg" = $5 WHERE "_id" = $4';
    const values = [
      Name,
      Content,
      Image.CImage ? Image.CImage : NewsAuthorInfo.Image,
      Id,
      Image.OImage ? Image.OImage : NewsAuthorInfo.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "News Author Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating news:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating news",
      });
    }
  } catch (error) {
    console.log("error-/editNewsAuthor", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get One News */
const GetOneNewsAuthor = async (req, res) => {
  const { Id } = req.body;
  try {
    let NewsAuthorInfo = await pool.query(
      `SELECT * FROM "NewsAuthor" WHERE _id = '${Id}'`
    );
    NewsAuthorInfo = NewsAuthorInfo.rows[0];

    if (NewsAuthorInfo) {
      res.code(200).send({
        status: true,
        info: NewsAuthorInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneNewsAuthorinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get News Listing */
const NewsAuthorList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      let result = "";
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "NewsAuthor" ${query}`,
        params
      );

      if (limitnw === 0) {
        // If limit is 0, get all records without using LIMIT and OFFSET
        result = await pool.query(
          `
            SELECT * FROM "NewsAuthor"
            ${query}
            ORDER BY _id DESC;
          `,
          params
        );
      } else {
        result = await pool.query(
          `
            SELECT * FROM "NewsAuthor"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
          params
        );
      }

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getNewsAuthorlist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const EditCMS = async (req, res) => {
  let { Content, Id } = req.body;

  try {
    // Check if the news exists

    let Info = await pool.query(`SELECT * FROM "CMS" WHERE _id = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "CMS for this ID does not exist",
      });
      return;
    }

    const query = 'UPDATE "CMS" SET "Content" = $1 WHERE "_id" = $2';
    const values = [Content, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "CMS Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating cms:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editCms", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const GetOneCMS = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the news by ID

    let Info = await pool.query(`SELECT * FROM "CMS" WHERE "_id" = '${Id}'`);
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getonecmsinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const CMSList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];

    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Page"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "CMS" ${query}`,
        params
      );

      const result = await pool.query(
        `
              SELECT * FROM "CMS"
              ${query}
              ORDER BY _id DESC
              LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
            `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getcms", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getcmslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Styles */
const AddStyles = async (req, res) => {
  let { Title, Status } = req.body;
  try {
    // Check if the category already exists

    let Info = await pool.query(`SELECT * FROM "Style" WHERE "Title" = $1`, [
      Title,
    ]);
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: false,
        info: "This Style Already Exists",
      });
      return;
    }

    const query = `INSERT INTO "Style" ("Title", "Status") VALUES ($1, $2)`;
    const values = [Title, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Styles Added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addStyles", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Edit Categories */
const EditCategories = async (req, res) => {
  let { Title, Status, Id, Image } = req.body;
  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "Categories" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "Categories" SET "Title" = $1, "Status" = $2, "Image" = $3, "ImageOrg" = $5 WHERE "_id" = $4';
    const values = [
      Title,
      Status,
      Image.CImage ? Image.CImage : Info.Image,
      Id,
      Image.OImage ? Image.OImage : Info.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Categories Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editcategory", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Edit Material */
const EditMaterial = async (req, res) => {
  let { Title, Status, Id } = req.body;
  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "Materials" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "Materials" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Materials Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editMaterial", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductBrand = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductBrand" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductBrand" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductCategory = async (req, res) => {
  let { Title, Status, Id, Image } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductCategory" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductCategory" SET "Title" = $1, "Status" = $2, "Image" = $3, "ImageOrg" = $5 WHERE "_id" = $4';
    const values = [
      Title,
      Status,
      Image.CImage ? Image.CImage : Info.Image,
      Id,
      Image.OImage ? Image.OImage : Info.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductFabric = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductFabric" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductFabric" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductMaterial = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductMaterial" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductMaterial" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductName = async (req, res) => {
  let { Title, Status, Type, Id, Image } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductName" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductName" SET "Title" = $1, "Status" = $2, "Type" = $3, "Image" = $4, "ImageOrg" = $6 WHERE "_id" = $5';
    const values = [
      Title,
      Status,
      Type,
      Image.CImage ? Image.CImage : Info.Image,
      Id,
      Image.OImage ? Image.OImage : Info.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductSize = async (req, res) => {
  let { Title, Status, Type, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductSize" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductSize" SET "Title" = $1, "Status" = $2, "Type" = $3 WHERE "_id" = $4';
    const values = [Title, Status, Type, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductStyle = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductStyle" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductStyle" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductShape = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductShape" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductShape" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductType = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductType" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductType" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtProductTechnique = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtProductTechnique" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtProductTechnique" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editartproduct", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Edit Medium */
const EditMedium = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(`SELECT * FROM "Medium" WHERE _id = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "Medium" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Medium Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editMedium", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Edit Artist Category */
const EditArtistCategory = async (req, res) => {
  let { Title, Status, Image, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtistCategories" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtistCategories" SET "Title" = $1, "Status" = $2, "Image" = $3, "ImageOrg" = $5 WHERE "_id" = $4';
    const values = [
      Title,
      Status,
      Image.CImage ? Image.CImage : Info.Image,
      Id,
      Image.OImage ? Image.OImage : Info.ImageOrg,
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Categories Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editArtistCategory", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Edit Artist Style */
const EditArtistStyle = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtistStyles" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtistStyles" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Style Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editArtistStyle", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const EditArtistLabel = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtistLabels" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtistLabels" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Labels Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editArtistLabel", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Edit Artist Medium */
const EditArtistMedium = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtistMedium" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "ArtistMedium" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artist Medium Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editArtistMedium", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Edit Styles */
const EditStyles = async (req, res) => {
  let { Title, Status, Id } = req.body;

  try {
    // Find the material by ID

    let Info = await pool.query(`SELECT * FROM "Style" WHERE _id = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Info For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "Style" SET "Title" = $1, "Status" = $2 WHERE "_id" = $3';
    const values = [Title, Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Style Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editStyles", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Edit Styles */
const EditNetwork = async (req, res) => {
  let {
    Name,
    Currency,
    AdminAddress,
    AdminKey,
    RpcUrl,
    ChainID,
    FeeAddress,
    BlockExplorer,
    FactoryContract,
    MultiContract,
    GiftContract,
    MultiAbiArray,
    FactoryAbiArray,
    GiftAbiArray,
    AdminCommission,
    Id,
  } = req.body;
  try {
    let NetworkInfo = await pool.query(
      `SELECT * FROM "Networks" WHERE _id = '${Id}'`
    );
    NetworkInfo = NetworkInfo.rows[0];

    if (!NetworkInfo) {
      res.code(200).send({
        status: false,
        info: "Network For this ID Not Exist",
      });
      return;
    }

    AdminKey = await Encrypt(AdminKey);

    const midpoint = Math.ceil(AdminKey.length / 2);

    const Key_1 = AdminKey.slice(0, midpoint);
    const Key_2 = AdminKey.slice(midpoint);

    const query =
      'UPDATE "Networks" SET "Name" = $1, "Currency" = $2, "AdminAddress" = $3, "RpcUrl" = $4, "ChainID" = $5, "BlockExplorer" = $6, "FactoryContract" = $7, "MultiContract" = $8, "GiftContract" = $9, "MultiAbiArray" = $10, "FactoryAbiArray" = $11, "GiftAbiArray" = $12, "AdminCommission" = $13, "Key_1" = $15, "Key_2" = $16, "FeeAddress" = $17 WHERE "_id" = $14';
    const values = [
      Name,
      Currency,
      AdminAddress,
      RpcUrl,
      ChainID,
      BlockExplorer,
      FactoryContract,
      MultiContract,
      GiftContract,
      MultiAbiArray,
      FactoryAbiArray,
      GiftAbiArray,
      AdminCommission,
      Id,
      Key_1,
      Key_2,
      FeeAddress
    ];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Networks Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating networks:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editNetwork", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const UpdateArtworkStatus = async (req, res) => {
  let { Id, ApproveStatus } = req.body;

  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtItems" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Artitem For this ID Not Exist",
      });
      return;
    }

    if (Info.ApproveStatus === ApproveStatus) {
      res.code(200).send({
        status: false,
        info: "Artitem Already have this ApproveStatus Only",
      });
      return;
    }

    const query = 'UPDATE "ArtItems" SET "ApproveStatus" = $2 WHERE _id = $1';
    const values = [Id, ApproveStatus];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.code(200).send({
        status: true,
        info: "Artwork Approve Status Updated Successfully",
      });
    } else {
      res.code(403).send({
        status: false,
        info: "Error in Processing Request",
      });
      return;
    }
  } catch (error) {
    console.log("error-/editNetwork", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const BulkUpdateArtworkStatus = async (req, res) => {
  let { AuthorId, ApproveStatus, Type } = req.body;

  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtItems" WHERE "AuthorId" = '${AuthorId}' AND "Steps" = 5 AND "PublishStatus" = false`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "No ArtItem Found With Unapproved status for this user",
      });
      return;
    } else {
      const query = `UPDATE "ArtItems"
            SET "ApproveStatus" = $2
            WHERE "AuthorId" = $1
                AND "Steps" = 5
                AND "PublishStatus" = false
                AND "ApproveStatus" = false
                AND "Type" = $3;
            `;
      const values = [AuthorId, ApproveStatus, Type];
      const result = await pool.query(query, values);

      console.log("Dfdf", result);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Artworks Under this User Approved Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    }
  } catch (error) {
    console.log("error-/artworkbulkupdate", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const EditMediaLimit = async (req, res) => {
  let { Height, Width, Size, Id } = req.body;

  try {
    let Info = await pool.query(
      `SELECT * FROM "MediaLimit" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Media Limit For this ID Not Exist",
      });
      return;
    }

    const query =
      'UPDATE "MediaLimit" SET "Width" = $1, "Height" = $2, "Size" = $3 WHERE "_id" = $4';
    const values = [Width, Height, Size, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Media Limit Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editMedialimit", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Edit Styles */
const EditUserRoleAgreement = async (req, res) => {
  let { Agreement, Id } = req.body;

  try {
    let UserRoleInfo = await pool.query(
      `SELECT * FROM "UserRole" WHERE _id = '${Id}'`
    );
    UserRoleInfo = UserRoleInfo.rows[0];

    if (!UserRoleInfo) {
      res.code(200).send({
        status: false,
        info: "UserRole For this ID Not Exist",
      });
      return;
    }

    const query = 'UPDATE "UserRole" SET "Agreement" = $1 WHERE "_id" = $2';
    const values = [Agreement, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "User Role Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editUserRole", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get One Categories Info */
const GetOneCategories = async (req, res) => {
  const { Id } = req.body;
  try {
    let CategoriesInfo = await pool.query(
      `SELECT * FROM "Categories" WHERE "_id" = '${Id}'`
    );
    CategoriesInfo = CategoriesInfo.rows[0];

    if (CategoriesInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(CategoriesInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneCategoryinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get One Medium Info */
const GetOneMedium = async (req, res) => {
  const { Id } = req.body;
  try {
    let MediumInfo = await pool.query(
      `SELECT * FROM "Medium" WHERE "_id" = '${Id}'`
    );
    MediumInfo = MediumInfo.rows[0];

    if (MediumInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(MediumInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneMediuminfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get One Artist Category Info */
const GetOneArtistCategory = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtistCategories" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneartistcategoryinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get One Gift NFT Info */
const GetOneGiftNFT = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the gift NFT information by ID

    let Info = await pool.query(
      `SELECT * FROM "GiftNFT" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows;

    if (Info) {
      // If the information exists, return a success response with sanitized data
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      // If the information doesn't exist, return an empty response
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getonegiftnftinfo", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get Art Edition Info */
const GetArtEdition = async (req, res) => {
  const { Id } = req.body;
  try {
    const resultCount = await pool.query(`SELECT Count(*) FROM "Editions"`);

    const query = `SELECT e.*, u."UserName" as "UserName" FROM "Editions" e JOIN "Users" u ON e."CurrentOwner" = u."_id"
        WHERE e."ItemId" = $1;`;
    const values = [Id];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.status(200).send({
        status: true,
        info: result.rows,
        count: resultCount.rows[0].count,
      });
    } else {
      res.status(200).send({
        status: false,
        info: [],
        count: 0,
      });
    }
  } catch (error) {
    console.log("error-/getuserslist", error);
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get One Artist Style Info */
const GetOneArtistStyle = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the artist style information by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtistStyles" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      // If the information exists, return a success response with sanitized data
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      // If the information doesn't exist, return an empty response
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneartiststyleinfo", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

const GetOneArtistLabel = async (req, res) => {
  const { Id } = req.body;

  try {
    // Find the artist style information by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtistLabels" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      // If the information exists, return a success response with sanitized data
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      // If the information doesn't exist, return an empty response
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneartiststyleinfo", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

// Get One Artist Medium
const GetOneArtistMedium = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the artist medium information by ID

    let Info = await pool.query(
      `SELECT * FROM "ArtistMedium" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      // If the information exists, return a success response with sanitized data
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      // If the information doesn't exist, return an empty response
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneartistmediuminfo", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get One Material Info */
const GetOneMaterial = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the material with the given Id

    let MaterialInfo = await pool.query(
      `SELECT * FROM "Materials" WHERE "_id" = '${Id}'`
    );
    MaterialInfo = MaterialInfo.rows[0];

    if (MaterialInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(MaterialInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneMaterialinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductBrand = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the news by ID and populate the author details
    let Info = await pool.query(
      `SELECT * FROM "ArtProductBrand" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductCategory = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductCategory" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductFabric = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductFabric" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductMaterial = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductMaterial" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductName = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductName" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductSize = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductSize" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductShape = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductShape" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductStyle = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductStyle" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductType = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductType" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneArtProductTechnique = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "ArtProductTechnique" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: Info,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get One Styles Info */
const GetOneStyles = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the styles with the given Id

    let StylesInfo = await pool.query(
      `SELECT * FROM "Style" WHERE "_id" = '${Id}'`
    );
    StylesInfo = StylesInfo.rows[0];

    if (StylesInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(StylesInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneStylesinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get One Collection Info */
const GetOneCollection = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the collection with the given Id

    let CollectionInfo = await pool.query(
      `SELECT * FROM "Collections" WHERE "_id" = '${Id}'`
    );
    CollectionInfo = CollectionInfo.rows[0];

    if (CollectionInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(CollectionInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneCollectioninfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const processArtworkInfo = (artworkInfo) => {
  artworkInfo.Category = artworkInfo.Category.split(", ");
  artworkInfo.Material = artworkInfo.Material.split(", ");
  artworkInfo.Subject = artworkInfo.Subject.split(", ");
  artworkInfo.Keywords = artworkInfo.Keywords.split(", ");
  artworkInfo.Style = artworkInfo.Style.split(", ");
  return artworkInfo;
};

/* Get One Styles Info */
const GetOneArtwork = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find the artwork information by ID

    const Info = await GetOneArtworkInfo(Id);
    res.code(200).send({
      status: true,
      info: Info,
    });
  } catch (error) {
    console.log("error-/getoneArtworkinfo", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

// Artwork List
const ArtworkList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      const fields = ["Title", "UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query = `WHERE (${conditions.join(" OR ")}) AND "Type" = 'Artwork'`;
    }

    if (query) {
      query += " AND ";
    } else {
      query += "WHERE ";
    }
    query += `"Type" = 'Artwork'`;

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtItems" WHERE "Type"='Artwork'`
      );

      const result = await pool.query(
        `
            SELECT a.*, ar."Email", ar."UserName", ar."ProfilePicture", cc."Name" as "CollectionName"
            FROM "ArtItems" a
            LEFT JOIN "Users" ar ON a."AuthorId" = ar._id
            LEFT JOIN "Collections" cc ON a."CollectionId" = cc._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(
          skipIndex
        )};           
            `,
        params
      );

      if (result.rowCount > 0) {
        res.status(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.status(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtworklist", error);
    // If an error occurred, return an error
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const ArtproductList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      const fields = ["Title", "UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query = `WHERE (${conditions.join(" OR ")}) AND "Type" = 'ArtProduct'`;
    }

    if (query) {
      query += " AND ";
    } else {
      query += "WHERE ";
    }
    query += `"Type" = 'ArtProduct'`;

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtItems" WHERE "Type"='ArtProduct'`
      );

      const result = await pool.query(
        `
            SELECT a.*, ar."Email", ar."UserName", ar."ProfilePicture", cc."Name" as "CollectionName"
            FROM "ArtItems" a
            LEFT JOIN "Users" ar ON a."AuthorId" = ar._id
            LEFT JOIN "Collections" cc ON a."CollectionId" = cc._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(
          skipIndex
        )};           
            `,
        params
      );

      if (result.rowCount > 0) {
        res.status(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.status(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtworklist", error);
    // If an error occurred, return an error
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get One Network Info */

const GetOneNetwork = async (req, res) => {
  const { Id } = req.body;
  try {
    let NetworkInfo = await pool.query(
      `SELECT * FROM "Networks" WHERE "_id" = '${Id}'`
    );
    NetworkInfo = NetworkInfo.rows[0];

    if (NetworkInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(NetworkInfo),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneNetworkinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

const GetOneMediaLimit = async (req, res) => {
  const { Id } = req.body;
  try {
    let Info = await pool.query(
      `SELECT * FROM "MediaLimit" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneNetworkinfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id", //'Error Occurred',
      error: "error",
    });
  }
};

/* Get Categories Listing */
const CategoriesList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `
            SELECT COUNT(*) FROM "Categories"
            ${query}
            `,
        params
      );
      const result = await pool.query(
        `
            SELECT * FROM "Categories"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getcategorieslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Medium List */
const MediumList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Medium" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "Medium"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getMediumlist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Artist Category List */
const ArtistCategoryList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtistCategories" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtistCategories"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtistcategorylist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const CountryList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["name", "code"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Country" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "Country"
            ${query}
            ORDER BY id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getCountrylist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Gift NFT List */
const GiftNFTList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name", "Currency", "Status"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "GiftNFT" ${query}`,
        params
      );

      const result = await pool.query(
        `
                SELECT a.*, COALESCE(ar."UserName", '') as "UserName" FROM "GiftNFT" a
                LEFT JOIN "Users" ar ON a."UserId" = ar._id
                ${query}
                ORDER BY a._id DESC
                LIMIT $${params.push(limitnw)} OFFSET $${params.push(
          skipIndex
        )};
            `,
        params
      );

      if (result.rowCount > 0) {
        res.status(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.status(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getuserslist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getGiftNFTlist", error);
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

module.exports = {
  GiftNFTList,
};

/* Get Artist Style Listing */
const ArtistStyleList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtistStyles" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtistStyles"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtiststylelist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const ArtistLabelList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtistLabels" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtistLabels"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtiststylelist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Artist Medium List
const ArtistMediumList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtistMedium" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtistMedium"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtistmediumlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Material List
const MaterialList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Materials" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "Materials"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getMateriallist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Category List
const ArtProductCategoryList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductCategory" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductCategory"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Brand List

const ArtProductBrandList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductBrand" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductBrand"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getartproductbrand", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Fabric List

const ArtProductFabricList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductFabric" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductFabric"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Material List

const ArtProductMaterialList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductMaterial" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductMaterial"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Name List

const ArtProductNameList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Type", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductName" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductName"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Shape List

const ArtProductShapeList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductShape" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductShape"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Size List

const ArtProductSizeList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductSize" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductSize"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Style List

const ArtProductStyleList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductStyle" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductStyle"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Technique List

const ArtProductTechniqueList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductTechnique" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductTechnique"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Art Product Type List

const ArtProductTypeList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "ArtProductType" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "ArtProductType"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getArtproductlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Styles List
const StylesList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "Status"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Style" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "Style"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getStyleslist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Notification List */
const NotificationList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["UserName", "Email"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Notifications" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*,
                   ar."UserName",
                   ar."Email",
                   COALESCE(art."Title", nft."Name") AS "ItemName"
            FROM "Notifications" a
            LEFT JOIN "Users" ar ON a."UserId" = ar._id
            LEFT JOIN "ArtItems" art ON a."ItemId" = art._id
            LEFT JOIN "GiftNFT" nft ON a."ItemId" = nft._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getuserslist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Bio List */
const BioList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Bio" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*, ar."UserName", ar."Email" FROM "Bio" a
            LEFT JOIN "Users" ar ON a."UserId" = ar._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getbiolist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getBiolist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Get One Bio
const GetOneBio = async (req, res) => {
  const { Id } = req.body;

  try {
    // Retrieve a single bio information based on the ID
    let Info = await pool.query(`SELECT * FROM "Bio" WHERE _id = '${Id}'`);
    Info = Info.rows[0];

    if (Info) {
      // If the information exists, return a success response with sanitized data
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      // If the information doesn't exist, return an empty response
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getinfo", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const EditBioStatus = async (req, res) => {
  let { Status, Id } = req.body;

  Status = sanitizeHtml(Status);

  try {
    let Info = await pool.query(`SELECT * FROM "Bio" WHERE "_id" = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Bio Info For this ID Not Exist",
      });
      return;
    }

    const query = 'UPDATE "Bio" SET "Status" = $1 WHERE "_id" = $2';
    const values = [Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Status Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating bio:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editcategory", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

// Testimonial List
const TestimonialList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Testimonials" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*, ar."UserName", ar."Email" FROM "Testimonials" a
            LEFT JOIN "Users" ar ON a."UserId" = ar._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/gettestimoniallist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getBiolist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const EditTestimonialStatus = async (req, res) => {
  let { Status, Id } = req.body;
  Status = sanitizeHtml(Status);
  try {
    // Find the category by ID

    let Info = await pool.query(
      `SELECT * FROM "Testimonials" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Testimonial Info For this ID Not Exist",
      });
      return;
    }

    const query = 'UPDATE "Testimonials" SET "Status" = $1 WHERE "_id" = $2';
    const values = [Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Status Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating testimonials:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editcategory", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

/* Get Medias List */
const MediasList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Medias" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*, ar."UserName", ar."Email" FROM "Medias" a
            LEFT JOIN "Users" ar ON a."UserId" = ar._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/gettestimoniallist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getBiolist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const EditMediaStatus = async (req, res) => {
  let { Status, Id } = req.body;
  Status = sanitizeHtml(Status);
  try {
    // Find the category by ID

    let Info = await pool.query(`SELECT * FROM "Medias" WHERE "_id" = '${Id}'`);
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Medias For this ID Not Exist",
      });
      return;
    }

    const query = 'UPDATE "Medias" SET "Status" = $1 WHERE "_id" = $2';
    const values = [Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Status Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating medias:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editcategory", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

// Get One Testimonial
const GetOneTestimonial = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find a single testimonial by Id

    let Info = await pool.query(
      `SELECT * FROM "Testimonials" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getinfo", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Get One Medias
const GetOneMedias = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find a single media by Id

    let Info = await pool.query(`SELECT * FROM "Medias" WHERE _id = '${Id}'`);
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getinfo", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Exhibition List
const ExhibitionList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Title", "UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Exhibitions" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*, ar."UserName", ar."Email" FROM "Exhibitions" a
            LEFT JOIN "Users" ar ON a."UserId" = ar._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/gettestimoniallist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getexhibitinlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const EditExhibtionStatus = async (req, res) => {
  let { Status, Id } = req.body;

  try {
    // Find the category by ID

    let Info = await pool.query(
      `SELECT * FROM "Exhibitions" WHERE "_id" = '${Id}'`
    );
    Info = Info.rows[0];

    if (!Info) {
      res.code(200).send({
        status: false,
        info: "Exhibition For this ID Not Exist",
      });
      return;
    }

    const query = 'UPDATE "Exhibitions" SET "Status" = $1 WHERE "_id" = $2';
    const values = [Status, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Status Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating exhibition:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editcategory", error);
    res.code(500).send({
      status: false,
      message: "Invalid Id",
      error: "error",
    });
  }
};

// Get One Exhibition
const GetOneExhibition = async (req, res) => {
  const { Id } = req.body;
  try {
    // Find a single exhibition by Id

    let Info = await pool.query(
      `SELECT * FROM "Exhibitions" WHERE _id = '${Id}'`
    );
    Info = Info.rows[0];

    if (Info) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(Info),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getinfo", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Collection List
const CollectionList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name", "Currency"]; // Add other fields if   needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Collections" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*,
                   ar."UserName",
                   ar."Email",
                   ar."ProfilePicture"
            FROM "Collections" a
            LEFT JOIN "Users" ar ON a."AuthorId" = ar._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getCollectionlist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Bid List
const BidList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    try {
      const result = await pool.query(
        `
          SELECT a.*, ar."Email" as "SenderEmail", ar."UserName" as "SenderUserName", ai."Title" as "ItemName",
          rr."Email" as "ReceiverEmail", rr."UserName" as "ReceiverUserName"
          FROM "Bids" a
          LEFT JOIN "Users" ar ON a."Sender" = ar._id
          LEFT JOIN "Users" rr ON a."Receiver" = rr._id
          LEFT JOIN "ArtItems" ai ON a."ItemId" = ai._id
          ORDER BY a._id DESC
          LIMIT $1 OFFSET $2;
        `,
        [limitnw, skipIndex]
      );

      let filteredResults = "";

      // Filter the results based on the search criteria
      if(search){
        filteredResults = result.rows.filter((item) => {
          return (
            item.ItemName.toLowerCase().includes(search.toLowerCase()) || // Search by ItemName alias
            item.SenderUserName.toLowerCase().includes(search.toLowerCase()) || // Search by SenderUserName alias
            item.ReceiverUserName.toLowerCase().includes(search.toLowerCase()) // Search by ReceiverUserName alias
            // Add other fields if needed
          );
        });
      }else{
        filteredResults = result.rows;
      }
      

      const resultCount = filteredResults.length;

      if (resultCount > 0) {
        res.status(200).send({
          status: true,
          info: filteredResults,
          count: resultCount,
        });
      } else {
        res.status(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getOfferlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Offer List
const OfferList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    try {
      const result = await pool.query(
        `
          SELECT a.*, ar."Email" as "SenderEmail", ar."UserName" as "SenderUserName", ai."Title" as "ItemName",
          rr."Email" as "ReceiverEmail", rr."UserName" as "ReceiverUserName"
          FROM "Offers" a
          LEFT JOIN "Users" ar ON a."Sender" = ar._id
          LEFT JOIN "Users" rr ON a."Receiver" = rr._id
          LEFT JOIN "ArtItems" ai ON a."ItemId" = ai._id
          ORDER BY a._id DESC
          LIMIT $1 OFFSET $2;
        `,
        [limitnw, skipIndex]
      );

      let filteredResults = "";

      // Filter the results based on the search criteria
      if(search){
        filteredResults = result.rows.filter((item) => {
          return (
            item.ItemName.toLowerCase().includes(search.toLowerCase()) || // Search by ItemName alias
            item.SenderUserName.toLowerCase().includes(search.toLowerCase()) || // Search by SenderUserName alias
            item.ReceiverUserName.toLowerCase().includes(search.toLowerCase()) // Search by ReceiverUserName alias
            // Add other fields if needed
          );
        });
      }else{
        filteredResults = result.rows;
      }
      

      const resultCount = filteredResults.length;

      if (resultCount > 0) {
        res.status(200).send({
          status: true,
          info: filteredResults,
          count: resultCount,
        });
      } else {
        res.status(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getOfferlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};


// Network List
const NetworkList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name", "Currency"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");

      // Handle ChainID separately if it's provided in the search query
      const chainIdSearch = parseInt(search);
      if (!isNaN(chainIdSearch)) {
        if (query !== "WHERE ") {
          query += " OR ";
        }
        query += `"ChainID" = $${params.push(chainIdSearch)}`;
      }
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Networks" ${query}`,
        params
      );

      const result = await pool.query(
        `
          SELECT * FROM "Networks"
          ${query}
          ORDER BY _id DESC
          LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.status(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.status(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getnetworks", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getNetworklist", error);
    // If an error occurred, return an error response
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const WithdrawHistoryList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["From", "To", "Currency", "Amount", "TransactionHash"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "WithdrawHistories" ${query}`,
        params
      );

      const result = await pool.query(
        `
        SELECT * FROM "WithdrawHistories"
        ${query}
        ORDER BY _id DESC
        LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
      `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getnetworks", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getNetworklist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AdminBalanceList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Currency"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "AdminBalanceDetails" ${query}`,
        params
      );

      const result = await pool.query(
        `
        SELECT * FROM "AdminBalanceDetails"
        ${query}
        ORDER BY _id DESC
        LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
      `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getadminbalance", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getNetworklist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const MediaLimitList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Type"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "MediaLimit" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "MediaLimit"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getmedialimit", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getmedialimitlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const CsvSamplesList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Type"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "CSVSamples" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT * FROM "CSVSamples"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getmedialimit", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getmedialimitlist", error);
    // If an error occurred, return an error response
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get User Role Info */
const GetUserRoles = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Role"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "UserRole" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT *,
                   CASE 
                      WHEN "Role" = 'Collector' THEN 'Private Collector'
                      ELSE "Role"
                   END AS "Role"
            FROM "UserRole"
            ${query}
            ORDER BY _id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getartproductbrand", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getuserole", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// LandingSection1
const LandingSection1 = (fastify) => async (req, res) => {
  try {
    const { Image } = req.body;
    const Id = 1;

    const query = 'UPDATE "Landing" SET "Section1Image" = $1 WHERE "_id" = $2';
    const values = [Image.OImage, Id];

    try {
      await pool.query(query, values);
      res.code(200).send({
        status: true,
        message: "Section1 Image Uploaded Successfully",
      });
    } catch (error) {
      console.log("error executing query:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/Section1Imageupdate", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const CsvsampleUpdate = (fastify) => async (req, res) => {
  try {
    const { Image, Id } = req.body;

    const query = 'UPDATE "CSVSamples" SET "Sample" = $1 WHERE "_id" = $2';
    const values = [Image.OImage, Id];

    try {
      await pool.query(query, values);
      res.code(200).send({
        status: true,
        message: "CSV Sample Uploaded Successfully",
      });
    } catch (error) {
      console.log("error executing query:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/Section1Imageupdate", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const AboutusSection = (fastify) => async (req, res) => {
  try {
    let { Image, Section1Text, Section3Content, Section3Title } = req.body;

    const Id = 1;

    let TInfo = await pool.query(`SELECT * FROM "AboutUs" WHERE _id = '${Id}'`);
    TInfo = TInfo.rows[0];

    const query =
      'UPDATE "AboutUs" SET "Section1Image" = $1, "Section1Text" = $2, "Section3Content" = $3, "Section3Title" = $4, "Section1ImageOrg" = $6 WHERE "_id" = $5';
    const values = [
      Image.CImage ? Image.CImage : TInfo.Image,
      Section1Text,
      Section3Content,
      Section3Title,
      Id,
      Image.OImage ? Image.OImage : TInfo.ImageOrg,
    ];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.log("error executing query:", error);
      throw new Error("Failed to update Section2 in the Landing table.");
    }

    res.code(200).send({
      status: true,
      message: "About US Info Updated Successfully",
    });

    return;
  } catch (error) {
    console.log("error-/update", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const Banner = (fastify) => async (req, res) => {
  try {
    let { Type, Image } = req.body;

    try {
      const query = `UPDATE "Banners" SET "${Type}" = $1`;
      const values = [Image.OImage];

      try {
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
          res.code(200).send({
            status: true,
            info: "Banner Image Updated Successfully",
          });
        } else {
          res.code(403).send({
            status: false,
            info: "Error in Processing Request",
          });
          return;
        }
      } catch (error) {
        console.log("Error updating email templates:", error);
        res.code(500).send({
          status: false,
          info: "Error Occurred while updating email templates",
        });
      }
    } catch (error) {
      console.log("error-/editemailtemplates", error);
      res.code(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/BannerImageupdate", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const InnerBanner = (fastify) => async (req, res) => {
  try {
    let { Type, Image } = req.body;

    try {
      const query = `UPDATE "InnerBanners" SET "${Type}" = $1`;
      const values = [Image.OImage];

      try {
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
          res.code(200).send({
            status: true,
            info: "Inner Banner Image Updated Successfully",
          });
        } else {
          res.code(403).send({
            status: false,
            info: "Error in Processing Request",
          });
          return;
        }
      } catch (error) {
        console.log("Error updating email templates:", error);
        res.code(500).send({
          status: false,
          info: "Error Occurred while updating email templates",
        });
      }
    } catch (error) {
      console.log("error-/editemailtemplates", error);
      res.code(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/InnerBannerImageupdate", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

// Get LandingPage Details
const GetLandingPageDetails = (fastify) => async (req, res) => {
  try {
    // Retrieve landing page details

    let LandingInfo;
    try {
      LandingInfo = await pool.query(`SELECT * FROM "Landing"`);
      LandingInfo = LandingInfo.rows[0];
    } catch (error) {
      console.log("error executing query:", error);
      throw new Error("Failed to retrieve landing page details.");
    }

    let Info = [];
    let CustomRes = {
      _id: LandingInfo._id,
      Section1Image: LandingInfo.Section1Image,
      Section2Text: LandingInfo.Section2Text,
      Section2Images: {
        Image1: LandingInfo.Section2Image1,
        Image2: LandingInfo.Section2Image2,
        Image3: LandingInfo.Section2Image3,
        Image4: LandingInfo.Section2Image4,
      },
      Section3Image: LandingInfo.Section3Image,
      Section3Text: LandingInfo.Section3Text,
      Section2Description: LandingInfo.Section2Description,
      Section2Title: LandingInfo.Section2Title,
      Section3Description: LandingInfo.Section3Description,
      Section3Title: LandingInfo.Section3Title,
    };

    Info.push(CustomRes);

    res.code(200).send({
      status: true,
      Info: Info,
    });
    return;
  } catch (error) {
    console.log("error-/getlandingpagedetails", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const GetAboutusPageDetails = (fastify) => async (req, res) => {
  try {
    // Retrieve landing page details

    let Info;
    try {
      Info = await pool.query(`SELECT * FROM "AboutUs"`);
      Info = Info.rows;
    } catch (error) {
      console.log("error executing query:", error);
      throw new Error("Failed to retrieve about page details.");
    }

    res.code(200).send({
      status: true,
      Info: Info,
    });
    return;
  } catch (error) {
    console.log("error-/getaboutuspagedetails", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

// Get Banner Details
const GetBannerDetails = (fastify) => async (req, res) => {
  try {
    let Info = await pool.query(`SELECT * FROM "Banners"`);
    Info = Info.rows;

    res.code(200).send({
      status: true,
      Info: Info,
    });
    return;
  } catch (error) {
    console.log("error-/getlandingpagedetails", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

// Get InnerBanner Details
const GetInnerBannerDetails = (fastify) => async (req, res) => {
  try {
    // Retrieve landing page details

    let Info = await pool.query(`SELECT * FROM "InnerBanners"`);
    Info = Info.rows;

    res.code(200).send({
      status: true,
      Info: Info,
    });
    return;
  } catch (error) {
    console.log("error-/getInnerBannerdetails", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const LandingSection2 = (fastify) => async (req, res) => {
  try {
    let {
      Section2Text,
      Section2Title,
      Section2Description,
      Image1,
      Image2,
      Image3,
      Image4,
    } = req.body;

    const Id = 1;

    let TInfo = await pool.query(`SELECT * FROM "Landing" WHERE _id = '${Id}'`);
    TInfo = TInfo.rows[0];

    Image1 = Image1 ? Image1 : TInfo.Section2Image1;
    Image2 = Image2 ? Image2 : TInfo.Section2Image2;
    Image3 = Image3 ? Image3 : TInfo.Section2Image3;
    Image4 = Image4 ? Image4 : TInfo.Section2Image4;
    const query =
      'UPDATE "Landing" SET "Section2Text" = $1, "Section2Image1" = $2, "Section2Image2" = $3, "Section2Image3" = $4, "Section2Image4" = $5, "Section2Title" = $6, "Section2Description" = $7 WHERE "_id" = $8';
    const values = [
      Section2Text,
      Image1,
      Image2,
      Image3,
      Image4,
      Section2Title,
      Section2Description,
      Id,
    ];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.log("error executing query:", error);
      throw new Error("Failed to update Section2 in the Landing table.");
    }

    res.code(200).send({
      status: true,
      message: "Section2 Image Uploaded Successfully",
    });
    return;
  } catch (error) {
    console.log("error-/Section2Imageupdate", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const LandingSection3 = (fastify) => async (req, res) => {
  try {
    const { Section3Text, Image, Section3Description, Section3Title } =
      req.body;
    const Id = 1;

    let TInfo = await pool.query(`SELECT * FROM "Landing" WHERE _id = '${Id}'`);
    TInfo = TInfo.rows[0];

    const query =
      'UPDATE "Landing" SET "Section3Text" = $1, "Section3Image" = $2, "Section3Title" = $3, "Section3Description" = $4, "Section3ImageOrg" = $6 WHERE "_id" = $5';
    const values = [
      Section3Text,
      Image.CImage ? Image.CImage : TInfo.Section3Image,
      Section3Title,
      Section3Description,
      Id,
      Image.OImage ? Image.OImage : TInfo.Section3ImageOrg,
    ];

    try {
      await pool.query(query, values);
      res.code(200).send({
        status: true,
        message: "Section3 Details Uploaded Successfully",
      });
    } catch (error) {
      console.log("error executing query:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/Section3Imageupdate", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

// Get Profile Views By Month
const GetProfileViewsByMonth = async (req, res) => {
  try {
    // Retrieve profile views for the past 12 months
    const result =
      await pool.query(`SELECT TO_CHAR("createdAt", 'Mon') AS month, EXTRACT(YEAR FROM "createdAt") AS year,
            COUNT(*) AS count
            FROM "ProfileViews"
            WHERE "createdAt" >= NOW() - INTERVAL '12 months'
            GROUP BY year, month, "createdAt"
            ORDER BY year, EXTRACT(MONTH FROM "createdAt")`);
    try {
      if (result.rowCount > 0) {
        const monthlyCounts = {};

        result.rows.forEach((row) => {
          const { month, year, count } = row;
          const monthYear = `${month}/${year}`;
          if (!monthlyCounts[monthYear]) {
            monthlyCounts[monthYear] = 0;
          }
          monthlyCounts[monthYear] += parseInt(count);
        });

        const response = {
          status: true,
          info: monthlyCounts,
        };

        res.status(200).send(response);
      } else {
        res.status(200).json({
          status: false,
          info: {},
        });
      }
    } catch (error) {
      console.log("error executing query:", error);
      res.status(500).json({
        status: false,
        info: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/profileinfo", error);
    res.status(500).json({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Get Item Views By Month

const GetItemViewsByMonth = async (req, res) => {
  try {
    // Retrieve Item views for the past 12 months
    const result = await pool.query(`
            SELECT
                TO_CHAR("createdAt", 'MM/YYYY') AS month_year,
                COUNT(*) AS count
            FROM "ItemViews"
            WHERE "createdAt" >= NOW() - INTERVAL '12 months'
            GROUP BY month_year
            ORDER BY month_year
        `);

    try {
      if (result.rowCount > 0) {
        const cumulativeCounts = {};
        let cumulativeCount = 0;

        result.rows.forEach((row) => {
          const { month_year, count } = row;
          cumulativeCount += parseInt(count);
          cumulativeCounts[month_year] = cumulativeCount;
        });

        const response = {
          status: true,
          info: cumulativeCounts,
        };

        res.status(200).send(response);
      } else {
        res.status(200).json({
          status: false,
          info: {},
        });
      }
    } catch (error) {
      console.log("error executing query:", error);
      res.status(500).json({
        status: false,
        info: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/profileinfo", error);
    res.status(500).json({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Get Profile Views By Country

const GetProfileViewsByCountry = async (req, res) => {
  try {
    // Retrieve Profile views Based on Country

    const query = `SELECT pv."Country" AS country,
        COUNT(*) AS count,
        (
            SELECT jsonb_build_object('email', u."Email", 'username', u."UserName")
            FROM "Users" u
            WHERE u."_id" = pv."UserId"
            LIMIT 1
        ) AS user_info
 FROM "ProfileViews" pv
 GROUP BY pv."Country", pv."UserId";
 
    `;

    try {
      let Info = await pool.query(query);
      res.code(200).send({
        status: true,
        info: Info.rows,
      });
    } catch (error) {
      console.log("error executing query:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/profileinfo", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Get Item Views By Country

const GetItemViewsByCountry = async (req, res) => {
  try {
    // Retrieve Item views Based on Country

    const query = `SELECT
        ivm."Country" AS country,
        COUNT(*) AS count,
        (
            SELECT
                a."Title"
            FROM "ArtItems" a
            WHERE a."_id" = ivm."ItemId"
            LIMIT 1
        ) AS item_title
    FROM "ItemViews" ivm
    GROUP BY ivm."Country", ivm."ItemId"
    `;

    try {
      let Info = await pool.query(query);
      res.code(200).send({
        status: true,
        info: Info.rows,
      });
    } catch (error) {
      console.log("error executing query:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/profileinfo", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const GetItemDetail = async (req, res) => {
  try {
    const ItemResult = await pool.query(
      `SELECT * FROM "ArtItems" where "Type"='Artwork'`
    );
    const totalItems = ItemResult.rowCount;

    const approvedItemsquery = await pool.query(`
            SELECT * FROM "ArtItems" WHERE "Type"='Artwork' AND "ApproveStatus" = TRUE`);
    const approvedItems = approvedItemsquery.rowCount;
    //const approvalPercentage = Math.round((approvedItems / totalItems) * 100);

    const MintedItemsquery = await pool.query(`
        SELECT * FROM "ArtItems" WHERE "Type"='Artwork' AND "PublishStatus" = TRUE`);
    const mintedItems = MintedItemsquery.rowCount;
    //const mintedPercentage = Math.round((mintedItems / totalItems) * 100);

    const incompleteItemsquery = await pool.query(`
        SELECT * FROM "ArtItems" WHERE "Type"='Artwork' AND "Steps" < 5`);
    const incompleteItems = incompleteItemsquery.rowCount;
    // const incompletePercentage = Math.round((incompleteItems / totalItems) * 100);

    res.code(200).send({
      status: true,
      Total: totalItems,
      Approved: approvedItems,
      Minted: mintedItems,
      Incomplete: incompleteItems,
    });
  } catch (error) {
    console.log("error executing query:", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const GetArtProductItemDetail = async (req, res) => {
  try {
    const ItemResult = await pool.query(
      `SELECT * FROM "ArtItems" where "Type"='ArtProduct'`
    );
    const totalItems = ItemResult.rowCount;

    const approvedItemsquery = await pool.query(`
            SELECT * FROM "ArtItems" WHERE "Type"='ArtProduct' AND "ApproveStatus" = TRUE`);
    const approvedItems = approvedItemsquery.rowCount;
    //const approvalPercentage = Math.round((approvedItems / totalItems) * 100);

    const MintedItemsquery = await pool.query(`
        SELECT * FROM "ArtItems" WHERE "Type"='ArtProduct' AND "PublishStatus" = TRUE`);
    const mintedItems = MintedItemsquery.rowCount;
    //const mintedPercentage = Math.round((mintedItems / totalItems) * 100);

    const incompleteItemsquery = await pool.query(`
        SELECT * FROM "ArtItems" WHERE "Type"='ArtProduct' AND "Steps" < 5`);
    const incompleteItems = incompleteItemsquery.rowCount;
    // const incompletePercentage = Math.round((incompleteItems / totalItems) * 100);

    res.code(200).send({
      status: true,
      Total: totalItems,
      Approved: approvedItems,
      Minted: mintedItems,
      Incomplete: incompleteItems,
    });
  } catch (error) {
    console.log("error executing query:", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const GetSalesDetail = async (req, res) => {
  try {
    const ItemResult = await pool.query(`
            SELECT DISTINCT ON ("HistoryType", TO_CHAR("createdAt", 'MM/YYYY'))
                "HistoryType",
                TO_CHAR("createdAt", 'MM/YYYY') AS month_year,
                SUM("Price") OVER (PARTITION BY "HistoryType" ORDER BY TO_CHAR("createdAt", 'YYYY-MM')) AS cumulative_sum
            FROM
                "Histories"
            WHERE
                "HistoryType" IN ('AdminCommission', 'Listed', 'Royalty')
            ORDER BY
                "HistoryType", TO_CHAR("createdAt", 'MM/YYYY'), TO_CHAR("createdAt", 'YYYY-MM') DESC;
        `);

    const totalItems = ItemResult.rows;

    res.code(200).send({
      status: true,
      Total: totalItems,
    });
  } catch (error) {
    console.log("error executing query:", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

const GetUserDetail = async (req, res) => {
  try {
    const ItemResult =
      await pool.query(`SELECT R."Role" AS "Role", COUNT(U._id) AS "UserCount" FROM
        "Users" U JOIN "UserRole" R ON U."RoleId" = R._id GROUP BY R."Role", R._id ORDER BY R._id;`);

    const totalItems = ItemResult.rows;

    res.code(200).send({
      status: true,
      Total: totalItems,
    });
  } catch (error) {
    console.log("error executing query:", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

/* Mint Gift NFT */

const AdminWithdraw = (fastify) => async (req, res) => {
  try {
    let { Amount, WalletAddress, Currency } = req.body;
    let ChainInfo = await pool.query(
      `SELECT * FROM "Networks" WHERE "Currency" = '${Currency}'`
    );
    ChainInfo = ChainInfo.rows[0];

    if (!ChainInfo) {
      res.code(200).send({
        status: false,
        message: "Invalid Currency",
      });
      return;
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(ChainInfo.RpcUrl));

    let Wallet = web3.eth.accounts.wallet;
    Wallet.clear();
    Wallet = Wallet.create(0);
    let AdminKey = ChainInfo.Key_1 + ChainInfo.Key_2;
    Wallet.add(Decrypt(AdminKey));

    if (Wallet[0].address.toLowerCase() == WalletAddress.toLowerCase()) {
      res.code(200).send({
        status: false,
        message: "Both Sender and Receiver Address Same",
      });
      return;
    }

    const adminBalance = await web3.eth.getBalance(Wallet[0].address);
    const requestedAmountWei = web3.utils.toWei(Amount, "ether");

    if (adminBalance < requestedAmountWei) {
      res.code(200).send({
        status: false,
        message: "Insufficient Admin Balance for withdrawal",
      });
      return;
    }

    const nonce = await web3.eth.getTransactionCount(Wallet[0].address);

    const txData = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      to: WalletAddress,
      value: web3.utils.toHex(web3.utils.toWei(Amount, "ether")), // Amount to send in wei
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      txData,
      Decrypt(AdminKey)
    );

    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    if (txReceipt.status && txReceipt.transactionHash) {
      const query1 = `INSERT INTO "WithdrawHistories" ("From", "To", "TransactionHash", "Currency", "Amount") VALUES ($1, $2, $3, $4, $5)`;
      const values1 = [
        Wallet[0].address,
        WalletAddress,
        txReceipt.transactionHash,
        Currency,
        Amount,
      ];
      const result1 = await pool.query(query1, values1);

      if (result1.rowCount > 0) {
        let Email = await Axios.post(
          Config.Services.EmailService + "/WithdrawEmail",
          {
            AdminWallet: Wallet[0].address,
            UserWallet: WalletAddress,
            Amount: Amount,
            Currency: Currency,
          }
        );
        res.code(200).send({
          status: true,
          message: "Withdraw Success",
        });
        return;
      } else {
        res.code(200).send({
          status: false,
          message: "Error in Withdraw",
        });
      }
    } else {
      res.code(200).send({
        status: false,
        message: "Withdraw Failed",
      });
      return;
    }
  } catch (error) {
    console.log("error-/withdraw", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const MintGiftNft = (fastify) => async (req, res) => {
  try {
    let { Id, UserId } = req.body;

    let ItemInfo = await pool.query(
      `SELECT * FROM "GiftNFT" WHERE _id = '${Id}'`
    );
    ItemInfo = ItemInfo.rows[0];

    if (!ItemInfo) {
      res.code(200).send({
        status: false,
        message: "Gift NFT Not Exist",
      });
      return;
    }

    if (ItemInfo.PublishStatus) {
      res.code(200).send({
        status: false,
        message: "Gift NFT Already Minted",
      });
      return;
    }

    let UserInfo = await pool.query(
      `SELECT * FROM "Users" WHERE _id = '${UserId}'`
    );
    UserInfo = UserInfo.rows[0];

    if (!UserInfo) {
      res.code(200).send({
        status: false,
        message: "User Not Exist",
      });
      return;
    }

    if (!UserInfo.WalletAddress) {
      res.code(200).send({
        status: false,
        message: "User Wallet Not Linked",
      });
      return;
    }

    let ChainInfo = await pool.query(
      `SELECT * FROM "Networks" WHERE "Currency" = '${ItemInfo.Currency}'`
    );
    ChainInfo = ChainInfo.rows[0];

    if (!ChainInfo) {
      res.code(200).send({
        status: false,
        message: "Invalid Currency",
      });
      return;
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(ChainInfo.RpcUrl));
    let GiftContractAddress = ChainInfo.GiftContract;
    let GiftAbi = ChainInfo.GiftAbiArray;

    let Instance = new web3.eth.Contract(
      JSON.parse(GiftAbi),
      GiftContractAddress
    );

    let TokenId = await Instance.methods.lastTokenId().call();

    TokenId = parseInt(TokenId) + parseInt(1);

    let foldername = extractKeywordFromTitle(ItemInfo.Name);

    const MetaInfo = {
      Name: ItemInfo.Name,
      Folder: foldername,
      TokenId: TokenId,
      Media: ItemInfo.IPFSMedia,
    };
    let MetaJsoninfo = await Axios.post(
      Config.Services.FileService + "GiftMetaJson",
      MetaInfo
    );
    const respon = MetaJsoninfo.data.MetaJson;
    let Ipfsinfo = await Axios.post(
      Config.Services.FileService + "GiftIpfsCID",
      { Data: foldername }
    );
    const resp = Ipfsinfo.data.IpfsCID;
    let ipfsHash = `https://ipfs.io/ipfs/${resp}/`;

    let Wallet = web3.eth.accounts.wallet;
    Wallet.clear();
    Wallet = Wallet.create(0);
    let AdminKey = ChainInfo.Key_1 + ChainInfo.Key_2;
    Wallet.add(Decrypt(AdminKey));

    let Amount = 1;
    let data = "0x00";
    let UserWallet = UserInfo.WalletAddress;
    let EstimateGas = await Instance.methods
      .mintForOthers(UserWallet, Amount, ipfsHash, data)
      .estimateGas({ from: Wallet[0].address });
    let Highergas = (EstimateGas * 1.4).toFixed(0);
    let trans_status = false;
    let transaction = await Instance.methods
      .mintForOthers(UserWallet, Amount, ipfsHash, data)
      .send({ from: Wallet[0].address, gas: Highergas });
    if (transaction.status && transaction.transactionHash) {
      let MintDate = new Date();
      const query =
        'UPDATE "GiftNFT" SET "TokenId" = $1, "MintedDate" = $2, "Status" = $5, "TransferStatus" = true, "PublishStatus" = true, "MarketPlaceStatus" = true, "UserId" = $4, "IPFSCid" = $6, "IPFSHash" = $7 WHERE "_id" = $3';
      const values = [
        TokenId,
        MintDate,
        Id,
        UserId,
        "Inactive",
        resp,
        ipfsHash,
      ];

      try {
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
          const query1 = `INSERT INTO "GiftHistories" ("ItemId", "UserId", "TransactionHash", "Price", "HistoryType") VALUES ($1, $2, $3, $4, $5)`;
          const values1 = [
            Id,
            UserId,
            transaction.transactionHash,
            0,
            "GiftNFTMint",
          ];

          try {
            const result1 = await pool.query(query1, values1);

            if (result1.rowCount > 0) {
              const query2 = `INSERT INTO "Notifications" ("Type", "ItemId", "Price", "UserId") VALUES ('Gift NFT Published', $1, 0, $2)`;
              const values2 = [Id, UserId];

              try {
                const result2 = await pool.query(query2, values2);

                if (result2.rowCount > 0) {
                  res.code(200).send({
                    status: true,
                    message: "Gift NFT Published successfully",
                  });
                  return;
                }
              } catch (error) {
                console.log("Error executing query2:", error);
              }
            }
          } catch (error) {
            console.log("Error executing query1:", error);
          }
        }
      } catch (error) {
        console.log("Error executing query:", error);
      }
    } else {
      res.code(200).send({
        status: false,
        message: "Gift NFT Mint Failed",
      });
      return;
    }
  } catch (error) {
    console.log("error-/create collection", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Gift History Listing */
const GiftHistoryList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Name", "Email", "HistoryType"]; // Add other fields if   needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "GiftHistories" ${query}`,
        params
      );

      const result = await pool.query(
        `
            SELECT a.*,
                   ar."UserName",
                   ar."Email",
                   COALESCE(nft."Name") AS "ItemName"
            FROM "GiftHistories" a
            LEFT JOIN "Users" ar ON a."UserId" = ar._id
            LEFT JOIN "GiftNFT" nft ON a."ItemId" = nft._id
            ${query}
            ORDER BY a._id DESC
            LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
          `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/getgiftnftlist", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Artwork Mint For User from Admin */

const MintArtwork = (fastify) => async (req, res) => {
  try {
    let { Id } = req.body;

    let ItemInfo = await pool.query(
      `SELECT * FROM "ArtItems" WHERE _id = '${Id}'`
    );
    ItemInfo = ItemInfo.rows[0];

    if (!ItemInfo) {
      res.code(200).send({
        status: false,
        message: "Artwork Not Exist",
      });
      return;
    }

    if (ItemInfo.PublishStatus) {
      res.code(200).send({
        status: false,
        message: "Artwork Already Minted",
      });
      return;
    }

    let UserInfo = await pool.query(
      `SELECT * FROM "Users" WHERE "_id" = '${ItemInfo.AuthorId}'`
    );
    UserInfo = UserInfo.rows[0];

    if (!UserInfo) {
      res.code(200).send({
        status: false,
        message: "User Not Exist",
      });
      return;
    }

    if (!UserInfo.WalletAddress) {
      res.code(200).send({
        status: false,
        message: "User Wallet Not Linked",
      });
      return;
    }

    let ChainInfo = await pool.query(
      `SELECT * FROM "Networks" WHERE "Currency" = '${ItemInfo.Currency}'`
    );
    ChainInfo = ChainInfo.rows[0];

    if (!ChainInfo) {
      res.code(200).send({
        status: false,
        message: "Invalid Currency",
      });
      return;
    }

    let CollectionInfo = await pool.query(
      `SELECT * FROM "Collections" WHERE _id = '${ItemInfo.CollectionId}'`
    );
    CollectionInfo = CollectionInfo.rows[0];

    const web3 = new Web3(new Web3.providers.HttpProvider(ChainInfo.RpcUrl));
    let ContractAddress = CollectionInfo.ContractAddress;
    let Abi = Config.collectionABIArray;

    let Instance = new web3.eth.Contract(JSON.parse(Abi), ContractAddress);

    let TokenId = await Instance.methods.lastTokenId().call();

    TokenId = parseInt(TokenId) + parseInt(1);

    const MetaInfo = {
      Name: ItemInfo.Title,
      TokenId: TokenId,
      Description: ItemInfo.Description,
      Media: ItemInfo.Media.IPFS,
      CollectionName: CollectionInfo.Name,
      IPFSCid: CollectionInfo.IPFSCid,
      IPFSHash: CollectionInfo.IPFSHash,
    };

    let MetaJsoninfo = await Axios.post(
      Config.Services.FileService + "MetaJson",
      MetaInfo
    );

    const respon = MetaJsoninfo.data.MetaJson;

    let Ipfsinfo = await Axios.post(Config.Services.FileService + "IpfsCID", {
      Data: CollectionInfo.Name,
    });
    const resp = Ipfsinfo.data.IpfsCID;

    let ipfsHash = `https://ipfs.io/ipfs/${resp}/`;

    let Wallet = web3.eth.accounts.wallet;
    Wallet.clear();
    Wallet = Wallet.create(0);
    let AdminKey = ChainInfo.Key_1 + ChainInfo.Key_2;
    Wallet.add(Decrypt(AdminKey));

    let Amount = 1;
    let data = "0x00";
    let UserWallet = UserInfo.WalletAddress;

    let EstimateGas = await Instance.methods
      .mintForOthers(UserWallet, Amount, ipfsHash, data)
      .estimateGas({ from: Wallet[0].address });
    let Highergas = (EstimateGas * 1.4).toFixed(0);

    let transaction = await Instance.methods
      .mintForOthers(UserWallet, Amount, ipfsHash, data)
      .send(
        { from: Wallet[0].address, gas: Highergas },
        function (error, events) {
        }
      )
      .then("transactionHash", async (hash) => {});

    if (transaction.status && transaction.transactionHash) {
      let mDate = new Date();
      const query =
        'UPDATE "ArtItems" SET "TokenId" = $2, "MintedDate" = $3, "Status" = $4, "PublishStatus" = true, "MarketPlaceStatus" = false WHERE _id = $1';
      const values = [Id, TokenId, mDate, "Inactive"];
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        const query = `INSERT INTO "Histories" ("ItemId", "CollectionId", "FromId", "ToId", "TransactionHash", "Price", "HistoryType") VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [
          Id,
          ItemInfo.CollectionId,
          "",
          ItemInfo.AuthorId,
          transaction.TransactionHash,
          ItemInfo.Price,
          "Minted",
        ];

        const result = await pool.query(query, values);
      }

      const query3 = `INSERT INTO "Prices" ("ItemId", "UserId", "Price") VALUES ($1, $2, $3)`;
      const values3 = [Id, ItemInfo.AuthorId, ItemInfo.Price];

      const result3 = await pool.query(query3, values3);

      const query2 = `INSERT INTO "Notifications" ("Type", "ItemId", "Price", "UserId") VALUES ('Item Published', $1, $2, $3)`;
      const values2 = [Id, ItemInfo.Price, ItemInfo.AuthorId];

      const result2 = await pool.query(query2, values2);

      let CollectionInfo = await pool.query(
        `SELECT * FROM "Collections" WHERE _id = '${ItemInfo.CollectionId}'`
      );
      CollectionInfo = CollectionInfo.rows[0];

      let Ipfsinfo = await Axios.post(
        Config.Services.FileService + "IpfsUpload",
        { Data: CollectionInfo.Name }
      );
      const MetaDataIpfs = Ipfsinfo.data.IpfsCID;
      if (MetaDataIpfs) {
        if (
          CollectionInfo.IPFSCid &&
          CollectionInfo.IPFSCid != MetaDataIpfs.cid
        ) {
          // Remove the previous IPFS CID from the collection
          let IpfsRemove = await Axios.post(
            Config.Services.FileService + "IpfsUnpin",
            { Data: CollectionInfo.IPFSCid }
          );

          // Update the collection with the new IPFS CID
        }

        let ipfshsh = `https://ipfs.io/ipfs/${MetaDataIpfs.cid}`;

        const query = await pool.query(
          `UPDATE "Collections" SET "IPFSCid" = '${MetaDataIpfs.cid}', "IPFSHash" = '${ipfshsh}' WHERE _id = '${CollectionInfo._id}' `
        );

        res.code(200).send({
          status: true,
          message: "Item Published Successfully",
        });
        return;
      } else {
        res.code(200).send({
          status: false,
          message: "Upload to IPFS Failed",
        });
        return;
      }
    } else {
      res.code(200).send({
        status: false,
        message: "Gift NFT Mint Failed",
      });
      return;
    }
  } catch (error) {
    console.log("error-/create collection", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Artwork Mint For User from Admin */

const SellRequest = (fastify) => async (req, res) => {
  try {
    let { Id } = req.body;

    let ItemInfo = await pool.query(
      `SELECT * FROM "ArtItems" WHERE _id = '${Id}'`
    );
    ItemInfo = ItemInfo.rows[0];

    if (!ItemInfo) {
      res.code(200).send({
        status: false,
        message: "Artwork Not Exist",
      });
      return;
    }

    if (ItemInfo.MarketPlaceStatus) {
      res.code(200).send({
        status: false,
        message: "Artwork Already Listed to Market",
      });
      return;
    }

    let UserInfo = await pool.query(
      `SELECT * FROM "Users" WHERE "_id" = '${ItemInfo.AuthorId}'`
    );
    UserInfo = UserInfo.rows[0];

    let Sell_Request_Email = await Axios.post(
      Config.Services.EmailService + "/NFTSellEmail",
      {
        To: UserInfo.Email,
      }
    );

    if (Sell_Request_Email.status) {
      const query2 = `INSERT INTO "Notifications" ("Type", "ItemId", "Price", "UserId") VALUES ('Sell Request Received', $1, $2, $3)`;
      const values2 = [Id, ItemInfo.Price, ItemInfo.AuthorId];

      const result2 = await pool.query(query2, values2);

      if (result2.rowCount > 0) {
        return res.code(200).send({
          status: true,
          message: "Sell Request Sent",
        });
      }
    } else {
      return res.code(200).send({
        status: false,
        message: "Sell Request Failed to Sent",
      });
    }

    const query2 = `INSERT INTO "Notifications" ("Type", "ItemId", "Price", "UserId") VALUES ('Sell Request Received', $1, $2, $3)`;
    const values2 = [Id, ItemInfo.Price, ItemInfo.AuthorId];

    const result2 = await pool.query(query2, values2);

    if (result2.rowCount > 0) {
      return res.code(200).send({
        status: true,
        message: "Sell Request Sent",
      });
    }
  } catch (error) {
    console.log("error-/create collection", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Updated SQl Functions */

// Authentication

const Authentication = (fastify) => async (req, res) => {
  try {
    let { Email, Password } = req.body;

    Email = sanitizeHtml(Email);
    Password = sanitizeHtml(Password);

    if (!Email || !Password) {
      res.code(400).send({
        status: false,
        message: "Email and Password are mandatory",
      });
      return;
    }

    Email = Email.toLowerCase().trim();
    Password = Encrypt(Password);

    let Alrdy_User = await pool.query(
      `SELECT * FROM "Admin" WHERE "Email" = '${Email}' AND "Password" = '${Password}'`
    );

    Alrdy_User = Alrdy_User.rows[0];

    // If user not found, return error
    if (!Alrdy_User) {
      await ActivityUpdate(
        req,
        Email,
        "Admin Login Failed",
        "fail",
        "Invalid Credentials"
      );
      res.code(200).send({
        status: false,
        response: "Invalid Credentials",
      });
      return;
    }

    // If user is inactive, return error
    if (Alrdy_User.Status == "Inactive") {
      await ActivityUpdate(
        req,
        Email,
        "Admin Login Failed",
        "fail",
        "Account Disabled"
      );
      res.code(200).send({
        status: false,
        response: "Account Disabled",
      });
      return;
    }

    let SettingInfo = await pool.query(`SELECT * FROM "Settings"`);
    SettingInfo = SettingInfo.rows[0];

    // If Admin2FA is enabled
    if (SettingInfo.Admin2FA) {
      // Generate OTP
      let OTP = Math.floor(100000 + Math.random() * 900000);
      // Send OTP verification email
      let OTP_Verify_Email = await Axios.post(
        Config.Services.EmailService + "/Admin2FAVerifyEmail",
        {
          To: Email,
          OTP: OTP,
        }
      );

      if (OTP_Verify_Email.status) {
        // Generate token with OTP and send response
        const Token = fastify.jwt.sign(
          { UserId: Alrdy_User._id, AuthOTP: OTP },
          { expiresIn: "15m" }
        );

        res.code(200).send({
          status: true,
          auth2: true,
          response: Token,
          message: "Please Enter the OTP which is shared to your Email",
        });
        return;
      }
    } else {
      // Generate token without OTP
      const Token = fastify.jwt.sign(
        {
          Email: Alrdy_User.Email,
          UserId: Alrdy_User._id,
          Role: Alrdy_User.RoleId,
          Status: Alrdy_User.Status,
        },
        { expiresIn: "3h" }
      );

      if (Token) {
        await ActivityUpdate(req, Email, "Login", "success", "");
        // Set cookie and session, and send response
        res.setCookie("token", Token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
        req.session.user = Alrdy_User;
        res.code(200).send({
          status: true,
          auth2: false,
          response: Token,
          message: "Login Success",
          AuthId: Alrdy_User._id,
        });
        return;
      } else {
        res.code(500).send({
          status: false,
          response: "Internal Server Error",
        });
        return;
      }
    }
  } catch (error) {
    console.log("error-/authentication", error.message);
    res.code(500).send({
      status: false,
      message: error,
      error: "error",
    });
  }
};

/* Admin 2FA Verification */

const Verify2FA = (fastify) => async (req, res) => {
  const { Token, OTP } = req.body;

  try {
    let Tkn = await fastify.jwt.verify(Token);
    if (!Tkn) {
      res.code(200).send({
        status: false,
        message: "OTP Expired",
      });
      return;
    }

    const { UserId, AuthOTP } = await fastify.jwt.verify(Token);
    if (AuthOTP != OTP) {
      res.code(200).send({
        status: false,
        message: "Incorrect OTP",
      });
      return;
    }

    let Alrdy_User = await pool.query(
      `SELECT * FROM "Admin" WHERE _id = '${UserId}'`
    );

    Alrdy_User = Alrdy_User.rows[0];

    const Tokennw = fastify.jwt.sign(
      {
        Email: Alrdy_User.Email,
        UserId: Alrdy_User._id,
        Status: Alrdy_User.Status,
      },
      { expiresIn: "3h" }
    );

    if (Tokennw) {
      await ActivityUpdate(req, Alrdy_User.Email, "Login", "success", "");
      res.setCookie("token", Tokennw, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      req.session.user = Alrdy_User;
      res.code(200).send({
        status: true,
        response: Tokennw,
        AuthId: Alrdy_User._id,
      });
      return;
    } else {
      res.code(500).send({
        status: false,
        response: "Internal Server Error",
      });
      return;
    }
  } catch (error) {
    console.log("error-/verify2fA", error);
    if (error.message == "The token is malformed.") {
      res.code(500).send({
        status: false,
        message: "Invalid Token",
        error: "error",
      });
    } else {
      res.code(500).send({
        status: false,
        message: error.message,
        error: "error",
      });
    }
  }
};

const VerifyNetwork2FA = (fastify) => async (req, res) => {
  const { Token, OTP } = req.body;

  try {
    let Tkn = await fastify.jwt.verify(Token);
    if (!Tkn) {
      res.code(200).send({
        status: false,
        message: "OTP Expired",
      });
      return;
    }

    const { AuthOTP } = await fastify.jwt.verify(Token);
    if (AuthOTP != OTP) {
      res.code(200).send({
        status: false,
        message: "Incorrect OTP",
      });
      return;
    } else {
      res.code(200).send({
        status: true,
        message: "Network 2FA Verified",
      });
      return;
    }
  } catch (error) {
    console.log("error-/verify2fA", error);
    if (error.message == "The token is malformed.") {
      res.code(500).send({
        status: false,
        message: "Invalid Token",
        error: "error",
      });
    } else {
      res.code(500).send({
        status: false,
        message: error.message,
        error: "error",
      });
    }
  }
};

/* Get Admin Listing */
const AdminList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["UserName", "Email"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "Admin" ${query}`,
        params
      );

      const result = await pool.query(
        `
          SELECT a.*, ar."Role" FROM "Admin" a
          LEFT JOIN "AdminRoles" ar ON a."RoleId" = ar._id
          ${query}
          ORDER BY a._id DESC
          LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getAdminlist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("Error occurred in the try-catch block:", error);
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Add Admin */
const AddAdmin = async (req, res) => {
  let { Email, Password, UserName, Role, Status } = req.body;

  // Sanitize input values
  Email = sanitizeHtml(Email);
  Password = sanitizeHtml(Password);
  UserName = sanitizeHtml(UserName);
  Role = sanitizeHtml(Role);
  Status = sanitizeHtml(Status);

  Email = Email.toLowerCase().trim();

  // Define valid values for Status
  const validStatusValues = ["Active", "Inactive"];

  try {
    let AdminInfo = await pool.query(
      `SELECT * FROM "Admin" WHERE "Email" = $1`,
      [Email]
    );
    AdminInfo = AdminInfo.rows[0];

    // Check if the provided role is valid
    let RoleInfo = await pool.query(
      `SELECT * FROM "AdminRoles" WHERE _id = $1`,
      [Role]
    );
    RoleInfo = RoleInfo.rows[0];

    if (AdminInfo) {
      res.code(200).send({
        status: false,
        info: "Admin with this Email already exists",
      });
      return;
    }

    if (!validStatusValues.includes(Status)) {
      res.code(200).send({
        status: false,
        info: "Invalid input for Status",
      });
      return;
    }

    if (!RoleInfo) {
      res.code(200).send({
        status: false,
        info: "Invalid input for Role",
      });
      return;
    }

    // Validate the password length and format
    if (!Schema.validate(Password)) {
      res.code(200).send({
        status: false,
        info: "Password length should be at least 10 with a combination of letters and numbers",
      });
      return;
    }

    let EncPassword = await Encrypt(Password);

    const query = `INSERT INTO "Admin" ("Email", "Password", "UserName", "RoleId", "Status") VALUES ($1, $2, $3, $4, $5)`;
    const values = [Email, EncPassword, UserName, Role, Status];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Admin added successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in processing request",
        });
      }
    } catch (error) {
      console.log("error-DBQuery:", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/addadmin", error);
    res.status(500).send({
      status: false,
      message: "Error occurred",
      error: "error",
    });
  }
};

/* Get Admin Role Listing */
const AdminRoleList = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Role"]; // Add other fields if needed
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `SELECT Count(*) FROM "AdminRoles" ${query}`,
        params
      );

      const result = await pool.query(
        `
          SELECT * FROM "AdminRoles"
          ${query}
          ORDER BY _id DESC
          LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getadminrolelist", error);
      res.status(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("Error occurred in the try-catch block:", error);
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const AdminRoleLists = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "AdminRoles" ORDER BY _id DESC`
    );

    if (result.rowCount > 0) {
      res.code(200).send({
        status: true,
        info: result.rows,
      });
    } else {
      res.code(200).send({
        status: false,
        info: [],
        count: 0,
      });
    }
  } catch (error) {
    console.log("Error occurred in the try-catch block:", error);
    res.status(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Update Module Enable Settings */
const UpdateModuleEnableSettings = async (req, res) => {
  try {
    let { Register, Login, ProfileUpdate, KycUpdate, Admin2FA } = req.body;

    const query = `UPDATE "Settings" SET "Register" = '${Register}', "Login" = '${Login}', "ProfileUpdate" = '${ProfileUpdate}', "KycUpdate" = '${KycUpdate}', "Admin2FA" = '${Admin2FA}'  WHERE _id = 1 `;

    try {
      const result = await pool.query(query);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Module Settings Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating module settings:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/updatemodulesettings", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Multi Image Upload
const MultiImageUpload = async (req, res) => {
  try {
    const { Type } = req.body;
    const { files } = req;
    if (!files) {
      return res.code(200).send({
        status: false,
        message: "Image is required",
      });
    }
    const imageUploads = [];

    // Handle Type "LandingSection2"
    if (Type === "LandingSection2") {
      const imageKeys = ["Image1", "Image2", "Image3", "Image4"];
      if (imageKeys.every((key) => files[key])) {
        await Promise.all(
          imageKeys.map(async (key) => {
            let s3Image = "";
            try {
              let file = files[key][0];
              let formData = new FormData();

              const Dimensions = await sizeOf(file.path);

              const Width = Dimensions.width;
              const Height = Dimensions.height;

              if (Width * Height > 268402689) {
                res.code(200).send({
                  status: false,
                  message: `Image Size is too Large`,
                });
                return;
              }

              let filename =
                file.filename + "." + mime.extension(file.mimetype);
              formData.append(
                "Image",
                fs.createReadStream(file.path),
                filename
              );
              formData.append("Location", `uploads/LandingSection2`);
              let s3Store = await Axios.post(
                Config.Services.FileServiceApi,
                formData
              );
              s3Image = s3Store.data.s3Image;
            } catch (error) {
              console.error(`Error occurred during S3 upload for ${Type}:`);
            }

            imageUploads.push({
              s3Image,
            });
          })
        );

        const sanitizedImages = imageUploads.map((image, index) =>
          sanitizeObject({ [`Image${index + 1}`]: image })
        );
        return res.code(200).send({
          status: true,
          Section2Text: Type,
          Image1: sanitizedImages[0].Image1.s3Image,
          Image2: sanitizedImages[1].Image2.s3Image,
          Image3: sanitizedImages[2].Image3.s3Image,
          Image4: sanitizedImages[3].Image4.s3Image,
          message: "Image Uploaded Successfully",
        });
      } else {
        return res.code(403).send({
          status: false,
          info: "Something Went Wrong",
        });
      }
    }

    if (Type === "LogoFavicon") {
      const imageKeys = ["Logo", "Favicon"];
      if (imageKeys.every((key) => files[key])) {
        await Promise.all(
          imageKeys.map(async (key) => {
            try {
              let file = files[key][0];
              let formData = new FormData();
              filename = file.filename + "." + mime.extension(file.mimetype);
              formData.append(
                "Image",
                fs.createReadStream(file.path),
                filename
              );
              formData.append("Location", "uploads/LogoFavicon");
              let s3Store = await Axios.post(
                Config.Services.FileServiceApi,
                formData
              );
              s3Image = s3Store.data.s3Image;
            } catch (error) {
              console.error(`Error occurred during s3 upload for ${Type}:`);
            }

            imageUploads.push({
              s3Image,
            });
          })
        );

        const sanitizedImages = imageUploads.map((image, index) =>
          sanitizeObject({ [`Image${index + 1}`]: image })
        );

        return res.code(200).send({
          status: true,
          Type: Type,
          Logo: sanitizedImages[0].Image1.s3Image,
          Favicon: sanitizedImages[1].Image2.s3Image,
          message: "Image Uploaded Successfully",
        });
      } else {
        return res.code(403).send({
          status: false,
          info: "Something Went Wrong",
        });
      }
    }
  } catch (error) {
    console.log("error-/collectionthumb", error);
    return res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: error.message,
    });
  }
};

/* Get One Admin Info */
const GetOneAdmin = async (req, res) => {
  const { Id } = req.body;

  try {
    let AdminInfo = await pool.query(`SELECT * FROM "Admin" WHERE _id = ${Id}`);
    AdminInfo = AdminInfo.rows[0];

    let RoleInfo = await pool.query(
      `SELECT * FROM "AdminRoles" WHERE _id = '${AdminInfo.RoleId}'`
    );
    RoleInfo = RoleInfo.rows[0];

    let RoleData = [];

    // let RoleDataNew = json_build_object(
    //     "Role", RoleInfo.Role,
    //     "Modules", json_build_object(
    //         "SettingsModule", json_build_object(
    //             "Read", RoleInfo.SettingsModule_Read,
    //             "Write", RoleInfo.SettingsModule_Write
    //         ),
    //         "EmailTemplateModule", json_build_object(
    //             "Read", RoleInfo.EmailTemplateModule_Read,
    //             "Write", RoleInfo.EmailTemplateModule_Write
    //         ),

    //     )
    // );

    let CustomizedRoleData = {
      _id: RoleInfo._id,
      Role: RoleInfo.Role,
      Modules: {
        SettingsModule: {
          Read: RoleInfo.SettingsModule_Read,
          Write: RoleInfo.SettingsModule_Write,
        },
        EmailTemplateModule: {
          Read: RoleInfo.EmailTemplateModule_Read,
          Write: RoleInfo.EmailTemplateModule_Write,
        },
        LandingModule: {
          Read: RoleInfo.LandingModule_Read,
          Write: RoleInfo.LandingModule_Write,
        },
        CMSModule: {
          Read: RoleInfo.CMSModule_Read,
          Write: RoleInfo.CMSModule_Write,
        },
        NewsModule: {
          Read: RoleInfo.NewsModule_Read,
          Write: RoleInfo.NewsModule_Write,
        },
        NetworkModule: {
          Read: RoleInfo.NetworkModule_Read,
          Write: RoleInfo.NetworkModule_Write,
        },
        MaterialModule: {
          Read: RoleInfo.MaterialModule_Read,
          Write: RoleInfo.MaterialModule_Write,
        },
        CategoriesModule: {
          Read: RoleInfo.CategoriesModule_Read,
          Write: RoleInfo.CategoriesModule_Write,
        },
        UserRoleModule: {
          Read: RoleInfo.UserRoleModule_Read,
          Write: RoleInfo.UserRoleModule_Write,
        },
        UserModule: {
          Read: RoleInfo.UserModule_Read,
          Write: RoleInfo.UserModule_Write,
        },
        GiftModule: {
          Read: RoleInfo.GiftModule_Read,
          Write: RoleInfo.GiftModule_Write,
        },
        KeywordModule: {
          Read: RoleInfo.KeywordModule_Read,
          Write: RoleInfo.KeywordModule_Write,
        },
        MediumModule: {
          Read: RoleInfo.MediumModule_Read,
          Write: RoleInfo.MediumModule_Write,
        },
        StylesModule: {
          Read: RoleInfo.StylesModule_Read,
          Write: RoleInfo.StylesModule_Write,
        },
        BioModule: {
          Read: RoleInfo.BioModule_Read,
          Write: RoleInfo.BioModule_Write,
        },
        TestimonialModule: {
          Read: RoleInfo.TestimonialModule_Read,
          Write: RoleInfo.TestimonialModule_Write,
        },
        ExhibitionModule: {
          Read: RoleInfo.ExhibitionModule_Read,
          Write: RoleInfo.ExhibitionModule_Write,
        },
        MediaModule: {
          Read: RoleInfo.MediaModule_Read,
          Write: RoleInfo.MediaModule_Write,
        },
        OfferModule: {
          Read: RoleInfo.OfferModule_Read,
          Write: RoleInfo.OfferModule_Write,
        },
        BidModule: {
          Read: RoleInfo.BidModule_Read,
          Write: RoleInfo.BidModule_Write,
        },
        HistoryModule: {
          Read: RoleInfo.HistoryModule_Read,
          Write: RoleInfo.HistoryModule_Write,
        },
        ArtworkModule: {
          Read: RoleInfo.ArtworkModule_Read,
          Write: RoleInfo.ArtworkModule_Write,
        },
        CollectionModule: {
          Read: RoleInfo.CollectionModule_Read,
          Write: RoleInfo.CollectionModule_Write,
        },
      },
    };

    RoleData.push(CustomizedRoleData);

    if (AdminInfo) {
      res.code(200).send({
        status: true,
        info: sanitizeObject(AdminInfo),
        roleinfo: RoleData,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneadmininfo", error);
    res.code(500).send({
      status: false,
      message: "Invalid ID", //'Error occurred',
      error: "error",
    });
  }
};

/* Update Admin */
const UpdateAdmin = async (req, res) => {

  try {

    let { Email, Password, UserName, Role, Status, Id } = req.body;
    console.log("req.body", req.body)
    Email = sanitizeHtml(Email);
    Password = sanitizeHtml(Password);
    UserName = sanitizeHtml(UserName);
    Role = sanitizeHtml(Role);
    Status = sanitizeHtml(Status);
  
    Email = Email.toLowerCase().trim();
  
    const values = "Active,Inactive";
    const arr = values.split(",");

    let AdminInfo = await pool.query(
      `SELECT * FROM "Admin" WHERE _id = '${Id}'`
    );
    AdminInfo = AdminInfo.rows[0];

    let RoleInfo = await pool.query(
      `SELECT * FROM "AdminRoles" WHERE _id = '${Role}'`
    );
    RoleInfo = RoleInfo.rows[0];

    if (!AdminInfo) {
      res.code(200).send({
        status: false,
        info: "Invalid input for ID",
      });
      return;
    }

    if (!arr.includes(Status)) {
      res.code(200).send({
        status: false,
        info: "Invalid input for Status",
      });
      return;
    }

    if (!RoleInfo) {
      res.code(200).send({
        status: false,
        info: "Invalid input for Role",
      });
      return;
    }

    if (Schema.validate(Password) === false) {
      res.code(200).send({
        status: false,
        info: "Password length should be at least 10 with a combination of letters and numbers",
      });
      return;
    }

    let EncPassword = await Encrypt(Password);

    const query = `UPDATE "Admin" SET "Email" = '${Email}', "Password" = '${EncPassword}', "UserName" = '${UserName}', "RoleId" = '${Role}', "Status" = '${Status}'  WHERE _id = '${Id}' `;

    try {
      const result = await pool.query(query);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Admin details updated successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating admin:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating admin",
      });
    }
  } catch (error) {
    console.log("error-/editadmin", error);
    res.code(500).send({
      status: false,
      message: "Invalid ID", //'Error occurred',
      error: "error",
    });
  }
};

const LogoFavicon = (fastify) => async (req, res) => {
  try {
    const { Logo, Favicon } = req.body;

    let query = `UPDATE "Settings" SET`;

    const updates = [];

    if (Logo) {
      updates.push(`"Logo" = '${Logo}'`);
    }

    if (Favicon) {
      updates.push(`"Favicon" = '${Favicon}'`);
    }

    query += ` ${updates.join(",")} WHERE _id = 1`;

    try {
      // Execute the query
      await pool.query(query);

      res.code(200).send({
        status: true,
        filepathLogo: Logo,
        filepathFavicon: Favicon,
        message: "Section2 Image Uploaded Successfully",
      });
    } catch (error) {
      console.log("error-/updatesettings", error);
      res.code(500).send({
        status: false,
        message: "Error Occurred",
        error: "error",
      });
    }
  } catch (error) {
    console.log("error-/Section2Imageupdate", error);
    res.code(500).send({
      status: false,
      info: "Error Occurred",
      error: "error",
    });
  }
};

/* To Get Password Update Link if Forgot */
const ForgotPassword = (fastify) => async (req, res) => {
  try {
    let { Email } = req.body;
    console.log("Email", Email);
    Email = sanitizeHtml(Email);
    Email = Email.toLowerCase().trim();
    // Find the admin with the provided email

    let AdminInfo = await pool.query(
      `SELECT * FROM "Admin" WHERE "Email" = '${Email}'`
    );
    AdminInfo = AdminInfo.rows[0];

    // If admin not found, return error
    if (!AdminInfo) {
      res.code(200).send({
        status: false,
        response: "Email ID does not exist",
      });
      return;
    }

    // Generate reset token and set its expiry time (15 mins)
    const ResetToken = Uuidv4();
    const ResetTokenExpiresAt = Date.now() + 900 * 1000; // 15 mins

    // Update admin's reset token and expiry time in the database

    let query = `UPDATE "Admin" SET "ResetToken" = '${ResetToken}', "ResetExpiry" = to_timestamp(${ResetTokenExpiresAt} / 1000.0) WHERE "Email" = '${Email}' `;

    let result = await pool.query(query);

    let Org = req.headers["origin"];

    // Create the reset password URL
    let ResetUrl = Org + "/reset-password/" + ResetToken;

    // Send the reset password email with the reset URL
    let Reset_Email = await Axios.post(
      Config.Services.EmailService + "/ResetPasswordAdminEmail",
      {
        To: Email,
        ResetUrl: ResetUrl,
      }
    );

    if (Reset_Email.status) {
      res.code(200).send({
        status: true,
        message: "Password reset email sent",
      });
      return;
    }
  } catch (error) {
    console.log("error-/forgotpassword", error);
    res.code(500).send({
      status: false,
      message: "Error occurred",
      error: "error",
    });
  }
};

const Network2FA = (fastify) => async (req, res) => {
  try {
    let Email = req.user.Email;
    Email = Email.toLowerCase().trim();
    // Find the admin with the provided email

    let AdminInfo = await pool.query(
      `SELECT * FROM "Admin" WHERE "Email" = '${Email}'`
    );
    AdminInfo = AdminInfo.rows[0];

    let SAdminInfo = await pool.query(
      `SELECT * FROM "Admin" WHERE "RoleId" = 1`
    );
    SAdminInfo = SAdminInfo.rows[0];

    // If admin not found, return error
    if (!AdminInfo) {
      res.code(200).send({
        status: false,
        response: "Email ID does not exist",
      });
      return;
    }

    let OTP = Math.floor(100000 + Math.random() * 900000);

    // Send OTP verification email
    let OTP_Verify_Email = await Axios.post(
      Config.Services.EmailService + "/Network2FAEmail",
      {
        To: Email,
        OTP: OTP,
      }
    );

    let SOTP_Notify = await Axios.post(
      Config.Services.EmailService + "/NetworkNotifyEmail",
      {
        To: SAdminInfo.Email,
        Content: "Network Info Edit Alert from " + Email,
      }
    );

    if (OTP_Verify_Email.status) {
      // Generate token with OTP and send response
      const Token = fastify.jwt.sign({ AuthOTP: OTP }, { expiresIn: "15m" });

      res.code(200).send({
        status: true,
        response: Token,
        message:
          "Please Enter the OTP which is shared to your Email to update Network Details",
      });
      return;
    }
  } catch (error) {
    console.log("error-/forgotpassword", error);
    res.code(500).send({
      status: false,
      message: "Error occurred",
      error: "error",
    });
  }
};

/* Password Reset Api Via Forgot Password Link */
const ResetPassword = async (req, res) => {
  try {
    let { ResetToken, NewPassword } = req.body;

    ResetToken = sanitizeHtml(ResetToken);
    NewPassword = sanitizeHtml(NewPassword);

    // Find admin with the provided reset token and valid expiry

    let Admin = await pool.query(
      `SELECT * FROM "Admin" WHERE "ResetToken" = '${ResetToken}' AND "ResetExpiry" > NOW()`
    );
    Admin = Admin.rows[0];

    if (!Admin) {
      return res.code(200).send({
        status: false,
        message: "Invalid or Expired Reset Token",
      });
    }

    if (Schema.validate(NewPassword) == false) {
      res.code(200).send({
        status: false,
        message:
          "Password length should be at least 10 with a combination of letters and numbers",
      });
      return;
    }

    // Update admin's password and reset token

    let query = `UPDATE "Admin" SET "Password" = '${Encrypt(
      NewPassword
    )}', "ResetExpiry" = NOW(), "ResetToken" = ' ' WHERE "ResetToken" = '${ResetToken}' `;

    let result = await pool.query(query);

    if (result.rowCount > 0) {
      return res.code(200).send({
        status: true,
        message: "Password Reset Successful",
      });
    } else {
      return res.code(200).send({
        status: false,
        message: "Error in Reset Password",
      });
    }
  } catch (error) {
    console.log("error-/resetpassword", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Update Email Settings */
const UpdateEmailSettings = async (req, res) => {
  try {
    let {
      EmailType,
      Host,
      Port,
      User,
      Password,
      Audience,
      SendGridUser,
      SendGridApiKey,
    } = req.body;
    EmailType = sanitizeHtml(EmailType);
    Host = sanitizeHtml(Host);
    Port = sanitizeHtml(Port);
    User = sanitizeHtml(User);
    Password = sanitizeHtml(Password);
    Audience = sanitizeHtml(Audience);
    SendGridUser = sanitizeHtml(SendGridUser);
    SendGridApiKey = sanitizeHtml(SendGridApiKey);
    let dataToInsert = {};

    let query = "";
    let result = "";

    if (EmailType == "smtp") {
      query = `UPDATE "Settings" SET "EmailType" = '${EmailType}', "SmtpHost" = '${Host}', "SmtpPort" = '${Port}', "SmtpUser" = '${User}', "SmtpPassword" = '${Password}', "SmtpAudience" = '${Audience}'  WHERE _id = 1 `;
      result = await pool.query(query);
    } else if (EmailType == "sendgrid") {
      query = `UPDATE "Settings" SET "EmailType" = '${EmailType}', "SendGridUser" = '${SendGridUser}', "SendGridApiKey" = '${SendGridApiKey}' WHERE _id = 1 `;
      result = await pool.query(query);
    } else {
      res.code(200).send({
        status: false,
        info: "Invalid Email Type and Settings",
      });
      return;
    }

    if (result.rowCount > 0) {
      res.code(200).send({
        status: true,
        info: "Email Settings Updated Successfully",
      });
    } else {
      res.code(200).send({
        status: false,
        info: "Error in Processing Request",
      });
      return;
    }
  } catch (error) {
    console.log("error-/updateemailsettings", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Update Captcha Settings */
const UpdateCaptchaSettings = async (req, res) => {
  try {
    let { SiteKey, SecretKey } = req.body;

    SiteKey = sanitizeHtml(SiteKey);
    SecretKey = sanitizeHtml(SecretKey);

    const query = `UPDATE "Settings" SET "CaptchaSiteKey" = '${SiteKey}', "CaptchaSecretKey" = '${SecretKey}' WHERE _id = 1 `;

    try {
      const result = await pool.query(query);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Captcha Settings Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating Captcha Settings:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating Captcha settings",
      });
    }
  } catch (error) {
    console.log("error-/updatecaptchasettings", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Update SocialMedia Settings
const UpdateSocialMediaSettings = async (req, res) => {
  try {
    let { Facebook, Twitter, Linkedin, Pinterest, Youtube, Instagram } =
      req.body;

    const query = `UPDATE "Settings" SET "Facebook" = '${Facebook}', "Twitter" = '${Twitter}', "Linkedin" = '${Linkedin}', "Pinterest" = '${Pinterest}', "Youtube" = '${Youtube}', "Instagram" = '${Instagram}' WHERE _id = 1 `;

    try {
      const result = await pool.query(query);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Social Media Links Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating social medias:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating social medias",
      });
    }
  } catch (error) {
    console.log("error-/updatesocialmediasettings", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

// Update Social Login Details
const UpdateSocialLoginDetails = async (req, res) => {
  try {
    // Update the social login details with the provided request body
    let {
      GoogleClientId,
      GoogleSecret,
      FacebookId,
      FacebookSecret,
      AppleId,
      AppleSecret,
    } = req.body;

    const query = `UPDATE "Settings" SET "GoogleClientId" = '${GoogleClientId}', "GoogleSecret" = '${GoogleSecret}', "FacebookId" = '${FacebookId}', "FacebookSecret" = '${FacebookSecret}', "AppleId" = '${AppleId}', "AppleSecret" = '${AppleSecret}' WHERE _id = 1 `;

    try {
      const result = await pool.query(query);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Social Login Details Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating social Login Details:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating social login details",
      });
    }
  } catch (error) {
    console.log("error-/updatesociallogindetails", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

const UpdateProjectDetailsSettings = async (req, res) => {
  try {
    // Update the ProjectDetails in the SettingsModel with the provided request body
    let {
      ProjectName,
      GoogleRecaptchaStatus,
      CopyrightYear,
      ContactEmail,
      Weblink,
    } = req.body;

    const query = `UPDATE "Settings" SET "ProjectName" = '${ProjectName}', "GoogleRecaptchaStatus" = '${GoogleRecaptchaStatus}', "CopyrightYear" = '${CopyrightYear}', "ContactEmail" = '${ContactEmail}', "Weblink" = '${Weblink}' WHERE _id = 1 `;

    try {
      const result = await pool.query(query);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Project Detail Settings Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating project details:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating project details",
      });
    }
  } catch (error) {
    console.log("error-/updateprojectsettings", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get Email Templates */
const GetEmailTemplates = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pagenw = parseInt(page);
    const limitnw = parseInt(limit);
    const skipIndex = (pagenw - 1) * limitnw;

    let query = "";
    const params = [];
    if (search && search !== undefined && search !== null) {
      const regex = `%${search}%`;
      query = "WHERE ";
      const fields = ["Subject", "Category"];
      const conditions = fields.map(
        (field) => `"${field}" ILIKE $${params.push(regex)}`
      );
      query += conditions.join(" OR ");
    }

    try {
      const resultCount = await pool.query(
        `
        SELECT Count(*) FROM "EmailTemplates"
        ${query}`,
        params
      );
      const result = await pool.query(
        `
          SELECT * FROM "EmailTemplates"
          ${query}
          ORDER BY _id DESC
          LIMIT $${params.push(limitnw)} OFFSET $${params.push(skipIndex)};
        `,
        params
      );

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: result.rows,
          count: resultCount.rows[0].count,
        });
      } else {
        res.code(200).send({
          status: false,
          info: [],
          count: 0,
        });
      }
    } catch (error) {
      console.log("error-/getemailtemplates", error);
      res.status(500).send({
        status: false,
        message: "Error occurred during database query execution",
        error: "error",
      });
    }
  } catch (error) {
    console.log("Error occurred in the try-catch block:", error);
    res.status(500).send({
      status: false,
      message: "Error occurred",
      error: "error",
    });
  }
};

// Update EmailTemplates
const UpdateEmailTemplates = async (req, res) => {
  let { Subject, Html, Id } = req.body;

  Subject = sanitizeHtml(Subject);

  try {
    // Find the email template to be updated
    let EmailInfo = await pool.query(
      `SELECT * FROM "EmailTemplates" WHERE _id = '${Id}'`
    );
    EmailInfo = EmailInfo.rows[0];

    if (!EmailInfo) {
      res.code(200).send({
        status: false,
        info: "Invalid Input For Id",
      });
      return;
    }

    const query =
      'UPDATE "EmailTemplates" SET "Subject" = $1, "Html" = $2 WHERE "_id" = $3';
    const values = [Subject, Html, Id];

    try {
      const result = await pool.query(query, values);

      if (result.rowCount > 0) {
        res.code(200).send({
          status: true,
          info: "Email Templates Updated Successfully",
        });
      } else {
        res.code(403).send({
          status: false,
          info: "Error in Processing Request",
        });
        return;
      }
    } catch (error) {
      console.log("Error updating email templates:", error);
      res.code(500).send({
        status: false,
        info: "Error Occurred while updating email templates",
      });
    }
  } catch (error) {
    console.log("error-/editemailtemplates", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* Get One Email Template Info */
const GetOneEmailTemplate = async (req, res) => {
  const { Id } = req.body;

  try {
    // Find the email template with the provided ID
    let EmailInfo = await pool.query(
      `SELECT * FROM "EmailTemplates" WHERE _id = '${Id}'`
    );
    EmailInfo = EmailInfo.rows[0];

    if (EmailInfo) {
      res.code(200).send({
        status: true,
        info: EmailInfo,
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getoneemailtemplateinfo", error);
    res.code(500).send({
      status: false,
      message: "Error occurred",
      error: "error",
    });
  }
};

/* Get Settings */
const Settings = async (req, res) => {
  try {
    const SettingInfo = await pool.query(`SELECT * FROM "Settings"`);
    const setting = SettingInfo.rows[0];

    if (setting) {
      const response = {
        Register: setting.Register,
        Login: setting.Login,
        ProfileUpdate: setting.ProfileUpdate,
        KycUpdate: setting.KycUpdate,
        Admin2FA: setting.Admin2FA,
        EmailType: setting.EmailType,
        SocialLinks: {
          Facebook: setting.Facebook,
          Twitter: setting.Twitter,
          Linkedin: setting.Linkedin,
          Pinterest: setting.Pinterest,
          Youtube: setting.Youtube,
          Instagram: setting.Instagram,
        },
        ProjectDetails: {
          Logo: setting.Logo,
          Favicon: setting.Favicon,
          ProjectName: setting.ProjectName,
          GoogleRecaptchaStatus: setting.GoogleRecaptchaStatus,
          CopyrightYear: setting.CopyrightYear,
          ContactEmail: setting.ContactEmail,
          Weblink: setting.Weblink,
        },
        Captcha: {
          SiteKey: setting.CaptchaSiteKey,
          SecretKey: setting.CaptchaSecretKey,
        },
        SendGrid: {
          User: setting.SendGridUser,
          ApiKey: setting.SendGridApiKey,
        },
        Smtp: {
          Host: setting.SmtpHost,
          Port: setting.SmtpPort,
          User: setting.SmtpUser,
          Password: setting.SmtpPassword,
          Audience: setting.SmtpAudience,
        },
      };

      res.code(200).send({
        status: true,
        info: sanitizeObject(response),
      });
    } else {
      res.code(403).send({
        status: false,
        info: "",
      });
    }
  } catch (error) {
    console.log("error-/getsettings", error);
    res.code(500).send({
      status: false,
      message: "Error Occurred",
      error: "error",
    });
  }
};

/* End Updated SQl Functions */

module.exports = {
  Dashboard,
  Authentication,
  Verify2FA,
  ForgotPassword,
  Settings,
  UsersList,
  AdminList,
  UserInfo,
  UpdateAccountStatus,
  UpdateKYCStatus,
  AdminRoleList,
  CategoriesList,
  MediumList,
  MaterialList,
  ArtistCategoryList,
  StylesList,
  CollectionList,
  HistoryList,
  BidList,
  OfferList,
  NetworkList,
  AddAdmin,
  UpdateAdmin,
  UpdateEmailTemplates,
  GetEmailTemplates,
  GetOneEmailTemplate,
  GetOneAdmin,
  GetOneAdminRole,
  GetOneCategories,
  GetOneMedium,
  GetOneMaterial,
  GetOneStyles,
  GetOneCollection,
  // GetOneItem,
  GetOneNetwork,
  UpdateProjectDetailsSettings,
  UpdateModuleEnableSettings,
  UpdateSocialMediaSettings,
  UpdateCaptchaSettings,
  UpdateEmailSettings,
  GetUserRoles,
  GetOneUserRole,
  AddAdminRole,
  AddCategories,
  AddMedium,
  AddMaterial,
  AddStyles,
  EditAdminRole,
  EditCategories,
  EditMaterial,
  EditMedium,
  EditStyles,
  EditNetwork,
  EditUserRoleAgreement,
  GetActivities,
  LogoFavFilesUpload,
  ResetPassword,
  LandingSection1,
  LandingSection2,
  LandingSection3,
  Section1ImageUpdate,
  Section2ImageUpdate,
  CMSList,
  Section3ImageUpdate,
  GetVisitors,
  AddKeyword,
  EditKeyword,
  GetOneKeyword,
  KeywordList,
  AddNews,
  EditNews,
  GetOneNews,
  NewsList,
  AddNewsAuthor,
  EditNewsAuthor,
  GetOneNewsAuthor,
  NewsAuthorList,
  GetOneArtwork,
  ExhibitionList,
  ArtworkList,
  BioList,
  TestimonialList,
  GetOneBio,
  GetOneExhibition,
  GetOneTestimonial,
  MediasList,
  GetOneMedias,
  GetProfileViewsByMonth,
  GetItemViewsByMonth,
  AddArtistCategory,
  GetProfileViewsByCountry,
  GetItemViewsByCountry,
  SingleImageUpload,
  MultiImageUpload,
  EditArtistCategory,
  GetOneArtistCategory,
  ArtistStyleList,
  AddArtistStyle,
  EditArtistStyle,
  GetOneArtistStyle,
  ArtistMediumList,
  AddArtistMedium,
  EditArtistMedium,
  GetOneArtistMedium,
  LogoFavicon,
  UpdateSocialLoginDetails,
  ArtistCategoryImageUpdate,
  GetLandingPageDetails,
  NotificationList,
  GiftNftThumbImageUpdate,
  GiftNftMediaImageUpdate,
  AddGiftNFT,
  EditGiftNFT,
  GetOneGiftNFT,
  GiftNFTList,
  MintGiftNft,
  MintArtwork,
  GiftHistoryList,
  SellRequest,
  MediaLimitList,
  GetOneMediaLimit,
  EditMediaLimit,
  SingleImageUploadss,
  ArtProductCategoryList,
  ArtProductFabricList,
  ArtProductBrandList,
  ArtProductMaterialList,
  ArtProductNameList,
  ArtProductShapeList,
  ArtProductSizeList,
  ArtProductStyleList,
  ArtProductTechniqueList,
  ArtProductTypeList,
  AddArtProductBrand,
  AddArtProductCategory,
  AddArtProductFabric,
  AddArtProductMaterial,
  AddArtProductName,
  AddArtProductSize,
  AddArtProductStyle,
  AddArtProductShape,
  AddArtProductType,
  AddArtProductTechnique,
  EditArtProductBrand,
  EditArtProductCategory,
  EditArtProductFabric,
  EditArtProductMaterial,
  EditArtProductName,
  EditArtProductShape,
  EditArtProductStyle,
  EditArtProductSize,
  EditArtProductType,
  EditArtProductTechnique,
  GetOneArtProductBrand,
  GetOneArtProductCategory,
  GetOneArtProductFabric,
  GetOneArtProductMaterial,
  GetOneArtProductName,
  GetOneArtProductShape,
  GetOneArtProductSize,
  GetOneArtProductStyle,
  GetOneArtProductType,
  GetOneArtProductTechnique,
  GetOneCMS,
  EditCMS,
  EditBioStatus,
  EditTestimonialStatus,
  EditMediaStatus,
  EditExhibtionStatus,
  GetArtEdition,
  UpdateArtworkStatus,
  Banner,
  SingleVideoUpload,
  GetBannerDetails,
  BannerImageUpdate,
  ArtistLabelList,
  AddArtistLabel,
  EditArtistLabel,
  GetOneArtistLabel,
  ArtproductList,
  UpdateFeaturedStatus,
  InnerBanner,
  GetInnerBannerDetails,
  EventsList,
  FeaturesList,
  FoundersList,
  GetOneFeatures,
  GetOneEvents,
  AddEvents,
  AddFeatures,
  EditFeatures,
  EditEvents,
  AddTeam,
  GetOneTeam,
  EditTeams,
  GetAboutusPageDetails,
  AboutusSection,
  BulkUpdateArtworkStatus,
  GetUsersList,
  AdminRoleLists,
  AdminWithdraw,
  AdminBalanceList,
  WithdrawHistoryList,
  CsvSamplesList,
  CsvUpdate,
  CsvsampleUpdate,
  CountryList,
  UpdateCountryStatus,
  GetItemDetail,
  GetArtProductItemDetail,
  GetSalesDetail,
  GetUserDetail,
  Network2FA,
  VerifyNetwork2FA,
};
