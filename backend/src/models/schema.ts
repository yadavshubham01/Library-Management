import { Sequelize, Model, DataTypes } from 'sequelize';
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://neondb_owner:IkACpi9UvM8j@ep-misty-mode-a5cqcm53.us-east-2.aws.neon.tech/neondb?sslmode=require',{
  dialect: "postgres",
});


export class Book extends Model {}

Book.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    publication_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "Books", 
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat',
  }
);

export default Book;