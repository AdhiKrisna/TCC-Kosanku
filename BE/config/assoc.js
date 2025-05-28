import KosModel from '../models/kosModel.js';
import UserModel from '../models/userModel.js';
import KosImageModel from '../models/kosImageModel.js';
import db_instance from './database.js';

const association = async () => {
    try {
        // Set up the relationship
        KosModel.belongsTo(UserModel, {
            foreignKey: 'pemilik_kos_id',
            as: 'owner'
        });

        UserModel.hasMany(KosModel, {
            foreignKey: 'pemilik_kos_id',
            as: 'kosList'
        });

        // kos dengan kos_images
        KosImageModel.belongsTo(KosModel, {
            foreignKey: "kos_id",
            as: 'kos'
        });

        KosModel.hasMany(KosImageModel, {
            foreignKey: "kos_id",
            as: 'images_url',
            onDelete: "CASCADE"
        });

        // Sync database
        db_instance.sync()
            .then(() => {
                console.log("All tables and associations synced successfully.");
            })
            .catch((error) => {
                console.error("Error syncing database:", error);
            });
    } catch (error) {
        console.error("Error in association:", error);
    }
};

export default association;
