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

!rowid and other aliases cannot be used in FOREIGN KEY references!
so a integer primary key (ipk) has to be created.
https://www.sqlite.org/lang_createtable.html#rowids_and_the_integer_primary_key
this ipk is a reference to rowid (in very most cases)
this column will me named: id_ref
*/


--TABLES=====================================================
--=====================NO FOREIGN KEYS=======================
--done
create table account (a_id_ref INTEGER, loginname text NOT NULL UNIQUE, pw_digest text NOT NULL, email text UNIQUE, last_login DATETIME CHECK(last_login <= CURRENT_TIMESTAMP), last_logout DATETIME CHECK(last_logout <= CURRENT_TIMESTAMP), created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL CHECK(created_at <= CURRENT_TIMESTAMP), PRIMARY KEY (a_id_ref ASC));
--template | to have fun with
create table account (a_id_ref INTEGER, loginname text NOT NULL UNIQUE, pw_digest text NOT NULL, email text UNIQUE, last_login DATETIME CHECK(last_login <= CURRENT_TIMESTAMP), last_logout DATETIME CHECK(last_logout <= CURRENT_TIMESTAMP), created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL CHECK(created_at <= CURRENT_TIMESTAMP), PRIMARY KEY (a_id_ref ASC));

--Aus author, publisher, book sollten eig nie Einträge gelöscht werden. Genau so auch ReviewedBook
--d. h. werden sie referenziert in foreign keys, ist ON UPDATE CASCADE ON DELETE RESTRICT

--done | last committed
create table author (au_id_ref INTEGER, first_name text NOT NULL, last_name text NOT NULL, more_legal_names text, pseudonym text, birthday DATE, PRIMARY KEY (au_id_ref ASC));
--template | to have fun with
create table author (au_id_ref INTEGER, first_name text NOT NULL, last_name text NOT NULL, more_legal_names text, pseudonym text, birthday DATE, PRIMARY KEY (au_id_ref ASC));

--done | last committed
create table publisher (pub_id_ref INTEGER, title text NOT NULL UNIQUE, country_of_origin text NOT NULL, hq_location text NOT NULL, PRIMARY KEY (pub_id_ref ASC));
--template | to have fun with
create table publisher (pub_id_ref INTEGER, title text NOT NULL UNIQUE, country_of_origin text NOT NULL, hq_location text NOT NULL, PRIMARY KEY (pub_id_ref ASC));

