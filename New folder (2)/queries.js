const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp-bookstore';
const collectionName = 'books';

async function fetchBooks(page = 1, sortOrder = 1) {
  const client = new MongoClient(uri);
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const filter = {
      in_stock: true,
      published_year: { $gt: 2010 }
    };

    const projection = {
      title: 1,
      author: 1,
      price: 1,
      _id: 0
    };

    const sort = { price: sortOrder }; 

    const books = await collection
      .find(filter)
      .project(projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log(`Page ${page} - Sorted by price (${sortOrder === 1 ? 'Ascending' : 'Descending'}):`);
    console.table(books);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}


fetchBooks(1, 1);


