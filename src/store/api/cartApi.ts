import { api } from './baseApi';
import { Cart, CartItem } from '../types';

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/user/cart',
      transformResponse: (response: { data: Cart }) => response.data,
      providesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<CartItem, { itemId: string; quantity: number }>({
      query: ({ itemId, quantity }) => ({
        // Backend uses /user/cart/:itemId for updates
        url: `/user/cart/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<void, string>({
      query: (itemId) => ({
        // Backend uses /user/cart/:itemId for deletes
        url: `/user/cart/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    addToCart: builder.mutation<{ cart_item: CartItem }, { competition_id: string; quantity: number }>({
      query: (body) => ({
        // API expects add-to-cart at /user/cart (no /item suffix)
        url: '/user/cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, useAddToCartMutation } = cartApi;
