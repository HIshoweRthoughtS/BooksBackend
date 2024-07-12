--rename author -> join_author und so weiter
--todo:[general o7] create a 'plugin'(?) so that if some one contributes to a repo, they are asked to create a file with a file ending corresponding to their
--  mother tongue (.ger, .eng. pol, .jp, etc).
-- "Please create a file for one mother tongue. We would like everyone to only contribute one language, since this should be a collection not a guest book.
--  it doesn't have to be your main tongue. Again a collection, not guest book. Choose whichever one you want.
--  If your language of choice is already represented, "
/*
SQLITE Docs https://sqlite.org/datatype3.html


Each value stored in an SQLite database (or manipulated by the database engine) has one of the following storage classes:

NULL. The value is a NULL value.

INTEGER. The value is a signed integer, stored in 0, 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.

REAL. The value is a floating point value, stored as an 8-byte IEEE floating point number.

TEXT. The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).

BLOB. The value is a blob of data, stored exactly as it was input.

A storage class is more general than a datatype. The INTEGER storage class, for example, includes 7 different integer datatypes of different lengths. This makes a difference on disk. But as soon as INTEGER values are read off of disk and into memory for processing, they are converted to the most general datatype (8-byte signed integer). And so for the most part, "storage class" is indistinguishable from "datatype" and the two terms can be used interchangeably.

Any column in an SQLite version 3 database, except an INTEGER PRIMARY KEY column, may be used to store a value of any storage class.

All values in SQL statements, whether they are literals embedded in SQL statement text or parameters bound to precompiled SQL statements have an implicit storage class. Under circumstances described below, the database engine may convert values between numeric storage classes (INTEGER and REAL) and TEXT during query execution.




SQL database engines that use rigid typing will usually try to automatically convert values to the appropriate datatype. Consider this:

CREATE TABLE t1(a INT, b VARCHAR(10));
INSERT INTO t1(a,b) VALUES('123',456);
Rigidly-typed database will convert the string '123' into an integer 123 and the integer 456 into a string '456' prior to doing the insert.

In order to maximize compatibility between SQLite and other database engines, and so that the example above will work on SQLite as it does on other SQL database engines, SQLite supports the concept of "type affinity" on columns. The type affinity of a column is the recommended type for data stored in that column. The important idea here is that the type is recommended, not required. Any column can still store any type of data. It is just that some columns, given the choice, will prefer to use one storage class over another. The preferred storage class for a column is called its "affinity".

Each column in an SQLite 3 database is assigned one of the following type affinities:

TEXT
NUMERIC
INTEGER
REAL
BLOB



Regelen:
1. tabellen die ohne die dazu gehörige Tabelle keinen Sinn ergebnen, müssen mit 'join_..' gekenncheichnet werden.
2. 'join_..' Tabellen sind immer INTEGER NOT NULL, solange ALLE Tabellen rowid Tabellen sind.
3. most datetimes have a check, wether they can be in the future or not


ON UPDATE / ON DELETE
SET NULL
SET DEFAULT -> default ? default : NULL
RESTRICT
NO ACTION
CASCADE
*/

--redo
create table account (login_name text NOT NULL UNIQUE, pw_digest text NOT NULL, email text UNIQUE, last_login DATETIME CHECK(last_login <= CURRENT_TIMESTAMP), last_logout DATETIME CHECK(last_logout <= CURRENT_TIMESTAMP), created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL CHECK(created_at <= CURRENT_TIMESTAMP));

--Aus author, publisher, book sollten eig nie Einträge gelöscht werden. Genau so auch ReviewedBook
--d. h. werden sie referenziert in foreign keys, ist ON UPDATE CASCADE ON DELETE RESTRICT

--done
create table author (first_name text NOT NULL, last_name text NOT NULL, more_legal_names text, pseudonym text, birthday DATE);

--done
create table publisher (name text NOT NULL UNIQUE, country_of_origin text NOT NULL, hq_location text NOT NULL);

--done
create table book (isbn text NOT NULL UNIQUE, join_author INTEGER NOT NULL, join_publisher INTEGER NOT NULL, title text NOT NULL, extended_title text, extra_info text, FOREIGN KEY (join_author) REFERENCES author (rowid) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_publisher) REFERENCES publisher (rowid) ON UPDATE CASCADE ON DELETE RESTRICT);
/*
todo: store some kind of restriction. Like banned books that are not allowed to be reviewd, although something like that is never a good thing and i cant think of a use case rn
but age restriction maybe in a status 0001 -> fsk etc
*/

