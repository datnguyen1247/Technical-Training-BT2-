import { createSlice } from "@reduxjs/toolkit";

const initialState = (localStorage.getItem("shop") &&
  JSON.parse(localStorage.getItem("shop") || "")) ||
  "" || {
    shopify_domain: "",
    shop_owner: "",
  };

const shopSlice = createSlice({
  name: "shop",
  initialState: initialState,
  reducers: {
    updateShopData(state, action) {
      const data = { ...state, ...action.payload };
      state = data;
    },
  },
});

export const { updateShopData } = shopSlice.actions;
export default shopSlice.reducer;
