import fs from "fs";
import path from 'path';

const content = fs.readFileSync(path.resolve("src/cli/mariadb-slow.log"), "utf8");


// แยก block ด้วยช่องว่างระหว่างบล็อก
const blocks = content
  .trim()
  .split(/\n(?=# Time: )/g) // เจอ # Time: ใหม่
  .map(b => b.trim());

const results = blocks.map(b => {
  const obj = {};
  
  const time = b.match(/# Time:\s+(.+)/);
  if (time) obj.time = time[1].trim();

  const uh = b.match(/# User@Host:\s+(.+)/);
  if (uh) obj.userHost = uh[1].trim();

  const threadSchema = b.match(/# Thread_id:\s+(\d+)\s+Schema:\s+(\w+)/);
  if (threadSchema) {
    obj.threadId = Number(threadSchema[1]);
    obj.schema = threadSchema[2];
  }

  const qline = b.match(
    /# Query_time:\s+([\d.]+)\s+Lock_time:\s+([\d.]+)\s+Rows_sent:\s+(\d+)\s+Rows_examined:\s+(\d+)/
  );
  if (qline) {
    obj.queryTime = Number(qline[1]);
    obj.lockTime = Number(qline[2]);
    obj.rowsSent = Number(qline[3]);
    obj.rowsExamined = Number(qline[4]);
  }

  const q = b.split("\n").filter(line => !line.startsWith("#")).join("\n");
  obj.query = q.trim();

  return obj;
});

const data = JSON.stringify(results, null, 2);
fs.writeFileSync(path.resolve("src/cli/mariadb-slow.json"), data);


console.log(results);
