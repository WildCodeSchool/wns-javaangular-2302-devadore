create table categorie
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null,
    created_at  date         null,
    updated_at  date         null,
    constraint name
        unique (name)
);

create table role
(
    id   int auto_increment
        primary key,
    name varchar(255) not null,
    constraint name
        unique (name)
);

create table user
(
    id         int auto_increment
        primary key,
    username   varchar(255)  not null,
    email      varchar(255)  not null,
    password   varchar(255)  not null,
    avatar     varchar(255)  null,
    score      int default 0 null,
    created_at date          null,
    updated_at date          null,
    constraint email
        unique (email),
    constraint username
        unique (username)
);

create table quiz
(
    id          int auto_increment
        primary key,
    title       varchar(255) not null,
    description text         null,
    category_id int          null,
    created_by  int          null,
    created_at  date         null,
    updated_at  date         null,
    constraint quiz_ibfk_1
        foreign key (category_id) references categorie (id)
            on update cascade on delete cascade,
    constraint quiz_ibfk_2
        foreign key (created_by) references user (id)
            on update cascade on delete cascade
);

create table question
(
    id         int auto_increment
        primary key,
    text       text not null,
    quiz_id    int  null,
    created_at date null,
    updated_at date null,
    constraint question_ibfk_1
        foreign key (quiz_id) references quiz (id)
            on update cascade on delete cascade
);

create table answer
(
    id          int auto_increment
        primary key,
    text        text       not null,
    question_id int        null,
    is_correct  tinyint(1) not null,
    created_at  date       null,
    updated_at  date       null,
    constraint answer_ibfk_1
        foreign key (question_id) references question (id)
);

create index question_id
    on answer (question_id);

create index quiz_id
    on question (quiz_id);

create index category_id
    on quiz (category_id);

create index created_by
    on quiz (created_by);

create table user_roles
(
    user_id int not null,
    role_id int not null,
    primary key (user_id, role_id),
    constraint user_roles_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade,
    constraint user_roles_ibfk_2
        foreign key (role_id) references role (id)
            on update cascade
);


