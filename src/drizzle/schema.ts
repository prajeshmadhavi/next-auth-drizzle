import { int, varchar, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }),
});

export const sessions = mysqlTable('sessions', {
  sessionId: varchar('session_id', { length: 255 }).primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
