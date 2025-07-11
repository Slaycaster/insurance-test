import Knex from "knex";
import { Model } from "objection";
import config from "../knexfile";

const environment = process.env.NODE_ENV || "development";
const knexConfig = config[environment];

export const knex = Knex(knexConfig);

Model.knex(knex);

export default knex;
