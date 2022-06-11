create table if not exists users
(
    id          int auto_increment,
    first_name  text not null,
    last_name text not null,
    age         int not null,
    email       text not null,
    password    text not null,
    constraint users_pk primary key (id)
);

create unique index users_id_uindex on users (id);

create table if not exists roles
(
    id        int auto_increment,
    role_name text not null,
    constraint roles_pk primary key (id)
);

create unique index roles_id_uindex on roles (id);

create table if not exists user_role
(
    user_id int not null,
    role_id int not null,
    constraint user_role_pk primary key (user_id, role_id),
    constraint user_role_roles_id_fk
        foreign key (role_id) references roles (id),
    constraint user_role_users_id_fk
        foreign key (user_id) references users (id)
);

