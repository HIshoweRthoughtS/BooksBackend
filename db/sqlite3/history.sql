
--table in question
create table marker_colors (mc_id_ref INTEGER, color_name text NOT NULL, color_code INTEGER NOT NULL DEFAULT mc_id_ref, meaning text NOT NULL, PRIMARY KEY (mc_id_ref ASC));
--values
INSERT INTO marker_colors (color_name,color_code,meaning) VALUES ('yellow',1,'note'), ('green',2,'well written'), ('orange',3,'quotable'), ('blue',4,'external interact'), ('purple',5,'personel'), ('pink',6,'high');

INSERT INTO book (isbn,join_author,join_publisher,title) VALUES ('test',1.0,1.0,'test');
INSERT INTO book (isbn,join_author,join_publisher,title) VALUES ('1',2.0,5.0,'Frankenstein');
INSERT INTO book (isbn,join_author,join_publisher,title) VALUES ('2',3.0,3.0,'Fahrenheit');
INSERT INTO book (isbn,join_author,join_publisher,title) VALUES ('3',6.0,1.0,'Cafe');
INSERT INTO book (isbn,join_author,join_publisher,title) VALUES ('4',7.0,6.0,'Winner');
