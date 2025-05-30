import { Sequelize } from "sequelize";
import db_instance from "../config/database.js";

const KosModel = db_instance.define("kos", {
    kos_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kos_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    kos_address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    kos_description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    kos_rules: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    link_gmaps: {
        type: Sequelize.STRING,
        allowNull: false
    },
    owner_kos_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    room_available: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    max_price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    min_price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    kos_latitude: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    kos_longitude: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

export default KosModel;
