const fastify = require('fastify')({
  logger: true,
});
const io = require('socket.io')(fastify.server);
const Swagger = require('./SwaggerOptions');
const path = require('path');
const config = require('./Config');
const fastifyjwt = require('fastify-jwt');
const session = require('fastify-session');
const cookie = require('fastify-cookie');
const AdminRoutes = require('./routes/AdminRoutes');

const cron = require("node-cron");
require('array-foreach-async')
const Web3 = require("web3");
const { Decrypt, TransferNft } = require("./Helper");


fastify.register(require('fastify-swagger'), Swagger.options);
fastify.register(require('fastify-cors'), { origin: '*' });
fastify.register(require('fastify-multer').contentParser);

fastify.register(fastifyjwt, { secret: config.jwt_secret });
fastify.register(cookie);
fastify.register(session, {
  secret: 'super-secret-key-super-secret-key',
  cookie: { secure: true },
  saveUninitialized: false,
  resave: false,
});

fastify.decorate('authenticate', async (request, reply) => {
  await request.jwtVerify();
});

const { Pool } = require('pg');
const pool = new Pool(config.sqldb);

fastify.decorate('serverauthenticate', async (request, reply) => {

  const Tkn = request.headers.authorization || request.cookies.token;
  let Usr = await pool.query(`SELECT * FROM "Admin" WHERE "Email" = '${request.user.Email}'`);
  Usr = Usr.rows[0];

  if (!Usr || !Tkn) {
    reply.code(401).send({
      status: false,
      response: 'Invalid Token',
    });
  }

  if (Usr.Status === 'Inactive') {
    reply.code(403).send({
      status: false,
      response: 'Account Deactivated',
    });
  }
});

fastify.decorate('domainauthenticate', async (request, reply) => {
  const allowedOrigins = ['http://localhost:3000'];
  const referer = request.headers.referer;
  const useragent = request.headers['user-agent'];
  const origin = request.headers.origin;

  if (useragent.startsWith('Postman')) {
    return;
  }

  if (referer === 'https://adminapi.bluaart.com/admindocs/static/index.html') {
    return;
  }

  if (origin && !allowedOrigins.includes(origin)) {
    reply.code(403).send({
      status: false,
      response: 'Access Denied',
    });
  }

  if (!origin) {
    reply.code(403).send({
      status: false,
      response: 'Access Denied',
    });
  }
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Error connecting to the database:', err);
  pool.end(); // Close the pool in case of an error
});

fastify.register(AdminRoutes);

