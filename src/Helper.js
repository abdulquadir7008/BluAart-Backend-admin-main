const Crypto = require('crypto')
const RequestIp = require("request-ip");
const Multer = require("fastify-multer")
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
var Web3 = require('web3');
const Config = require('./Config');
const Axios = require('axios')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const sharp = require('sharp');
const FormData = require('form-data');
const { Pool } = require('pg');
const pool = new Pool(Config.sqldb);

var Algorithm = "aes-192-cbc";
var Password = "Exchange MEAN";
const Key = Crypto.scryptSync(Password, 'salt', 24);
const Iv = Buffer.alloc(16, 0);

var PasswordValidator = require("password-validator");
var PasswordSchema = new PasswordValidator();

const s3 = new S3Client({
  signatureVersion: 'v4',
  region: Config.S3.Region,  // Replace with your actual region
  credentials: {
    accessKeyId: Config.S3.AccessKey,
    secretAccessKey: Config.S3.SecretKey
  }
});

PasswordSchema
  .is()
  .min(8)
  .has()
  .letters()
  .has()
  .digits()


const FileFilter = function (req, file, cb) {
  // Check file extension
  const allowedExtensions = ['.jpg', 'jpeg', '.png', ".mp4", ".csv"];
  const fileExtension = file.originalname.slice(-4);
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error('Invalid file extension'));
  }

  // Check file size
  const allowedSize = 1024 * 1024 * 1; // 1MB
  cb(null, true);
};

const storage = Multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop(); // get file extension
    cb(null, file.fieldname + '-' + Date.now())
  }
});

