/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
import http from 'k6/http';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1500,
      timeUnit: '1s',
      duration: '5s',
      preAllocatedVUs: 100,
      maxVUs: 100,
    },
  },
};

export default function () {
  http.post('http://127.0.0.1:3000/reviews/', {
    product_id: 444666,
    rating: 5,
    summary: 'This is a great review',
    body: "Best I've ever seen at least. This review is unreal!",
    recommend: true,
    reviewer_name: 'not_daniel',
    characteristics: {
      Fit: '5',
      Length: '5',
      Comfort: '4',
      Quality: '1',
    },
  }, { headers: { 'Content-Type': 'application/json' } });
}
