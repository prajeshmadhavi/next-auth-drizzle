import { int, varchar, mysqlTable, timestamp, text } from 'drizzle-orm/mysql-core';

export const clients = mysqlTable('clients', {
  id: int('id').primaryKey().autoincrement(),
  api_key: varchar('api_key', { length: 255 }),
  userwaregno: varchar('userwaregno', { length: 255 }),
  client: varchar('client', { length: 255 }),
  password: varchar('password', { length: 255 }),
  status: varchar('status', { length: 15 }).default('active'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const sessions = mysqlTable('sessions', {
  sessionId: varchar('session_id', { length: 255 }).primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => clients.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
