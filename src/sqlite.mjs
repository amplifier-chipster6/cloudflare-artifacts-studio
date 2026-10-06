import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdirSync,chmodSync} from 'node:fs';
import {dirname} from 'node:path';
export function openDatabase(filename){
 if(filename!==':memory:')mkdirSync(dirname(filename),{recursive:true,mode:0o700});
 const db=new DatabaseSync(filename);
 if(filename!==':memory:')chmodSync(filename,0o600);
 db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
 return {close:()=>db.close(),prepare(sql){return {values:[],bind(...values){this.values=values;return this},async first(){return db.prepare(sql).get(...this.values)||null},async all(){return {results:db.prepare(sql).all(...this.values)}},syncRun(){const r=db.prepare(sql).run(...this.values);return {meta:{changes:Number(r.changes)}}},async run(){return this.syncRun()}}},async batch(statements){db.exec('BEGIN');try{const out=[];for(const q of statements)out.push(q.syncRun());db.exec('COMMIT');return out}catch(e){db.exec('ROLLBACK');throw e}}};
}
