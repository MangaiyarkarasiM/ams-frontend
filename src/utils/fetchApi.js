import axios from "axios";

const fetchApi = axios.create({
  baseURL: 'https://assetref.herokuapp.com',
  //baseURL:'http://localhost:8000',
})

export default fetchApi;