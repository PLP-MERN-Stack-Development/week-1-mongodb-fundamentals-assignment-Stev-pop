//TASK 2
 
//Find all books in a specific genre
db.books.find({ genre: 'Fiction' });

//Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } });

//Find books by a specific author
db.books.find({ author: 'George Orwell' });

//Update the price of a specific book
db.books.updateOne(
  { title: '1984' },
  { $set: { price: 15.99 } }
);

//Delete a book by its title
db.books.deleteOne({ title: 'Animal Farm' });



// TASK 3: Advanced Queries

// Query configuration
const booksPerPage = 5;
const page = 1; // Change this value to view different pages (1 = first page)

async function advancedQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = {
      in_stock: true,
      published_year: { $gt: 2010 }
    };

    const projection = {
      title: 1,
      author: 1,
      price: 1,
      _id: 0
    };

    const skipAmount = (page - 1) * booksPerPage;

    console.log(`\n📚 Books In Stock & Published After 2010 (Sorted by Price ASC, Page ${page})`);
    const booksAsc = await collection
      .find(query)
      .project(projection)
      .sort({ price: 1 }) // Ascending
      .skip(skipAmount)
      .limit(booksPerPage)
      .toArray();
    console.table(booksAsc);

    console.log(`\n📚 Books In Stock & Published After 2010 (Sorted by Price DESC, Page ${page})`);
    const booksDesc = await collection
      .find(query)
      .project(projection)
      .sort({ price: -1 }) // Descending
      .skip(skipAmount)
      .limit(booksPerPage)
      .toArray();
    console.table(booksDesc);

  } catch (err) {
    console.error('Query error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

advancedQueries();




