import axios from "axios";

const fetchApi = axios.create({
  baseURL: 'https://assetref.vercel.app',
  //baseURL:'http://localhost:8000',
})

export default fetchApi;