--todo
create table marker_colors (mc_id_ref INTEGER, color_name text NOT NULL, color_code INTEGER NOT NULL DEFAULT mc_id_ref, meaning text NOT NULL, PRIMARY KEY (mc_id_ref ASC));
--template | to have fun with*(linux done)
create table marker_colors (mc_id_ref INTEGER, color_name text NOT NULL, color_code INTEGER NOT NULL DEFAULT mc_id_ref, meaning text NOT NULL, PRIMARY KEY (mc_id_ref ASC));
/*
color is enum 
yellow = 0, meaning = 'note'
green = 1, meaning = 'well written'
orange = 2, meaning = 'quotable'
blue = 3, meaning = 'external reference'
purple = 4, meaning = 'personal relevance'
pink = 5, meaning = 'high'
*/
--=====================WITH FOREIGN KEYS=======================
--done | last committed
create table book (b_id_ref INTEGER, isbn text NOT NULL UNIQUE, join_author INTEGER NOT NULL, join_publisher INTEGER NOT NULL, title text NOT NULL, extended_title text, extra_info text, PRIMARY KEY (b_id_ref ASC), FOREIGN KEY (join_author) REFERENCES author (au_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_publisher) REFERENCES publisher (pub_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--template | to have fun with*macdon
create table book (b_id_ref INTEGER, isbn text NOT NULL UNIQUE, join_author INTEGER NOT NULL, join_publisher INTEGER NOT NULL, title text NOT NULL, extended_title text, pages INTEGER, chapter INTEGER, extra_info text, PRIMARY KEY (b_id_ref ASC), FOREIGN KEY (join_author) REFERENCES author (au_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_publisher) REFERENCES publisher (pub_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
/*
todo: store some kind of restriction. Like banned books that are not allowed to be reviewd, although something like that is never a good thing and i cant think of a use case rn
but age restriction maybe in a status 0001 -> fsk etc
*/

--done | last committed
create table user_todo_book (t_id_ref INTEGER, join_acc INTEGER NOT NULL, join_book INTEGER NOT NULL, order_rank INTEGER CHECK(order_rank >= 0) DEFAULT 0, started_todo_date DATETIME, finished_todo_date DATETIME CHECK(finished_todo_date BETWEEN started_todo_date AND CURRENT_TIMESTAMP), last_page INTEGER, current_page INTEGER CHECK(last_page IS NULL OR current_page <= last_page) DEFAULT 0, PRIMARY KEY (t_id_ref ASC), FOREIGN KEY (join_acc) REFERENCES account (a_id_ref) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--template | to have fun with
--removed
--comments
create table user_todo_book (t_id_ref INTEGER, join_acc INTEGER NOT NULL, join_book INTEGER NOT NULL, order_rank INTEGER CHECK(order_rank >= 0) DEFAULT 0, started_todo_date DATETIME /*NULL*/ /*NO DEFAULT*/, finished_todo_date DATETIME CHECK(finished_todo_date BETWEEN started_todo_date AND CURRENT_TIMESTAMP), last_page INTEGER, current_page INTEGER CHECK(NOT last_page || current_page <= last_page) DEFAULT 0, PRIMARY KEY (t_id_ref ASC), FOREIGN KEY (join_acc) REFERENCES account (a_id_ref) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
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
--done | last committed
create table reviewed_book (rv_id_ref INTEGER, join_book INTEGER NOT NULL, join_acc INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), first_impression text NOT NULL, order_rank INTEGER CHECK(order_rank >= 0), last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_updated <= CURRENT_TIMESTAMP), PRIMARY KEY (rv_id_ref ASC), FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_acc) REFERENCES account (a_id_ref) ON UPDATE CASCADE ON DELETE SET DEFAULT);
--template | to have fun with*macdone
create table reviewed_book (rv_id_ref INTEGER, join_book INTEGER NOT NULL, join_acc INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), first_impression text, order_rank INTEGER CHECK(order_rank >= 0), last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_updated <= CURRENT_TIMESTAMP), PRIMARY KEY (rv_id_ref ASC), FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_acc) REFERENCES account (a_id_ref) ON UPDATE CASCADE ON DELETE SET DEFAULT);
--comments
create table reviewed_book/*todo:[maybe] rename to book_experience or book_memories*/ (rv_id_ref INTEGER, join_book INTEGER NOT NULL /*NOT UNIQUE!IMPORTANT!*/, join_acc INTEGER NOT NULL, created_at DATETIME /*yyyy-mm-dd:hh:mm:ss*/NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), first_impression text /*YES, NOT NULL! You will do a first impressino, if you want to or not!ALSO NOT CHANGABLE*/ /*UNIQUE at least for now i allow dups*/ /*YES, UNIQUE! You get the rest.*/, order_rank /*UNSIGNED*/INTEGER /*NOT UNIQUE. We share*/ CHECK(order_rank >= 0), last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_updated <= CURRENT_TIMESTAMP), PRIMARY KEY (rv_id_ref ASC), FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_acc) REFERENCES account (a_id_ref) ON UPDATE CASCADE ON DELETE SET DEFAULT);

