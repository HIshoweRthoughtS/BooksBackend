
//3rd Party
import Database from 'better-sqlite3';
const db = new Database('db/sqlite3/BookList.db', { verbose: console.log, fileMustExist:true });

/**
 * READ
 * NOT NULL:    join_reviewed_book, started_read_date, finished_read_date (default)
 * UNIQUE:      join_reviewed_book + stated_read_date, join_reviewed_book + finished_read_date
 * 
 * REVIEW
 * NOT NULL:    join_read, join_book, created_at (default), is_public, rating, quicknote, title, essay, tldr, last_edited (default)
 * 
 * QUOTE
 * NOT NULL:    join_read, join_book, created_at (default), is_public
 * 
 */
