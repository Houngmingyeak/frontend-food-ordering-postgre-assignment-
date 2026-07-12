import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Category', 'Food', 'Order', 'User', 'Profile'],
  endpoints: (builder) => ({

    // ── AUTH ──────────────────────────────────────────────
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),

    // ── CATEGORIES ───────────────────────────────────────
    getCategories: builder.query({
      query: ({ page = 0, size = 20 } = {}) =>
        `/categories?page=${page}&size=${size}`,
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (r, e, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),

    // ── FOOD ITEMS ───────────────────────────────────────
    getFoods: builder.query({
      query: ({ page = 0, size = 12, categoryId, search } = {}) => {
        let url = `/foods?page=${page}&size=${size}`;
        if (categoryId) url += `&categoryId=${categoryId}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return url;
      },
      providesTags: ['Food'],
    }),
    getFoodById: builder.query({
      query: (id) => `/foods/${id}`,
      providesTags: (r, e, id) => [{ type: 'Food', id }],
    }),
    createFood: builder.mutation({
      query: (formData) => ({
        url: '/foods',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Food'],
    }),
    updateFood: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/foods/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Food'],
    }),
    deleteFood: builder.mutation({
      query: (id) => ({ url: `/foods/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Food'],
    }),

    // ── ORDERS ───────────────────────────────────────────
    placeOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: ({ page = 0, size = 10 } = {}) =>
        `/orders/my?page=${page}&size=${size}`,
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (r, e, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: ['Order'],
    }),

    // ── ADMIN: ORDERS ─────────────────────────────────────
    getAllOrders: builder.query({
      query: ({ page = 0, size = 20, status } = {}) => {
        let url = `/admin/orders?page=${page}&size=${size}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),

    // ── ADMIN: USERS ──────────────────────────────────────
    getAllUsers: builder.query({
      query: ({ page = 0, size = 20 } = {}) =>
        `/admin/users?page=${page}&size=${size}`,
      providesTags: ['User'],
    }),
    toggleBlockUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}/toggle-block`, method: 'PATCH' }),
      invalidatesTags: ['User'],
    }),

    // ── PROFILE ──────────────────────────────────────────
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/profile', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),

    // ── REPORTS ──────────────────────────────────────────
    getDashboardStats: builder.query({
      query: () => '/admin/reports/stats',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetFoodsQuery,
  useGetFoodByIdQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAllUsersQuery,
  useToggleBlockUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetDashboardStatsQuery,
} = apiSlice;
