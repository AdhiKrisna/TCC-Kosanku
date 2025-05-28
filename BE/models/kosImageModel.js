import { Sequelize } from "sequelize";
import db_instance from "../config/database.js";

const KosImageModel = db_instance.define("kos_images", {
    image_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kos_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'kos',   
            key: 'kos_id'
        }
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

export default KosImageModel;