exports.s3Upload = async (Type, file) => {

  try {
    let filename = file.filename + "." + mime.extension(file.mimetype);
    const BUCKET = Config.S3.BUCKET;

    const uploadParams = {
      Bucket: BUCKET,
      Key: `uploads/${Type}/${filename}`,
      Body: fs.createReadStream(file.path), // Use file.buffer to read the file content
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

  
    const uploadCommand = new PutObjectCommand(uploadParams);
    const uploadResponse = await s3.send(uploadCommand);

    if(uploadResponse){
       const imageUrl = `https://${BUCKET}.s3.ap-southeast-1.amazonaws.com/uploads/${Type}/${filename}`;
       return imageUrl;
    }

  } catch (err) {
    console.log(err);
  }
  
};

exports.GiftMetaJson = async (Data) => {
  try {
    let FileName = Data.TokenId;
    let MetaName = FileName + '.json';
    const BUCKET = Config.S3.BUCKET;

    let MetaData = {
      "name": Data.Name,
      "image": Data.Media
    };

    let JsonData = JSON.stringify(MetaData);

    let Key = `uploads/MetaData/GiftNft/${Data.Folder}/${MetaName}`;

    const params = {
      Bucket: BUCKET,
      Key: Key,
      Body: JsonData,
      ContentType: 'application/json' 
    };

    const uploadResponse = await s3.putObject(params).promise();

    if (uploadResponse) {
        const imageUrl = `https://${BUCKET}.s3.ap-southeast-1.amazonaws.com/${Key}`;
      return imageUrl;
    }
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error for handling in your application
  }
};

exports.s3CompressedUpload = async (Type, file) => {

  try {
    let filename = `${file.filename.split('.')[0]}-compressed.${mime.extension(file.mimetype)}`;

    const BUCKET = Config.S3.Bucket;

    const compressionOptions = {
      quality: 70, // Adjust the quality as needed (0-100)
      progressive: true, // Use progressive encoding
    };

    const compressedImageBuffer = await sharp(file.path)
    .png(compressionOptions).toBuffer();

    const uploadParams = {
      Bucket: BUCKET,
      Key: `uploads/${Type}/${filename}`,
      Body: compressedImageBuffer, // Use file.buffer to read the file content
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

 
    const uploadCommand = new PutObjectCommand(uploadParams);
    const uploadResponse = await s3.send(uploadCommand);

    if(uploadResponse){
      const imageUrl = `https://${BUCKET}.s3.ap-southeast-1.amazonaws.com/uploads/${Type}/${filename}`;
      return imageUrl;
   }


 

  } catch (err) {
    console.log(err);
  }
 
};

exports.Encrypt = (value) => {
  const Cipher = Crypto.createCipheriv(Algorithm, Key, Iv);
  var Encrypted = Cipher.update(value, 'utf8', 'hex') + Cipher.final('hex');
  return Encrypted;
};

exports.Decrypt = (value) => {
  const Decipher = Crypto.createDecipheriv(Algorithm, Key, Iv);
  var Decrypted = Decipher.update(value, 'hex', 'utf8') + Decipher.final('utf8');
  return Decrypted
};


exports.Schema = PasswordSchema
exports.storage = storage
exports.FileFilter = FileFilter;

exports.LocalUpload = async function (File, Location, Mode) {

  if (Mode == "N") {
    let Locationnew = '/root/projects/blueart-user-api/UserManagement/src/' + Location
    const extension = mime.extension(File.mimetype);
    let LocalPic = Locationnew + `/${File.filename + '.' + extension}`;
    fs.renameSync(File.path, LocalPic);
    LocalPic = Config.Services.FileService + LocalPic

    LocalPic = LocalPic.replace("/uploads", "");
    LocalPic = LocalPic.replace("/root/projects/blueart-user-api/UserManagement/src/", "");
    return LocalPic;

  } else if (Mode == "C") {
    const response = await Axios.get(File, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');

    const compressedImageData = await sharp(imageData).jpeg({ quality: 50 }).toBuffer();
    let Locationnew = '/root/projects/blueart-user-api/UserManagement/src/' + Location
    const timestamp = Date.now();
    const compressedImageFilename = `${timestamp}.jpeg`;
    const compressedImagePath = `${Locationnew}/${compressedImageFilename}`;
    fs.writeFileSync(compressedImagePath, compressedImageData);

    let LocalPic = Config.Services.FileService + compressedImagePath
    LocalPic = LocalPic.replace("/uploads", "");
    LocalPic = LocalPic.replace("/root/projects/blueart-user-api/UserManagement/src/", "");
    return LocalPic;

  }


}


const uploadFileToIPFS = async (file) => {

  const formData = new FormData();
  formData.append('file', fs.createReadStream(file));

  const headers = {
    Authorization: `Bearer ${Config.Pinata.Jwt}`,
    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
    pinata_api_key: Config.Pinata.Key,
    pinata_secret_api_key: Config.Pinata.Secret,
  };

  const response = await Axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    headers: headers,
  });

  return response.data.IpfsHash;
};

exports.IPFSUpload = async function (File) {

  const IpfsUrl = await uploadFileToIPFS(File.path);

  return IpfsUrl;
}

exports.ActivityUpdate = async (req, user, action, status, reason) => {

  let Ip = RequestIp.getClientIp(req);
  if (String(Ip).slice(0, 7) == "::ffff:") {
    Ip = String(Ip).slice(7);
  }

  let Device = req.headers["user-agent"];

  const query = `INSERT INTO "Activities" ("Email", "Action", "Status", "Reason", "Ip", "Device") VALUES ('${user}', '${action}', '${status}', '${reason}', '${Ip}', '${Device}');`;

  await pool.query(query);
  return;

};

exports.GetOneArtworkInfo = async (Id) => {

  const query = `SELECT
        ai.*,
        array_agg(DISTINCT am."Title") AS "Material",
        array_agg(DISTINCT ac."Title") AS "Category",
        array_agg(DISTINCT pc."Title") AS "ProductCategory",
        array_agg(DISTINCT pn."Title") AS "ProductName",
        array_agg(DISTINCT ps."Title") AS "ProductStyle",
        array_agg(DISTINCT pss."Title") AS "ProductSize",
        array_agg(DISTINCT pb."Title") AS "ProductBrand",
        array_agg(DISTINCT pf."Title") AS "ProductFabric",
        array_agg(DISTINCT pt."Title") AS "ProductType",
        array_agg(DISTINCT ptt."Title") AS "ProductTechnique",
        array_agg(DISTINCT pm."Title") AS "ProductMaterial",
        array_agg(DISTINCT ak."Title") AS "Keywords",
        array_agg(DISTINCT sub."Title") AS "Subject",
        array_agg(DISTINCT sty."Title") AS "Style"
    FROM
        "ArtItems" ai
    LEFT JOIN
        "Materials" am ON am._id = ANY(ai."Material")
    LEFT JOIN
        "KeyWords" ak ON ak._id = ANY(ai."Keywords")
    LEFT JOIN
        "Medium" sub ON sub._id = ANY(ai."Subject")
    LEFT JOIN
        "Style" sty ON sty._id = ANY(ai."Style")
    LEFT JOIN
        "Categories" ac ON ac._id = ai."Category"
    LEFT JOIN
        "ArtProductCategory" pc ON pc._id = ai."ProductCategory"
    LEFT JOIN
        "ArtProductName" pn ON pn._id = ai."ProductName"
    LEFT JOIN
        "ArtProductMaterial" pm ON pm._id = ai."ProductMaterial"
    LEFT JOIN
        "ArtProductStyle" ps ON ps._id = ai."ProductStyle"
    LEFT JOIN
        "ArtProductSize" pss ON pss._id = ai."ProductSize"
    LEFT JOIN
        "ArtProductBrand" pb ON pb._id = ai."ProductBrand"
    LEFT JOIN
        "ArtProductFabric" pf ON pf._id = ai."ProductFabric"
    LEFT JOIN
        "ArtProductType" pt ON pt._id = ai."ProductType"
    LEFT JOIN
        "ArtProductTechnique" ptt ON ptt._id = ai."ProductTechnique"
    WHERE
        ai._id = $1
    GROUP BY
        ai._id;
`;

  try {
    const result = await pool.query(query, [Id]);

    const artworkInfo = result.rows;
    artworkInfo[0].Category = artworkInfo[0].Category.join(', ');
    artworkInfo[0].Material = artworkInfo[0].Material.join(', ');
    artworkInfo[0].Subject = artworkInfo[0].Subject.join(', ');
    artworkInfo[0].Keywords = artworkInfo[0].Keywords.join(', ');
    artworkInfo[0].Style = artworkInfo[0].Style.join(', ');
    artworkInfo[0].ProductCategory = artworkInfo[0].ProductCategory.join(', ');
    artworkInfo[0].ProductName = artworkInfo[0].ProductName.join(', ');
    artworkInfo[0].ProductSize = artworkInfo[0].ProductSize.join(', ');
    artworkInfo[0].ProductStyle = artworkInfo[0].ProductStyle.join(', ');
    artworkInfo[0].ProductBrand = artworkInfo[0].ProductBrand.join(', ');
    artworkInfo[0].ProductFabric = artworkInfo[0].ProductFabric.join(', ');
    artworkInfo[0].ProductMaterial = artworkInfo[0].ProductMaterial.join(', ');
    artworkInfo[0].ProductType = artworkInfo[0].ProductType.join(', ');
    artworkInfo[0].ProductTechnique = artworkInfo[0].ProductTechnique.join(', ');

    return artworkInfo;

  } catch (error) {
    console.error('Error occurred:', error);
  }


};

exports.TransferNft = async (AuthorId, ItemId, Price, Edition) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("TransferNft", Price)
      let Info = await pool.query(`SELECT * FROM "ArtItems" WHERE "_id" = '${ItemId}'`);
      Info = Info.rows[0];

      if (!Info) {

        var ResData = {
          status: false,
          message: "Item Not Found",
          data: ""
        }
        resolve(ResData);
        return;

      }
      let EInfo = await pool.query(`SELECT * FROM "Editions" WHERE "Edition" = '${Edition}' AND "ItemId" = '${ItemId}'`);
      EInfo = EInfo.rows[0];


      if (!EInfo) {

        var ResData = {
          status: false,
          message: "Item Not Found",
          data: ""
        }
        resolve(ResData);
        return;

      }


      let SenderInfo = await pool.query(`SELECT * FROM "Users" WHERE "_id" = '${AuthorId}'`);
      SenderInfo = SenderInfo.rows[0];

      let ReceiverInfo = await pool.query(`SELECT * FROM "Users" WHERE "_id" = '${EInfo.CurrentOwner}'`);
      ReceiverInfo = ReceiverInfo.rows[0];

      let SenderAddress = SenderInfo.WalletAddress;
      let ReceiverAddress = ReceiverInfo.WalletAddress;

      let Commission = await TransferAdminComission(Info, EInfo);

      let BalanceTransfer = "";

      if (Commission) {

        BalanceTransfer = await TransferBalance(SenderInfo, ReceiverInfo, Info, EInfo);
      }

      if (BalanceTransfer) {

        let CollectionInfo = await pool.query(`SELECT * FROM "Collections" WHERE "_id" = '${Info.CollectionId}'`);
        CollectionInfo = CollectionInfo.rows[0];

        let ChainInfo = await pool.query(`SELECT * FROM "Networks" WHERE "Currency" = '${CollectionInfo.Currency}'`);
        ChainInfo = ChainInfo.rows[0];

        const web3 = new Web3(new Web3.providers.HttpProvider(ChainInfo.RpcUrl))

        let Instance = new web3.eth.Contract(JSON.parse(Config.collectionABIArray), CollectionInfo.ContractAddress);

        let Wallet = web3.eth.accounts.wallet
        Wallet.clear()
        Wallet = Wallet.create(0)

        if (CollectionInfo.AdminKey !== "false" && CollectionInfo.AdminKey) {
          let AdminPrivateKey = await this.Decrypt(CollectionInfo.AdminKey);
          Wallet.add(AdminPrivateKey);
        } else {
          let AdminKey = ChainInfo.Key_1+ChainInfo.Key_2;
          let AdminPrivateKey = await this.Decrypt(AdminKey);
          Wallet.add(AdminPrivateKey);
        }

        web3.eth.getBalance(Wallet[0].address).then(balance => {
        });

        let ownerInfo = await Instance.methods.owner().call();

        try {
          let EstimateGas = await Instance.methods.transferSingleQuantity(ReceiverAddress, SenderAddress, Info.TokenId, Edition, "0x00").estimateGas({ from: Wallet[0].address }, function (err, estimateGas) {
            console.log("errorr", err)
            if (err) {
              let ResData = {
                status: false,
                message: "Please try after sometimes",
                data: ""
              }
              resolve(ResData);
              return;
            }
          });

          let HigherGas = (EstimateGas * 1.1).toFixed(0)

          await Instance.methods.transferSingleQuantity(ReceiverAddress, SenderAddress, Info.TokenId, Edition, "0x00").send({ from: Wallet[0].address, gas: HigherGas })
            .on("transactionHash", async (hash) => {
              let TransactionHash = ""
              const query4 = `UPDATE "Editions" SET "CurrentOwner" = $1, "Price" = $2, "MarketPlaceStatus" = false, "EnableAuction" = false,
        "EnableAuctionStatus" = false, "EnableBid" = false,        "EnableBidStatus" = false, "HasBid" = false, "HasOffer" = false WHERE "_id" = $3`;

              const values4 = [
                AuthorId,
                Price ? Price : EInfo.Price,
                EInfo._id
              ];

              await pool.query(query4, values4);


              await Axios.post(Config.Services.EmailService + "/AcceptBidEmail", {
                Type: "Bid",
                To: SenderInfo.Email,
                ItemName: Info.Title,
                Price: Price
              });

              const queryFetchBids = `SELECT * FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2`;

              const valuesFetchBids = [Info._id, Edition];

              const bidsToDelete = await pool.query(queryFetchBids, valuesFetchBids);


              if (bidsToDelete.rows.length === 0) {
                console.log('No bid to delete.');
              } else {
                // Insert bids into BidDeleteModel

                for (let index = 0; index < bidsToDelete.rows.length; index++) {
                  const element = bidsToDelete.rows[index];
                  const queryInsertBids = `INSERT INTO "BidsDelete"
                    ("ItemId", "Edition", "Price", "Sender", "Receiver", "Status", "TransferStatus", "TxHash") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `;
                  let valuesInsertBids = [
                    element.ItemId,
                    element.Edition,
                    element.Price,
                    element.Sender,
                    element.Receiver,
                    element.Status,
                    element.TransferStatus,
                    element.TxHash
                  ]

                  await pool.query(queryInsertBids, valuesInsertBids);

                }
                const queryDeleteBids = `DELETE FROM "Bids"
                    WHERE "ItemId" = $1 AND "Edition" = $2`;

                await pool.query(queryDeleteBids, valuesFetchBids);
              }

              const query1 = `DELETE FROM "Cart" WHERE "ItemId" = $1
                  AND "Edition" = $2 AND "UserId" = $3;`;

              const values1 = [Info._id, Edition, AuthorId];

              await pool.query(query1, values1);

              console.log("Price", Price)
              const query3 = `INSERT INTO "Histories" ("ItemId", "CollectionId", "FromId", "ToId", "TransactionHash", "Price", "HistoryType", "Edition" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
              const values3 = [Info._id, Info.CollectionId, ReceiverInfo._id, SenderInfo._id, TransactionHash, Price, "Transfer", Edition];
              await pool.query(query3, values3);

              const query = `INSERT INTO "Prices" ("ItemId", "UserId", "Price", "Edition") VALUES ($1, $2, $3, $4)`;
              const values = [Info._id, SenderInfo._id, EInfo.Price, Edition];
              await pool.query(query, values);

              const query2 = `INSERT INTO "Notifications" ("Type", "ItemId", "Price", "UserId", "Edition") VALUES ('Item Transfered', $1, $2, $3, $4)`;
              const values2 = [Info._id, Price ? Price : EInfo.Price, SenderInfo._id, Edition];
              await pool.query(query2, values2);

              let ResData = {
                status: true,
                message: "Item Transferred Successfully",
                data: ""
              }


              resolve(ResData);
              return;



            }).on("error", async (er) => {
              let TransactionHash = ""
              let ErrData = "";
              const query4 = `UPDATE "Editions" SET "CurrentOwner" = $1, "Price" = $2, "MarketPlaceStatus" = false, "EnableAuction" = false,
        "EnableAuctionStatus" = false, "EnableBid" = false,        "EnableBidStatus" = false, "HasBid" = false, "HasOffer" = false WHERE "_id" = $3`;

              const values4 = [
                AuthorId,
                Price ? Price : EInfo.Price,
                EInfo._id
              ];

              await pool.query(query4, values4);

              await Axios.post(Config.Services.EmailService + "/AcceptBidEmail", {
                Type: "Bid",
                To: SenderInfo.Email,
                ItemName: Info.Title,
                Price: Price
              });
              const queryFetchOffers = `SELECT * FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2`;

              const valuesFetchOffers = [Info._id, Edition];

              const OfferToDelete = await pool.query(queryFetchOffers, valuesFetchOffers);

              if (OfferToDelete.rows.length === 0) {
                console.log('No offers to delete.');
              } else {
                // Insert bids into BidDeleteModel
                const queryInsertOffers = `INSERT INTO "OffersDelete"
                    ("ItemId", "Edition", "Price", "Sender", "Receiver", "Status") VALUES ($1, $2, $3, $4, $5, $6)
                `;

                const valuesInsertOffers = OfferToDelete.rows.map(offer => [
                  offer.ItemId,
                  offer.Edition,
                  offer.Price,
                  offer.Sender,
                  offer.Receiver,
                  offer.Status
                ]);

                await pool.query(queryInsertOffers, valuesInsertOffers);

                const queryDeleteOffers = `DELETE FROM "Bids"      WHERE "ItemId" = $1 AND "Edition" = $2`;

                await pool.query(queryDeleteOffers, valuesFetchOffers);
              }

              const queryFetchBids = `SELECT * FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2`;

              const valuesFetchBids = [Info._id, Edition];

              const bidsToDelete = await pool.query(queryFetchBids, valuesFetchBids);


              if (bidsToDelete.rows.length === 0) {
                console.log('No bid to delete.');
              } else {
                // Insert bids into BidDeleteModel
                const queryInsertBids = `INSERT INTO "BidsDelete"
                    ("ItemId", "Edition", "Price", "Sender", "Receiver", "Status", "TransferStatus", "TxHash") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `;

                const valuesInsertBids = bidsToDelete.rows.map(bid => [
                  bid.ItemId,
                  bid.Edition,
                  bid.Price,
                  bid.Sender,
                  bid.Receiver,
                  bid.Status,
                  bid.TransferStatus,
                  bid.TxHash
                ]);

                await pool.query(queryInsertBids, valuesInsertBids);

                const queryDeleteBids = `DELETE FROM "Bids"
                    WHERE "ItemId" = $1 AND "Edition" = $2`;

                await pool.query(queryDeleteBids, valuesFetchBids);
              }




              const query1 = `DELETE FROM "Cart" WHERE "ItemId" = $1
              AND "Edition" = $2 AND "UserId" = $3;`;

              const values1 = [Info._id, Edition, AuthorId];

              await pool.query(query1, values1);


              const query3 = `INSERT INTO "Histories" ("ItemId", "CollectionId", "FromId", "ToId", "TransactionHash", "Price", "HistoryType", "Edition" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
              const values3 = [Info._id, Info.CollectionId, ReceiverInfo._id, SenderInfo._id, TransactionHash, Info.Price, "Transfer", Edition];
              await pool.query(query3, values3);





              const query = `INSERT INTO "Prices" ("ItemId", "UserId", "Price", "Edition") VALUES ($1, $2, $3, $4)`;
              const values = [Info._id, SenderInfo._id, EInfo.Price, Edition];
              await pool.query(query, values);


              const query2 = `INSERT INTO "Notifications" ("Type", "ItemId", "Price", "UserId", "Edition") VALUES ('Item Transfered', $1, $2, $3, $4)`;
              const values2 = [Info._id, Price ? Price : EInfo.Price, SenderInfo._id, Edition];
              await pool.query(query2, values2);

              let ResData = {
                status: false,
                message: "NFT item transferred failed in network"
              }
              resolve(ResData);
              return;

            });
        } catch (e) {
          console.log(e)
          let TransactionHash = " "
          const query4 = `UPDATE "Editions" SET "CurrentOwner" = $1, "Price" = $2, "MarketPlaceStatus" = false, "EnableAuction" = false,
          "EnableAuctionStatus" = false, "EnableBid" = false,       "EnableBidStatus" = false, "HasBid" = false, "HasOffer" = false WHERE "_id" = $3`;

          const values4 = [
            AuthorId,
            Price ? Price : EInfo.Price,
            EInfo._id
          ];

          await pool.query(query4, values4);

          await Axios.post(Config.Services.EmailService + "/AcceptBidEmail", {
            Type: "Bid",
            To: SenderInfo.Email,
            ItemName: Info.Title,
            Price: Price
          });

          const queryFetchOffers = `SELECT * FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2`;

          const valuesFetchOffers = [Info._id, Edition];

          const OfferToDelete = await pool.query(queryFetchOffers, valuesFetchOffers);

          if (OfferToDelete.rows.length === 0) {
            console.log('No offers to delete.');
          } else {
            // Insert bids into BidDeleteModel
            const queryInsertOffers = `INSERT INTO "OffersDelete"
                ("ItemId", "Edition", "Price", "Sender", "Receiver", "Status") VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const valuesInsertOffers = OfferToDelete.rows.map(offer => [
              offer.ItemId,
              offer.Edition,
              offer.Price,
              offer.Sender,
              offer.Receiver,
              offer.Status
            ]);

            await pool.query(queryInsertOffers, valuesInsertOffers);

            const queryDeleteOffers = `DELETE FROM "Bids"      WHERE "ItemId" = $1 AND "Edition" = $2`;

            await pool.query(queryDeleteOffers, valuesFetchOffers);
          }

          const queryFetchBids = `SELECT * FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2`;

          const valuesFetchBids = [Info._id, Edition];

          const bidsToDelete = await pool.query(queryFetchBids, valuesFetchBids);


          if (bidsToDelete.rows.length === 0) {
            console.log('No bid to delete.');
          } else {
            // Insert bids into BidDeleteModel
            const queryInsertBids = `INSERT INTO "BidsDelete"
                ("ItemId", "Edition", "Price", "Sender", "Receiver", "Status", "TransferStatus", "TxHash") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;

            const valuesInsertBids = bidsToDelete.rows.map(bid => [
              bid.ItemId,
              bid.Edition,
              bid.Price,
              bid.Sender,
              bid.Receiver,
              bid.Status,
              bid.TransferStatus,
              bid.TxHash
            ]);

            await pool.query(queryInsertBids, valuesInsertBids);

            const queryDeleteBids = `DELETE FROM "Bids"
                WHERE "ItemId" = $1 AND "Edition" = $2`;

            await pool.query(queryDeleteBids, valuesFetchBids);
          }


          const query1 = `DELETE FROM "Cart" WHERE "ItemId" = $1
          AND "Edition" = $2 AND "UserId" = $3;`;

          const values1 = [Info._id, Edition, AuthorId];

          await pool.query(query1, values1);

          const query3 = `INSERT INTO "Histories" ("ItemId", "CollectionId", "FromId", "ToId", "TransactionHash", "Price", "HistoryType", "Edition" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
          const values3 = [Info._id, Info.CollectionId, ReceiverInfo._id, SenderInfo._id, TransactionHash, Info.Price, "Transfer", Edition];
          await pool.query(query3, values3);


          const query = `INSERT INTO "Prices" ("ItemId", "UserId", "Price", "Edition") VALUES ($1, $2, $3, $4)`;
          const values = [Info._id, SenderInfo._id, EInfo.Price, Edition];
          await pool.query(query, values);


          const query2 = `INSERT INTO "Notifications" ("Type", "ItemId", "Price", "UserId", "Edition") VALUES ('Item Transfered', $1, $2, $3, $4)`;
          const values2 = [Info._id, Price ? Price : EInfo.Price, SenderInfo._id, Edition];
          await pool.query(query2, values2);
        }
      }


    } catch (e) {
      console.log("transferexcep", e);
    }
  })


}

exports.sanitizeObject = (obj) => {
  const sanitizedObj = {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'string') {
        sanitizedObj[key] = sanitizeHtml(obj[key]);
      } else {
        sanitizedObj[key] = obj[key];
      }
    }
  }
  return sanitizedObj;
};

exports.sanitizeArray = (arr) => {
  const sanitizedArr = arr.map((item) => {
    return this.sanitizeObject(item);
  });
  return sanitizedArr;
};

async function TransferAdminComission(ItemInfo, EditionInfo) {

  let SettingInfo = await pool.query(`SELECT * FROM "Networks" WHERE "Currency" = '${ItemInfo.Currency}'`);
  SettingInfo = SettingInfo.rows[0];
  let AdminInfo = await pool.query(`SELECT * FROM "Admin" WHERE _id = 1 AND "Status" = 'Active'`);
  AdminInfo = AdminInfo.rows[0];

  let Commission = EditionInfo.Price * (SettingInfo.AdminCommission / 100);


  const query3 = `INSERT INTO "Histories" ("ItemId", "CollectionId", "FromId", "ToId", "TransactionHash", "Price", "HistoryType", "Edition" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values3 = [ItemInfo._id, ItemInfo.CollectionId, EditionInfo.CurrentOwner, AdminInfo._id, "", SettingInfo.AdminCommission, "AdminCommission", EditionInfo.Edition];
  await pool.query(query3, values3);

  return Commission;


}

async function TransferBalance(SenderInfo, ReceiverInfo, ItemInfo, EditionInfo) {

  let CollectionInfo = await pool.query(`SELECT * FROM "Collections" WHERE _id = '${ItemInfo.CollectionId}'`);
  CollectionInfo = CollectionInfo.rows[0];

  if (CollectionInfo.Royalties) {

    var Royalty = EditionInfo.Price * (CollectionInfo.Royalties / 100);


    const query3 = `INSERT INTO "Histories" ("ItemId", "CollectionId", "FromId", "ToId", "TransactionHash", "Price", "HistoryType", "Edition" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values3 = [ItemInfo._id, ItemInfo.CollectionId, SenderInfo._id, ItemInfo.AuthorId, "", Royalty, "Royalty", EditionInfo.Edition];
    await pool.query(query3, values3);

    return true;
  }

  return true;

}