--rename author -> join_author und so weiter
--todo:[general o7] create a 'plugin'(?) so that if some one contributes to a repo, they are asked to create a file with a file ending corresponding to their
--  mother tongue (.ger, .eng. pol, .jp, etc).
-- "Please create a file for one mother tongue. We would like everyone to only contribute one language, since this should be a collection not a guest book.
--  it doesn't have to be your main tongue. Again a collection, not guest book. Choose whichever one you want.
--  If your language of choice is already represented, "
/*
Regelen:
1. tabellen die ohne die dazu gehörige Tabelle keinen Sinn ergebnen, müssen mit 'join_..' gekenncheichnet werden.
2. 'join_..' Tabellen sind immer INTEGER NOT NULL, solange ALLE Tabellen rowid Tabellen sind.


ON UPDATE / ON DELETE
SET NULL
SET DEFAULT -> default ? default : NULL
RESTRICT
NO ACTION
CASCADE
*/

--done
create table account (login_name text NOT NULL UNIQUE, pw_digest text NOT NULL, email text UNIQUE, last_login DATETIME CHECK(last_login >= CURRENT_TIMESTAMP), last_logout DATETIME CHECK(last_logout >= CURRENT_TIMESTAMP), created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)

--Aus author, publisher, book sollten eig nie Einträge gelöscht werden
--d. h. werden sie referenziert in foreign keys, ist ON UPDATE CASCADE ON DELETE RESTRICT

--done
create table author (first_name text NOT NULL, last_name text NOT NULL, more_legal_names text, pseudonym text, birthday DATE)

--done
create table publisher (name text NOT NULL UNIQUE, country_of_origin text NOT NULL, hq_location text NOT NULL)

--done
create table book (isbn text NOT NULL UNIQUE, join_author INTEGER NOT NULL, join_publisher INTEGER NOT NULL, title text NOT NULL, extended_title text, extra_info text, FOREIGN KEY (join_author) REFERENCES author (rowid) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_publisher) REFERENCES publisher (rowid) ON UPDATE CASCADE ON DELETE RESTRICT)
/*
todo: store some kind of restriction. Like banned books that are not allowed to be reviewd, although something like that is never a good thing and i cant think of a use case rn
but age restriction maybe in a status 0001 -> fsk etc
*/


--waiting
create table user_todo_book (join_acc INTEGER NOT NULL, join_book INTEGER NOT NULL, started_todo_date DATE /*NULL*/ /*NO DEFAULT*/, finished_todo_date DATE /*CHECK not older than start?*/, FOREIGN KEY (join_acc) REFERENCES account (rowid) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE CASCADE)
/*
calculate progress from start and finish date
1. if not started and not finished -> todo
2. if started and not finished -> in progress
3. if not started and finished -> you are an idiot
4. if started equals finished -> on hold
5. if started and finished -> awaiting review
6. row? what row? ahhh, this guy,- that book,- started then,- just left his review? That guy?!
No, never seen him.
*/

--waiting
create table reviewed_book (join_book INTEGER NOT NULL /*NOT UNIQUE!IMPORTANT!*/, join_acc INTEGER NOT NULL, created_at DATETIME /*yyyy-mm-dd:hh:mm:ss*/NOT NULL DEFAULT CURRENT_TIMESTAMP, first_impression text NOT NULL /*YES, NOT NULL! You will do a first impressino, if you want to or not!ALSO NOT CHANGABLE*/UNIQUE /*YES, UNIQUE! You get the rest.*/, rank /*UNSIGNED*/INTEGER NOT NULL /*NOT UNIQUE. We share*/, last_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT, FOREIGN KEY (join_acc) REFERENCES account (rowid) ON UPDATE CASCADE ON DELETE SET DEFAULT)
go

--waiting
create table book_read (join_reviewed_book INTEGER NOT NULL, started_read_date DATE NOT NULL /*doen't have to be accurate*/, finished_read_at DATE NOT NULL /*same goes here*/, thoughts text /*NULL*/, FOREIGN KEY (join_reviewed_book) REFERENCES reviewed_book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT /*should be CASCADE but could use to see stats. how often were which books read*/)
/*
isbn + account.rowid machen auch einen primary key. CHECK?
geht bei t-read auch ein foreign key nicht zu pm sondern zu isbn+a.rowid
in future maybe some kind of shareing id. groups or smth
in future todo:[db] link to this from quotes, excepts, and other stuff i would write in the book if i had my tools, which I probably forgot, otherwise this whole website wouldn't exist
*/



--waiting
create table review (join_read INTEGER NOT NULL, join_book INTEGER NOT NULL , created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, rating SHORT_INTEGER NOT NULL CHECK(rating BETWEEN 0 AND 5) /*rating out of 5*/, quicknote /*UNSIGNED*/SHORT_INTEGER NOT NULL, title text NOT NULL, essay text /*maybe BLOB depending on nedded effeciency*/ NOT NULL, tldr text NOT NULL, last_edited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (join_read) REFERENCES book_read (rowid) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY (join_book) REFERENCES book (rowid) ON UPDATE CASCADE ON DELETE RESTRICT)
/*
I'd like to delete a read without deleting the reviews -> I need a way to reference the book. ALSO review is worthless without book
-> rather reference Book directly, so user data is not connected and reviews can be anonymous.
the rating out of 5 could get halfes. just check for 0-10 instead of 0-5
the typical quicknote can be stored as an int, varchar would take up unneccessary space.
    enumerations are used in code, for the 'humans' to keep track.
*/
