import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
export function database(filename=':memory:'){
 const db=new DatabaseSync(filename);db.exec(fs.readFileSync(new URL('../migrations/0001_parent_inquiries.sql',import.meta.url),'utf8'));
 const wrap=(sql,args=[])=>({bind(...bound){return wrap(sql,bound);},async first(){return db.prepare(sql).get(...args)||null;},async run(){const result=db.prepare(sql).run(...args);return {success:true,meta:{changes:result.changes}};},async all(){return {results:db.prepare(sql).all(...args)};}});
 return {prepare:wrap,async batch(stmts){db.exec('BEGIN');try{const results=[];for(const stmt of stmts)results.push(await stmt.run());db.exec('COMMIT');return results;}catch(e){db.exec('ROLLBACK');throw e;}},sqlite:db};
}
