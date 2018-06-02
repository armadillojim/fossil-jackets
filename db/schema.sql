-- create database "fossil-jackets" encoding 'UTF8' lc_collate 'en_US.utf8' lc_ctype 'en_US.utf8';

drop table if exists photos;
drop table if exists jackets;
drop table if exists users;

create table users (
    uid serial4 primary key,
    fullName varchar(256) not null,
    email varchar(256) not null,
    issued int8 not null,
    revoked int8,
    token char(24) not null
);

create table jackets (
    jid serial4 primary key,
    uid int4 not null references users(uid),
    expedition varchar(256) not null,
    jacketNumber varchar(256) not null,
    created int8 not null,
    locality varchar(256),
    lat float8,
    lng float8,
    formation varchar(256),
    specimenType varchar(256),
    personnel varchar(256),
    notes varchar(1024),
    tagVersion int2,
    tidA uuid,
    tidB uuid,
    hmac char(44) not null,
    seeAlso int4 references jackets(jid)
);

create table photos (
    pid serial primary key,
    jid int4 not null references jackets(jid),
    uri varchar(1024) not null,
    thumb varchar(1024) not null
);

-- Indexes for queries

-- Join photos to jackets
create index photos_jid_index on photos using hash (jid);
-- Select jacket from tag scan
create index jackets_tidA_index on jackets using hash (tidA);
create index jackets_tidB_index on jackets using hash (tidB);
-- Sort jackets by creation timestamp
create index jackets_created_index on jackets (created);
-- Filter jackets by expedition
create index jackets_expedition_index on jackets using hash (expedition);