--done
create table user_todo_book (join_acc INTEGER NOT NULL, join_book INTEGER NOT NULL, order_rank INTEGER CHECK(order_rank >= 0), started_todo_date DATETIME, finished_todo_date DATETIME CHECK(finished_todo_date BETWEEN started_todo_date AND CURRENT_TIMESTAMP), FOREIGN KEY (join_acc) REFERENCES account (rowid) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT);
--template
create table user_todo_book (join_acc INTEGER NOT NULL, join_book INTEGER NOT NULL, order_rank INTEGER CHECK(order_rank >= 0), started_todo_date DATETIME /*NULL*/ /*NO DEFAULT*/, finished_todo_date DATETIME CHECK(finished_todo_date BETWEEN started_todo_date AND CURRENT_TIMESTAMP), FOREIGN KEY (join_acc) REFERENCES account (rowid) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT);
/*
start and finish may be in future. maybe smone wants to plan their todos. feel free
calculate progress from start and finish date
1. if not started and not finished -> todo
2. if started and not finished -> in progress
3. if not started and finished -> you are an idiot
4. if started equals finished -> on hold
5. if started and finished -> awaiting review
6. row? what row? ahhh, this guy,- that book,- started then,- just left his review? That guy?!
No, never seen him.
*/

--done
create table reviewed_book (join_book INTEGER NOT NULL, join_acc INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), first_impression TEXT NOT NULL UNIQUE, order_rank INTEGER CHECK(order_rank >=0), last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_updated <= CURRENT_TIMESTAMP), FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_acc) REFERENCES account (rowid) ON UPDATE CASCADE ON DELETE SET DEFAULT);
--template
create table reviewed_book (join_book INTEGER NOT NULL /*NOT UNIQUE!IMPORTANT!*/, join_acc INTEGER NOT NULL, created_at DATETIME /*yyyy-mm-dd:hh:mm:ss*/NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), first_impression text NOT NULL /*YES, NOT NULL! You will do a first impressino, if you want to or not!ALSO NOT CHANGABLE*/UNIQUE /*YES, UNIQUE! You get the rest.*/, order_rank /*UNSIGNED*/INTEGER /*NOT UNIQUE. We share*/ CHECK(order_rank >= 0), last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_updated <= CURRENT_TIMESTAMP), FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_acc) REFERENCES account (rowid) ON UPDATE CASCADE ON DELETE SET DEFAULT);
go
--if there is an entry in reviewed_book, there has to be at least on entry in book_read
--waiting

--done
create table book_read (join_reviewed_book INTEGER NOT NULL, started_read_date DATETIME NOT NULL CHECK(started_read_date <= CURRENT_TIMESTAMP), finished_read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(finished_read_at <= CURRENT_TIMESTAMP), thoughts TEXT, FOREIGN KEY (join_reviewed_book) REFERENCES reviewed_book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT);
--template
create table book_read (join_reviewed_book INTEGER NOT NULL, started_read_date DATETIME NOT NULL /*doen't have to be accurate*/ CHECK(started_read_date <= CURRENT_TIMESTAMP), finished_read_at DATETIME NOT NULL /*same goes here*/ DEFAULT CURRENT_TIMESTAMP CHECK(finished_read_at <= CURRENT_TIMESTAMP), thoughts text /*NULL*/, FOREIGN KEY (join_reviewed_book) REFERENCES reviewed_book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT /*should be CASCADE but could use to see stats. how often were which books read*/);
/*
isbn + account.rowid machen auch einen primary key. CHECK?
geht bei t-read auch ein foreign key nicht zu pm sondern zu isbn+a.rowid
in future maybe some kind of shareing id. groups or smth
in future todo:[db] link to this from quotes, excepts, and other stuff i would write in the book if i had my tools, which I probably forgot, otherwise this whole website wouldn't exist
*/

--done
create table review (join_read INTEGER NOT NULL, join_book INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), is_public INTEGER NOT NULL CHECK(is_public BETWEEN 0 AND 1), rating INTEGER NOT NULL CHECK(rating BETWEEN 0 AND 5), quicknote INTEGER NOT NULL CHECK(quicknote >= 0), title TEXT NOT NULL, essay TEXT NOT NULL, tldr TEXT NOT NULL, last_edited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_edited <= CURRENT_TIMESTAMP), FOREIGN KEY (join_read) REFERENCES book_read (rowid) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT);

--template
create table review (join_read /*defaults to last read for this user on this book*/ INTEGER NOT NULL, join_book INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), is_public INTEGER NOT NULL CHECK(is_public BETWEEN 0 AND 1), rating INTEGER NOT NULL CHECK(rating BETWEEN 0 AND 5) /*rating out of 5*/, quicknote /*UNSIGNED*/INTEGER NOT NULL CHECK(quicknote >= 0), title text NOT NULL, essay text /*maybe BLOB depending on nedded effeciency*/ NOT NULL, tldr text NOT NULL, last_edited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_edited <= CURRENT_TIMESTAMP), FOREIGN KEY (join_read) REFERENCES book_read (rowid) ON UPDATE CASCADE ON DELETE SET NULL/*if user is deleted, or information should be lost. Deleting reviewedbook is enough*/, FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT);
/*
I'd like to delete a read without deleting the reviews -> I need a way to reference the book. ALSO review is worthless without book
-> rather reference Book directly, so user data is not connected and reviews can be anonymous.
the rating out of 5 could get halfes. just check for 0-10 instead of 0-5
the typical quicknote can be stored as an int, varchar would take up unneccessary space.
    enumerations are used in code, for the 'humans' to keep track.
*/
