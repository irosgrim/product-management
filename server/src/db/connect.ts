import { DB, DbType } from './dbAdapter';

const typeOfDbToUse = process.env.DB_TYPE;
console.log(new DB().useDb(typeOfDbToUse as DbType));

export const db = new DB().useDb(typeOfDbToUse as DbType);
