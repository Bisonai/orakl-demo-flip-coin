import axios from 'axios';
import queryString from 'query-string';
import { Player } from '../types';
import { getApiEndpoint } from '../utils';

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest'
};

const axiosInstance = axios.create({
  headers,
  paramsSerializer: (params) => queryString.stringify(params)
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const getLeaderBoardApi = async(): Promise<Player[]> => {
  return axiosInstance.get('/api/leaderboard'); 
}

