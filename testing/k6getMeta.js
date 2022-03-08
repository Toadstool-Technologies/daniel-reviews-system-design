/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
import http from 'k6/http';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 200,
      timeUnit: '0.1s',
      duration: '20s',
      preAllocatedVUs: 100,
      maxVUs: 100,
    },
  },
};

export default function () {
  http.get(`http://127.0.0.1:3000/reviews/meta/?product_id=${Math.floor(Math.random() * 1000011)}`);
}
