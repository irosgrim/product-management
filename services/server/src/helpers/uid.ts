// https://github.com/lukeed/uid

let IDX=256; 
let HEX: string[]=[];
let SIZE=256; 
let BUFFER: string;
while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

export function uid(len?: number): string {
  let i=0;
  let tmp=(len || 11);
  if (!BUFFER || ((IDX + tmp) > SIZE*2)) {
    for (BUFFER='',IDX=0; i < SIZE; i++) {
      BUFFER += HEX[Math.random() * 256 | 0];
    }
  }

  return BUFFER.substring(IDX, IDX++ + tmp);
}