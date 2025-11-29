import { api } from './baseApi';
import { CompetitionsResponse, CompetitionDetailsResponse } from '../types';

export interface MyCompetitionEntry {
  _id: string;
  title: string;
  image_url: string;
  draw_time: string;
  createdAt: string;
  status: string;
  total_purchased_tickets?: number;
  total_participated_competitions?: number;
}

export interface MyCompetitionsResponse {
  success: boolean;
  message: string;
  data: {
    total_participated_competitions: number;
    total_purchased_tickets: number;
    competitions: MyCompetitionEntry[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface CompetitionTicketsResponse {
  success: boolean;
  message: string;
  data: {
    tickets: {
      ticket_number: string;
      username: string;
      date_time: string;
    }[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export const competitionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompetitions: builder.query<CompetitionsResponse, { page: number; limit: number }>({
      query: ({ page = 1, limit = 10 }) => `competitions?page=${page}&limit=${limit}`,
    }),
    getCompetitionById: builder.query<CompetitionDetailsResponse, string>({
      query: (id) => `competitions/${id}`,
    }),
    getMyCompetitions: builder.query<MyCompetitionsResponse, void>({
      query: () => 'competitions/my',
    }),
    getCompetitionTickets: builder.query<CompetitionTicketsResponse, { id: string; page?: number; limit?: number }>({
      query: ({ id, page = 1, limit = 10 }) => `tickets/competition/${id}?page=${page}&limit=${limit}`,
    }),
  }),
});

export const { useGetCompetitionsQuery, useGetCompetitionByIdQuery, useGetMyCompetitionsQuery, useGetCompetitionTicketsQuery } = competitionsApi;
