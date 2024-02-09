import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";

interface ISearchRequest extends Request {
  query: {
    search: string;
  };
}

// Function to generate hash required by Marvel API
const generateHash = (timestamp: string): string  =>{
  const hash = crypto.createHash('md5');
  hash.update(timestamp + process.env.MARVEL_PRIVATE_API_KEY + process.env.MARVEL_PUBLIC_API_KEY);
  return hash.digest('hex');
}

async function getMarvelCharacters(req: ISearchRequest, res: Response) {
  const searchString = req.query.search;

  const timestamp = new Date().getTime().toString();
  const hash = generateHash(timestamp);
  const url = process.env.MARVEL_BASE_URL ?? ""

  // Make a GET request using Axios
  axios
    .get(url, {params: {
      apikey: process.env.MARVEL_PUBLIC_API_KEY,
      ts: timestamp,
      hash: hash,
      nameStartsWith: searchString,
      limit: 20
    },})
    .then((response) => {
      console.log("Response Data:", response.data);
      return res.status(200).send(response.data.data.results);

    })
    .catch((error) => {
      console.error("Error:", error.message);
      return res.status(400).send(error.message);
    });
}

export default getMarvelCharacters;