--todo
create table todo_reminder (tr_id_ref INTEGER, join_user_todo INTEGER NOT NULL, title text DEFAULT 'UNTITLED', content text NOT NULL, PRIMARY KEY (tr_id_ref ASC), FOREIGN KEY (join_user_todo) REFERENCES user_todo_book (t_id_ref) ON UPDATE CASCADE ON DELETE CASCADE);
--template | to have fun with*(mac done)
create table todo_context (tr_id_ref INTEGER, join_reviewed_book INTEGER NOT NULL, title text DEFAULT 'UNTITLED', content text NOT NULL, PRIMARY KEY (tr_id_ref ASC), FOREIGN KEY (join_reviewed_book) REFERENCES reviewed_book (rv_id_ref) ON UPDATE CASCADE ON DELETE CASCADE);

--if there is an entry in reviewed_book, there has to be at least on entry in book_read
--waiting

--done | last committed
create table book_read (re_id_ref INTEGER, join_reviewed_book INTEGER NOT NULL, started_read_date DATETIME NOT NULL CHECK(started_read_date <= CURRENT_TIMESTAMP), finished_read_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(finished_read_date <= CURRENT_TIMESTAMP), thoughts text, quicknote text NOT NULL CHECK(quicknote >= 0), PRIMARY KEY (re_id_ref ASC), FOREIGN KEY (join_reviewed_book) REFERENCES reviewed_book (rv_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--template | to have fun with*
create table book_read (re_id_ref INTEGER, join_reviewed_book INTEGER NOT NULL, started_read_date DATETIME, current_page INTEGER DEFAULT NULL CHECK(current_page >= 0), finished_read_date DATETIME, thoughts text, quicknote text CHECK(quicknote >= 0), PRIMARY KEY (re_id_ref ASC), FOREIGN KEY (join_reviewed_book) REFERENCES reviewed_book (rv_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--comments
create table book_read (re_id_ref INTEGER, join_reviewed_book INTEGER NOT NULL, started_read_date DATETIME /*doen't have to be accurate*/, current_page INTEGER DEFAULT 0 CHECK(current_page >= 0), finished_read_date DATETIME /*same goes here*/, thoughts text /*NULL*/, quicknote /*UNSIGNED*/text NOT NULL CHECK(quicknote >= 0), PRIMARY KEY (re_id_ref ASC), FOREIGN KEY (join_reviewed_book) REFERENCES reviewed_book (rv_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT /*should be CASCADE but could use to see stats. how often were which books read*/);
/*
isbn + account.rowid machen auch einen primary key. CHECK?
geht bei t-read auch ein foreign key nicht zu pm sondern zu isbn+a.rowid
in future maybe some kind of shareing id. groups or smth
in future todo:[db] link to this from quotes, excepts, and other stuff i would write in the book if i had my tools, which I probably forgot, otherwise this whole website wouldn't exist
*/

--todo
create table quote (q_id_ref INTEGER, join_read INTEGER NOT NULL DEFAULT 1, join_book INTEGER NOT NULL, content text, note text, chapter text, page_from INTEGER, page_to INTEGER, line_from INTEGER, line_to INTEGER, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), is_public INTEGER NOT NULL CHECK(is_public BETWEEN 0 AND 1), PRIMARY KEY (q_id_ref ASC), FOREIGN KEY (join_read) REFERENCES book_read (re_id_ref) ON UPDATE CASCADE ON DELETE SET DEFAULT, FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--template | to have fun with*macdone
create table quote (q_id_ref INTEGER, join_read INTEGER NOT NULL DEFAULT 1, join_book INTEGER NOT NULL, content text, note text, chapter text, page_from INTEGER, page_to INTEGER, line_from INTEGER, line_to INTEGER, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), is_public INTEGER NOT NULL DEFAULT 0 CHECK(is_public BETWEEN 0 AND 1), PRIMARY KEY (q_id_ref ASC), FOREIGN KEY (join_read) REFERENCES book_read (re_id_ref) ON UPDATE CASCADE ON DELETE SET DEFAULT, FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
/*
quotes können public oder private sein
default ist private, aber wenn man welche public stellt, werden diese auf dem Profil angezeigt.
Es ist wie ein Teil vom Steckbrief: 'My Quotes'
check in code, that at least pages and lines, chapter and lines, or some combi and content is set. not all, but also not just any
todo:[luxus] pages and chapter, have to be in book's bounds
*/

--todo
create table marker (m_id_ref INTEGER, join_quote INTEGER NOT NULL, join_color INTEGER NOT NULL, PRIMARY KEY (m_id_ref ASC), FOREIGN KEY (join_quote) REFERENCES quote (q_id_ref) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (join_color) REFERENCES marker_colors (mc_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--template | to have fun with
create table marker (m_id_ref INTEGER, join_quote INTEGER NOT NULL, join_color INTEGER NOT NULL, PRIMARY KEY (m_id_ref ASC), FOREIGN KEY (join_quote) REFERENCES quote (q_id_ref) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (join_color) REFERENCES marker_colors (mc_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
/*
needs own table to mark one quote with more than on color
*/

--done | last committed
create table review (r_id_ref INTEGER, join_read INTEGER NOT NULL DEFAULT 1, join_book INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), is_public INTEGER NOT NULL CHECK(is_public BETWEEN 0 AND 1), rating INTEGER NOT NULL CHECK(rating BETWEEN 0 AND 5), title text NOT NULL, essay text NOT NULL, tldr text, last_edited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_edited <= CURRENT_TIMESTAMP), PRIMARY KEY (r_id_ref ASC), FOREIGN KEY (join_read) REFERENCES book_read (re_id_ref) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--template | to have fun with
create table review (r_id_ref INTEGER, join_read INTEGER NOT NULL DEFAULT 1, join_book INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), is_public INTEGER NOT NULL CHECK(is_public BETWEEN 0 AND 1), rating INTEGER NOT NULL CHECK(rating BETWEEN 0 AND 5), title text NOT NULL, essay text NOT NULL, tldr text, last_edited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_edited <= CURRENT_TIMESTAMP), PRIMARY KEY (r_id_ref ASC), FOREIGN KEY (join_read) REFERENCES book_read (re_id_ref) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
--comments
create table review (r_id_ref INTEGER, join_read /*programatically defaults to last read for this user on this book. but if no read is set it is to anonymise the reviews and therefore is set to a collection (anonymous) read*/ INTEGER NOT NULL, join_book INTEGER NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(created_at <= CURRENT_TIMESTAMP), is_public INTEGER NOT NULL CHECK(is_public BETWEEN 0 AND 1), rating INTEGER NOT NULL CHECK(rating BETWEEN 0 AND 5) /*rating out of 5*/, title text NOT NULL, essay text /*maybe BLOB depending on nedded effeciency*/ NOT NULL, tldr text, last_edited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK(last_edited <= CURRENT_TIMESTAMP), PRIMARY KEY (r_id_ref ASC), FOREIGN KEY (join_read) REFERENCES book_read (re_id_ref) ON UPDATE CASCADE ON DELETE SET NULL/*if user is deleted, or information should be lost. Deleting reviewedbook is enough*/, FOREIGN KEY (join_book) REFERENCES book (b_id_ref) ON UPDATE CASCADE ON DELETE RESTRICT);
/*
I'd like to delete a read without deleting the reviews -> I need a way to reference the book. ALSO review is worthless without book
-> rather reference Book directly, so user data is not connected and reviews can be anonymous.
the rating out of 5 could get halfes. just check for 0-10 instead of 0-5
the typical quicknote can be stored as an int, varchar would take up unneccessary space.
    enumerations are used in code, for the 'humans' to keep track.
*/
--IDEAS=============================================
create table mapPageToChapter (map_id_ref INTEGER, join_book INTEGER NOT NULL, ...)
--VIEWS=============================================
--these views will late be generated via scripts
create view account_no_pw AS SELECT a_id_ref,loginname,email,last_login,last_logout,created_at from account;

create view ext_full_book AS SELECT b.b_id_ref AS b_b_id_ref, b.isbn AS b_isbn, b.title AS b_title, b.extended_title AS b_extended_title, b.pages AS b_pages, b.chapter AS b_chapter, b.extra_info AS b_extra_info, au.au_id_ref AS au_au_id_ref, au.first_name AS au_first_name, au.last_name AS au_last_name, au.more_legal_names AS au_more_legal_names, au.pseudonym AS au_pseudonym, au.birthday AS au_birthday, pub.pub_id_ref AS pub_pub_id_ref, pub.title AS pub_title, pub.country_of_origin AS pub_country_of_origin, pub.hq_location AS pub_hq_location FROM book b JOIN author au ON au.au_id_ref = b.join_author JOIN publisher pub ON pub.pub_id_ref = b.join_publisher;
create view todo_overview AS SELECT b.title AS b_title, re.started_read_date, re.current_page, b.pages as b_pages, re.re_id_ref, a.a_id_ref as a_a_id_ref FROM book_read re JOIN reviewed_book rv ON rv.rv_id_ref = re.join_reviewed_book JOIN book b ON b.b_id_ref = rv.join_book JOIN account a ON a.a_id_ref = rv.join_book WHERE re.finished_read_date IS NULL OR re.current_page IS NOT NULL;
create view ext_full_reviewed_book AS SELECT rv.rv_id_ref, rv.created_at, rv.first_impression, rv.order_rank, rv.last_updated, b.b_id_ref AS b_b_id_ref, b.isbn AS b_isbn, b.title AS b_title, b.extended_title AS b_extended_title, b.pages AS b_pages, b.chapter AS b_chapter, b.extra_info AS b_extra_info, au.au_id_ref AS au_au_id_ref, au.first_name AS au_first_name, au.last_name AS au_last_name, au.more_legal_names AS au_more_legal_names, au.pseudonym AS au_pseudonym, au.birthday AS au_birthday, pub.pub_id_ref AS pub_pub_id_ref, pub.title AS pub_title, pub.country_of_origin AS pub_country_of_origin, pub.hq_location AS pub_hq_location, a.a_id_ref AS a_a_id_ref FROM reviewed_book rv JOIN book b ON b.b_id_ref = rv.join_book JOIN author au ON au.au_id_ref = b.join_author JOIN publisher pub ON pub.pub_id_ref = b.join_publisher JOIN account a ON a.a_id_ref = rv.join_acc;
create view ext_full_book_read AS SELECT re.re_id_ref, re.started_read_date, re.current_page, re.finished_read_date, re.thoughts, re.quicknote, rv.rv_id_ref AS rv_rv_id_ref, rv.created_at AS rv_created_at, rv.first_impression AS rv_first_impression, rv.order_rank AS rv_order_rank, rv.last_updated AS rv_last_updated, b.b_id_ref AS b_b_id_ref, b.isbn AS b_isbn, b.title AS b_title, b.extended_title AS b_extended_title, b.pages AS b_pages, b.chapter AS b_chapter, b.extra_info AS b_extra_info, au.au_id_ref AS au_au_id_ref, au.first_name AS au_first_name, au.last_name AS au_last_name, au.more_legal_names AS au_more_legal_names, au.pseudonym AS au_pseudonym, au.birthday AS au_birthday, pub.pub_id_ref AS pub_pub_id_ref, pub.title AS pub_title, pub.country_of_origin AS pub_country_of_origin, pub.hq_location AS pub_hq_location, a.a_id_ref AS a_a_id_ref FROM book_read re JOIN reviewed_book rv ON rv.rv_id_ref = re.join_reviewed_book JOIN book b ON b.b_id_ref = rv.join_book JOIN author au ON au.au_id_ref = b.join_author JOIN publisher pub ON pub.pub_id_ref = b.join_publisher JOIN account a ON a.a_id_ref = rv.join_acc;

create view full_quote AS SELECT q_id_ref, content, note, chapter, page_from, page_to, line_from, line_to, created_at, is_public, join_read, join_book from quote;

-- create view full_book_read AS SELECT re_id_ref, started_read_date, current_page, finished_read_date, thoughts, quicknote FROM book_read;