const start = async () => {
  try {
    await fastify.listen(config.server.port, '0.0.0.0');
   //console.log(Decrypt('38d5639a23cb633e6c5325bcb9b4b7e71902a0fa688330454e00f7dd8dfc147c3091b26f7e38540de40b1e5490fa873b79189fed3a81adf237523f8e898d0974eddc9ebfc827576accd6d3b397535e6f'))
    cron.schedule('*/1 * * * *', processBidItems);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fastify.get('/', (request, reply) => {
  const message = '<strong>Fastify Running !!! </strong>'
  reply.type('text/html').send(message)
})

start()

async function getBidTransactions(itemId, edition) {
  const query = `SELECT * FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2 AND "Status" = 'Pending';`;
  const values = [itemId, edition];
  const result = await pool.query(query, values);
  return result.rows;
}

async function getAcceptedBid(itemId, edition) {
  const query = `SELECT * FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2 AND ("Status" = 'Accepted'  OR ("Status" = 'Pending' AND "Price" = (SELECT MAX("Price") FROM "Bids" WHERE "ItemId" = $1 AND "Edition" = $2 AND "Status" = 'Pending')));`;
  const values = [itemId, edition];
  const result = await pool.query(query, values);
  return result.rows;
}

async function getItemIds(itemIds) {
  const query = `SELECT _id::text , "AuthorId", "CollectionId" FROM "ArtItems" WHERE "_id" = ANY($1);`;
  const values = [itemIds];
  const result = await pool.query(query, values);
  return result.rows;
}

async function getItemDetail(itemId) {
  const query = `SELECT "AuthorId", "CollectionId" FROM "ArtItems" WHERE "_id" = $1`;
  const values = [itemId];
  const result = await pool.query(query, values);
  return result.rows[0];
}


async function getUserDetails(UserIds) {
  if (!Array.isArray(UserIds) || UserIds.length === 0) {
    // Handle the case where UserIds is empty or not an array.
    return [];
  }

  const query = `SELECT _id, "WalletAddress", "Email" FROM "Users" WHERE "_id" = ANY($1);`;
  const values = [UserIds];
  const result = await pool.query(query, values);
  return result.rows;
}


async function getCollectionDetails(CollectionIds) {
  const query = `SELECT  _id , "Royalties", "Currency" FROM "Collections" WHERE "_id" = ANY($1);`;
  const values = [CollectionIds];
  const result = await pool.query(query, values);
  return result.rows;
}

async function getCollectionDetail(CollectionId) {
  const query = `SELECT "Royalties", "Currency" FROM "Collections" WHERE "_id" = $1;`;
  const values = [CollectionId];
  const result = await pool.query(query, values);
  return result.rows;
}

async function getChainDetail(Currency) {
  const query = `SELECT * FROM "Networks" WHERE "Currency" = $1`;
  const values = [Currency];
  const result = await pool.query(query, values);
  return result.rows;
}

async function processBidItems() {
  //console.log("processBidItems")
  const client = await pool.connect(); // Acquire a connection from the pool

  try {
    const bidItemsQuery = `
          SELECT *
          FROM "Editions"
          WHERE "EndDateTimeUtcBID"::timestamp <= NOW() AND "MarketPlaceStatus" = true
          AND "EnableBid" = true AND "HasBid" = true
          ORDER BY "_id" DESC;
      `;

    const bidItemsResult = await client.query(bidItemsQuery);
    const bidItems = bidItemsResult.rows;
    //console.log("bidItems", bidItems)
    for (const _tx of bidItems) {

      let resaddress = [], amount = [], value = 0, totalTX = 0;

      const BidTransactions = await getBidTransactions(_tx.ItemId, _tx.Edition);
      const highestBid = await getAcceptedBid(_tx.ItemId, _tx.Edition) || BidTransactions.find(bid => bid.Price === Math.max(...BidTransactions.map(b => b.Price)));
      console.log("highestBid", highestBid)
      if (highestBid && highestBid.length > 0) {

        const Senders = BidTransactions.map(bid => bid.Sender);
        const ItemIds = BidTransactions.map(bid => bid.ItemId);


        const items = await getItemIds(ItemIds);

        const senderusers = await getUserDetails(Senders);
        const currentOwners = await getUserDetails([_tx.CurrentOwner]);
        const authors = await getUserDetails(items.map(item => item.AuthorId));
        const collections = await getCollectionDetails(items.map(item => item.CollectionId));

        let ChainInfo;

        if (!collections.length) {

          let itemDetail = await getItemDetail(_tx.ItemId);

          let collectionDetail = await getCollectionDetail(itemDetail.CollectionId)

          ChainInfo = await getChainDetail(collectionDetail.Currency)

        } else {
          ChainInfo = await getChainDetail(collections[0].Currency)
        }

        const web3 = new Web3(new Web3.providers.HttpProvider(ChainInfo.RpcUrl))

        const BidInfoWithDetails = BidTransactions.map(bid => {

          const senderuser = senderusers.find(senderuser => senderuser && senderuser._id.toString() === bid.Sender.toString());
          const item = items.find(item => item._id.toString() === bid.ItemId.toString());
          const currentOwner = currentOwners.find(owner => owner && owner._id.toString() === _tx.CurrentOwner.toString());
          const author = authors.find(author => author && author._id.toString() === item.AuthorId.toString());
          const collection = collections.find(collectiondata => collectiondata && collectiondata._id.toString() === item.CollectionId.toString());
          return {
            _id: bid._id,
            Price: bid.Price,
            SenderUserAddress: senderuser ? senderuser.WalletAddress : '',
            ItemCurrentOwnerAddress: currentOwner ? currentOwner.WalletAddress : '',
            ItemAuthorAddress: author ? author.WalletAddress : '',
            AutherCommission: collection ? collection.Royalties : 0,
          };
        });
        await BidInfoWithDetails.forEachAsync(async _txn => {

          if (!highestBid || (_txn._id.toString() != highestBid[0]._id.toString())) {
            resaddress.push(_txn.SenderUserAddress);

            amount.push(await web3.utils.toWei(String((_txn.Price).toFixed(16))));

            value += Number(_txn.Price);
            totalTX++

          } else {
            const amountAuthor = (_txn.Price * _txn.AutherCommission) / 100;
            resaddress.push(_txn.ItemAuthorAddress);
            amount.push(await web3.utils.toWei(String((amountAuthor).toFixed(16))));

            const amountAdmin = (_txn.Price * ChainInfo[0].AdminCommission) / 100;
            resaddress.push(ChainInfo[0].AdminAddress);
            amount.push(await web3.utils.toWei(String((amountAdmin).toFixed(16))));

            let ownerPercent = 100 - (ChainInfo[0].AdminCommission + _txn.AutherCommission)
            const amountOwner = _txn.Price * ownerPercent / 100
            resaddress.push(_txn.ItemCurrentOwnerAddress);
            amount.push(await web3.utils.toWei(String((amountOwner).toFixed(16))));

            value += Number(_txn.Price);
            totalTX += 3
          }

        })
        if (totalTX > 0) {
          let sendeth = await sendETH(amount, value, resaddress, ChainInfo, highestBid[0].Sender, _tx.ItemId, highestBid[0].Price, highestBid[0].Edition)
          sleep(20000);
        } else {
          await TransferNft(highestBid[0].Sender, _tx.ItemId, highestBid[0].Price, highestBid[0].Edition);
        }
      } else {
        //console.log("No highest bid found for ItemId:", _tx.ItemId);
      }
    }
  } catch (error) {
    console.error("Error processing bid items:", error);
  } finally {
    client.release(); // Release the connection back to the pool
  }
}

async function sendETH(amount, value, resaddress, network, Sender, ItemId, Price, Edition) {

  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(network[0].RpcUrl));
    let AdminKey = network[0].Key_1 + network[0].Key_2;
    let adminprivatekey = await Decrypt(AdminKey);
    let wallet = web3.eth.accounts.wallet;
    wallet.clear();
    wallet = wallet.create(0);
    wallet.add(adminprivatekey);
    let multisendercontractAddres = network[0].MultiContract;
    let instance = await new web3.eth.Contract(
      JSON.parse(network[0].MultiAbiArray),
      multisendercontractAddres
    );
    if (resaddress != []) {
      let contractBalance = await web3.eth.getBalance(multisendercontractAddres);
      contractBalance = Web3.utils.fromWei(String(contractBalance), "ether");
      if (value <= contractBalance) {
        let estimateGas3 = await instance.methods
          .SendETH(resaddress, amount)
          .estimateGas({
            from: wallet[0].address,
            nonce: await web3.eth.getTransactionCount(
              wallet[0].address,
              "pending"
            ),
          });

        let highergas3 = (estimateGas3 * 1.1).toFixed(0);

        await instance.methods
          .SendETH(resaddress, amount)
          .send({
            from: wallet[0].address,
            gas: highergas3,
            nonce: await web3.eth.getTransactionCount(
              wallet[0].address,
              "pending"
            ),
          })
          .on("transactionHash", async (hash) => {
            var TransactionHash = hash
          })
          .on("confirmation", async (Number) => {
            if (Number == 1) {
              let ResData = {
                status: false,
                message: "Tx confirmed"
              }
              await TransferNft(Sender, ItemId, Price, Edition);
              return ResData;
            }
          })
          .on("error", async (er) => {
            console.log("Error", er);
            let ResData = {
              status: false,
              message: er.message
            }
            return ResData;
          });
      } else {
        console.log("Bid contract balance low");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = fastify