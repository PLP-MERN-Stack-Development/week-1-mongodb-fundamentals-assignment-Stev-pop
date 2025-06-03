// aggregation_pipeline.js - Perform aggregation operations on the 'books' collection

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runAggregations() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Average price of books by genre
    console.log('\n📊 Average Price of Books by Genre');
    const avgPriceByGenre = await collection.aggregate([
      {
        $group: {
          _id: '$genre',
          averagePrice: { $avg: '$price' }
        }
      },
      {
        $project: {
          _id: 0,
          genre: '$_id',
          averagePrice: { $round: ['$averagePrice', 2] }
        }
      },
      { $sort: { averagePrice: -1 } }
    ]).toArray();
    console.table(avgPriceByGenre);

    // 2. Author with the most books
    console.log('\n🏆 Author with the Most Books');
    const topAuthor = await collection.aggregate([
      {
        $group: {
          _id: '$author',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.table(topAuthor.map(item => ({
      author: item._id,
      books: item.count
    })));

    // 3. Group books by publication decade and count them
    console.log('\n📚 Book Count by Publication Decade');
    const booksByDecade = await collection.aggregate([
      {
        $project: {
          decade: {
            $concat: [
              { $toString: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } },
              's'
            ]
          }
        }
      },
      {
        $group: {
          _id: '$decade',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.table(booksByDecade.map(item => ({
      decade: item._id,
      books: item.count
    })));

  } catch (err) {
    console.error('Aggregation error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

runAggregations();
