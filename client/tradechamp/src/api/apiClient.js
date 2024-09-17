import request from 'superagent';

// Base URL for all requests
const baseURL = 'http://localhost:1738/api'; // Adjust this to your API's base URL



/**
 * Fetches data from the API endpoint.
 * 
 * This function makes a GET request to the `/test` endpoint and returns the response text.
 * It is used to retrieve data from the server.
 * 
 * Example usage:
 * 
 * ```javascript
 * import { fetchData } from './apiClient';
 * 
 * const getData = async () => {
 *   try {
 *     const data = await fetchData();
 *     console.log('Fetched Data:', data);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 * 
 * getData();
 * ```
 * 
 * @returns {Promise<string>} - The response text from the API.
 * @throws {Error} - Throws an error if the request fails.
 */

export const fetchData = async () => {
try {
    const response = await request.get(`${baseURL}/test`);
    return response.text; // Superagent's response body contains the data
} catch (error) {
    console.error('Error fetching data:', error);
    throw error;
}
};


/**
 * Submits data to the API endpoint.
 * 
 * This function makes a POST request to the `/test` endpoint with the provided data.
 * It sets the `Content-Type` header to `application/json` and returns the response text.
 * 
 * Example usage:
 * 
 * ```javascript
 * import { submitData } from './apiClient';
 * 
 * const postData = async () => {
 *   try {
 *     const result = await submitData({ key: 'value' });
 *     console.log('Submit Result:', result);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 * 
 * postData();
 * ```
 * 
 * @param {Object} data - The data to be submitted to the API.
 * @returns {Promise<string>} - The response text from the API.
 * @throws {Error} - Throws an error if the request fails.
 */

  export const submitData = async (data) => {
    try {
      const response = await request
        .post(`${baseURL}/test`)
        .send(data)
        .set('Content-Type', 'application/json');
      return response.text; // Superagent's response body contains the result
    } catch (error) {
      console.error('Error submitting data:', error);
      throw error;
    }
  };
  