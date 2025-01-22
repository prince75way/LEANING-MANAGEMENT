import { AppDataSource } from './databasetypeorm'; 


export const connectToPostgres = async (): Promise<boolean> => {
  return await new Promise((resolve, reject) => {

    AppDataSource.initialize()
      .then(() => {
        console.log("PostgreSQL connected successfully!");
        resolve(true);
      })
      .catch((error) => {
        console.error("Error connecting to PostgreSQL:", error);
        reject(false); 
      });
  });
};
