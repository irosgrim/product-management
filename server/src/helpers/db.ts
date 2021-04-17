
import fs from 'fs';
import { Inventory, Products } from '../db/types';

export async function getFile(pathToFile: string): Promise <Inventory | Products | null>  {
    const f = await fs.readFileSync(pathToFile, 'utf8')
    return JSON.parse(f);
}

export function partialStringMatch(searchString: string): (str: string) => boolean {
    const regexp = new RegExp(searchString, 'i');
    return (str: string): boolean => {
        return regexp.test(str);
    }
}