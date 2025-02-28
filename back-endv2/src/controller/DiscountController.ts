import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Shop } from "../entity/Shop";
import axios from "axios";
export class DiscountController {
  private shopRepository = AppDataSource.getRepository(Shop);

  async updateDiscount(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { shopDomain, currentDiscounts, token } = request.body;
      console.log(shopDomain, currentDiscounts, token);
      const shop = await this.shopRepository.findOne({
        where: { shopify_domain: shopDomain },
      });
      const storefront_access_token = shop.storefront_access_token;
      const graphqlResponse = await axios.post(
        `https://${shopDomain}/api/2024-01/graphql.json`,
        {
          query: `
              mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
                cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
                  cart {
                    id
                    discountCodes {
                      code
                      applicable
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
            cartId: `gid://shopify/Cart/${token}`,
            discountCodes: currentDiscounts,
          },
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": storefront_access_token,
            "Content-Type": "application/json",
          },
        }
      );
      const result = graphqlResponse.data.data.cartDiscountCodesUpdate.cart;
      return result;
    } catch (error) {
      next(error);
    }
  }
}
