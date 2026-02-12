import path from 'path';
import fs from 'fs';

const content = fs.readFileSync(path.resolve("src/cli/mariadb-slow.json"), "utf8");
const json = JSON.parse(content);
json.map(items=>{
	items.queryTime_sec = (items.queryTime / 1000);
	return items;	
})
const sorted = json.sort((a, b) => b.queryTime - a.queryTime);

console.log(sorted);