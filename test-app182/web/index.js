// @ts-nocheck
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import axios from "axios";
import crypto from 'crypto';
import { configDotenv } from "dotenv";
import { DEFAULT_CUSTOMIZE, DEFAULT_TRANSLATION } from "./frontend/constants/index.js";
configDotenv()
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);


const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
    const session = res.locals.shopify.session;
    console.log('session',session)
    const queryParams = { ...req.query };
    console.log('queryParams',queryParams)
    const { code, shop } = queryParams
    if (!code || !shop) {
      return res.status(400).send("Missing required parameters: 'code' or 'shop'");
    }
    if (!session) {
      return res.status(401).send("Unauthorized: No valid session");
    }
    const storefront_access_token = await ensureStorefrontAccessToken(shop, session?.accessToken)
    const shopInfo = {
      shopify_domain: session.shop,
      access_token: session.accessToken,
      shopify_access_scopes_granted: session.scope,
      active: 1,
      storefront_access_token: storefront_access_token.access_token
    };
    try {
      const response = await axios.post("http://localhost:3000/shop", shopInfo, {
        headers: {
          "Hmac": JSON.stringify(queryParams)
        }
      });    
    } catch (error) {
      console.error("Failed to save shop information:", error);
    }
    const client = new shopify.api.clients.Graphql({ session });

    createMetaObject(session)
    next()
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js


app.use("/api/*", shopify.validateAuthenticatedSession());


app.use(express.json());

app.post("/api/update-entries", async (req, res) => {
  const { fieldKey, newValue } = req.body;
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  const queryResponse = await client.query({
    data: {
      query: `
        query {
          metaobjects(type: "tl_discount_box", first: 1) {
            edges {
              node {
                id
                fields {
                  key
                  value
                }
              }
            }
          }
        }
      `
    }
  });
  const edges = queryResponse.body.data.metaobjects.edges;
  if (!edges || edges.length === 0) {
    return res.status(404).json({ error: "No metaobject entry found for type tl_discount_box" });
  }
  const metaobjectId = edges[0].node.id;
  let fieldValue = newValue;
  const updateResponse = await client.query({
    data: {
      query: `
          mutation UpdateMetaobject($id: ID!, $fields: [MetaobjectFieldInput!]!) {
            metaobjectUpdate(id: $id, metaobject: { fields: $fields }) {
              metaobject {
                id
                fields {
                  key
                  value
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      variables: {
        id: metaobjectId,
        fields: [
          { key: fieldKey, value: JSON.stringify(fieldValue) }
        ]
      }
    }
  });
  const userErrors = updateResponse.body.data.metaobjectUpdate.userErrors;
  if (userErrors && userErrors.length > 0) {
    return res.status(400).json({ error: userErrors });
  }
  return res.status(200).json({
    success: true,
    metaobject: updateResponse.body.data.metaobjectUpdate.metaobject
  });
});


app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});



async function ensureStorefrontAccessToken(shop, accessToken) {
  try {
    const checkResponse = await axios.get(
      `https://${shop}/admin/api/2025-01/storefront_access_tokens.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const existingTokens = checkResponse.data.storefront_access_tokens;
    if (existingTokens.length > 0) {
      return existingTokens[0];
    }

    const createResponse = await axios.post(
      `https://${shop}/admin/api/2025-01/storefront_access_tokens.json`,
      {
        storefront_access_token: {
          title: "My App Storefront Token",
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    return createResponse.data.storefront_access_token;
  } catch (error) {
    console.error("Lỗi tạo Storefront Access Token:", error);
    return null;
  }
}

const createMetaObject = async (session) => {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const checkDefinition = await client.query({
      data: {
        query: `
          query {
            metaobjectDefinitions(first: 10) {
              edges {
                node {
                  type
                }
              }
            }
          }
        `
      }
    });
    const metaObjectExists = checkDefinition.body.data.metaobjectDefinitions.edges.some(
      (edge) => edge.node.type === "tl_discount_box"
    );
    if (!metaObjectExists) {
      await client.query({
        data: {
          query: `mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
            metaobjectDefinitionCreate(definition: $definition) {
              metaobjectDefinition { id }
              userErrors { message }
            }
          }`,
          variables: {
            definition: {
              type: "tl_discount_box",
              name: "Discount Box Configuration",
              fieldDefinitions: [
                { key: "customization", name: "Customization", type: "json" },
                { key: "translation", name: "Translation", type: "json" }
              ]
            }
          }
        }
      });
      const createEntryResponse = await client.query({
        data: {
          query: `
          mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
            metaobjectCreate(metaobject: $metaobject) {
              metaobject {
                id
                fields {
                  key
                  value
                }
              }
              userErrors { message }
            }
          }
        `,
          variables: {
            metaobject: {
              type: "tl_discount_box",
              fields: [
                { key: "customization", value: JSON.stringify(DEFAULT_CUSTOMIZE) },
                { key: "translation", value: JSON.stringify(DEFAULT_TRANSLATION) }
              ]
            }
          }
        }
      });
    } else {
      console.log("Metaobject Definition đã tồn tại");
    }
  } catch (error) {
    console.error("Error creating metaobject:", error);
  }
}




app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});
console.log(PORT)
app.listen(PORT);
