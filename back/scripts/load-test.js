// Load-testing script for k6
//
// Instructions:
// 1. Install k6
// 2. Launch the Docker service:
//    FLASK_ENV=production docker-compose up --build webapp
// 3. Fetch a JWT for authorization
//    ./fetch_token
// 4. Store the value of `access_token` as `TEST_AUTH0_JWT` in the .env file
// 5. Run the script with effective loading of variables from the .env file
//    dotenv run k6 run back/scripts/load-test.js
// 6. Consider k6 options (e.g. number of virtual users via -u)
// 7. Experiment with GraphQL queries of varying complexity
// 8. Experiment with different WSGI server settings (gunicorn.conf.py file)
//    Remember to re-launch the Docker service for changes to take effect
//
// Explanation of metrics: https://k6.io/docs/using-k6/metrics/#http-specific-built-in-metrics
import http from "k6/http";
import { check } from "k6";

const url = "http://0.0.0.0:5005/graphql";
// const url = "https://api-staging.boxtribute.org";
const params = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${__ENV.TEST_AUTH0_JWT}`,
  },
};
const payload = JSON.stringify({
  // A) Request single field of single resource
  // query: "query { beneficiary(id: 1007) { firstName } }",

  // B) Request single field of multiple resources
  query: "query { beneficiaries { elements { firstName } } }",
});

export const options = {
  scenarios: {
    /*
    shared: {
      executor: 'shared-iterations',

      // common scenario configuration
      // startTime: '10s',
      gracefulStop: '5s',

      // executor-specific configuration
      vus: 10,
      iterations: 100,
      // maxDuration: '10s',
    },
    */
    ramping: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "20s", target: 10 },
        { duration: "5s", target: 0 },
      ],
      gracefulRampDown: "0s",
    },
  },
};

export default function () {
  const res = http.post(url, payload, params);

  // Use in combination with A/B to assert working auth
  // check(res, { 'is status 200': (r) => r.status === 200, });

  // Use in combination with A
  // check(res, { 'has correct firstName': (r) => r.json().data.beneficiary.firstName === "Kailyn", });

  // Use in combination with B
  // check(res, { 'contains 50 elements': (r) => r.json().data.beneficiaries.elements.length === 50, });
}
