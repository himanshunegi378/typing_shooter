import Axios from "axios";

export const transport = Axios.create({baseURL: 'http://192.168.0.5:8000'})