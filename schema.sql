create database pizzavala;
use pizzavala;

-- table

-- status: 0: non-active, 2: activated, 1: suspended
create table user (id integer primary key auto_increment, firstName varchar(20), lastName varchar(20), email varchar(50), password varchar(100), phone varchar(20), status integer default 0, created_on timestamp default CURRENT_TIMESTAMP);
create table user_address(id integer primary key auto_increment, title varchar(100), userId integer, line1 varchar(100), line2 varchar(100), city varchar(100), state varchar(100), zipCode integer, created_on timestamp default CURRENT_TIMESTAMP);

create table admins (id integer primary key auto_increment, firstName varchar(20), lastName varchar(20), email varchar(50), password varchar(100), phone varchar(20), created_on timestamp default CURRENT_TIMESTAMP);
insert into admins (firstName, lastName, email, password, phone) values ('admin', 'admin', 'admin@pizzavala.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', '+912342324');

create table category (id integer primary key auto_increment, title varchar(100), description varchar(1000), created_on timestamp default CURRENT_TIMESTAMP);
create table pizza (id integer primary key auto_increment, title varchar(100), description varchar(1000), price float, categoryId integer, imageFile varchar(100), created_on timestamp default CURRENT_TIMESTAMP);
create table pizzaReviews (id integer primary key auto_increment, pizzaId integer, userId integer, rating float, review varchar(1024), created_on timestamp default CURRENT_TIMESTAMP);

create table cart (id integer primary key auto_increment, userId integer, pizzaId integer, price float, quantity float, created_on timestamp default CURRENT_TIMESTAMP);

-- orderState: 1: confirmed, 2: in packaging, 3: dispatched, 4: out_for_delivery, 5: delivered, 6: cancelled
create table userOrder (id integer primary key auto_increment, userId integer, placedOn date, orderState integer default 1, orderComments varchar(1024), totalAmount float, addressId integer, created_on timestamp default CURRENT_TIMESTAMP);
create table userOrderDetails (id integer primary key auto_increment, orderId integer, pizzaId integer, price float, quantity float, totalAmount float, created_on timestamp default CURRENT_TIMESTAMP);

alter table user add column activationToken varchar(100);
alter table user add column active int(1) default 0;

alter table admins add column job_role varchar(20);
update admins set job_role = 'admin' where email = 'admin@pizzavala.com';
insert into admins (firstName, lastName, email, password, phone, job_role) values ('d_boy', 'd_boy', 'd_boy@pizzavala.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', '+914565465', 'delivery_boy');

