CREATE TABLE IF NOT EXISTS vote_count (
    id SERIAL PRIMARY KEY,
    art1 INTEGER,
    art2 INTEGER
);
INSERT INTO vote_count(art1,art2) VALUES (0,0);