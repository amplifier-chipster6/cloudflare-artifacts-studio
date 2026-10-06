// D1-shaped interface over Durable Object SQLite. SQL remains local to one object.
export function durableSql(storage){return {
 prepare(sql){return {values:[],bind(...values){this.values=values;return this},execute(){return storage.sql.exec(sql,...this.values)},async first(){return this.execute().toArray()[0]||null},async all(){return {results:this.execute().toArray()}},syncRun(){const cursor=this.execute();cursor.toArray();return {meta:{changes:Number(storage.sql.exec('SELECT changes() AS n').toArray()[0].n)}}},async run(){return this.syncRun()}}},
 async batch(statements){return storage.transactionSync(()=>statements.map(s=>s.syncRun()))},
};}
