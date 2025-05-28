import { Sequelize } from "sequelize";
import db_instance from "../config/database.js";

const UserModel = db_instance.define("users", {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    user_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    user_password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    refresh_token: Sequelize.TEXT
});

export default UserModel;
