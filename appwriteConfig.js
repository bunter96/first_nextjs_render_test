import { Client, Account, Databases, Query, ID } from 'appwrite';

// Initialize client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

// Initialize services
const account = new Account(client);
const databases = new Databases(client);

// Export constants if needed
export const DATABASE_ID = '67e86a96003df6c028d5';
export const COLLECTION_ID = '67e86a9f00217c8a35a5';

// Export all instances
export { client, account, databases, Query, ID };