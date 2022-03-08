/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 120,
  duration: '60s',
};

export default function () {
  http.get('http://127.0.0.1:3000/reviews/?product_id=309241');
  sleep(1);
}
