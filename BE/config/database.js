import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const api_host = process.env.MYSQL_INSTANCE_HOST;
const api_password = process.env.MYSQL_INSTANCE_PASS;
const api_username = process.env.MYSQL_INSTANCE_USERNAME;
const api_database = process.env.MYSQL_INSTANCE_DB;


const db_instance = new Sequelize(api_database, api_username, api_password, {
    host: api_host,
    dialect: "mysql"
});``

export default db_instance; 