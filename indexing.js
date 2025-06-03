const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runIndexing() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Create index on title
    const titleIndexResult = await collection.createIndex({ title: 1 });
    console.log(`\n✅ Created index: ${titleIndexResult}`);

    // 2. Create compound index on author and published_year
    const compoundIndexResult = await collection.createIndex({ author: 1, published_year: -1 });
    console.log(`✅ Created compound index: ${compoundIndexResult}`);

    // 3. Use explain() to compare performance

    console.log('\n🔍 Query WITHOUT index explanation (title search)');
    const noIndexExplain = await collection.find({ title: '1984' }).explain('executionStats');
    console.log(`Execution time (no index): ${noIndexExplain.executionStats.executionTimeMillis} ms`);
    console.log(`Documents examined: ${noIndexExplain.executionStats.totalDocsExamined}`);

    console.log('\n🔍 Query WITH compound index explanation (author + published_year)');
    const compoundExplain = await collection.find({ author: 'George Orwell', published_year: 1949 }).explain('executionStats');
    console.log(`Execution time (compound index): ${compoundExplain.executionStats.executionTimeMillis} ms`);
    console.log(`Documents examined: ${compoundExplain.executionStats.totalDocsExamined}`);

  } catch (err) {
    console.error('Indexing error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

runIndexing();
