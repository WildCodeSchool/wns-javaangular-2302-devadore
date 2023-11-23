-- Création des tables
CREATE TABLE category
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT         NULL,
    created_at  DATE         NULL,
    updated_at  DATE         NULL
);

CREATE TABLE role
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(255)  NOT NULL,
    email      VARCHAR(255)  NOT NULL,
    password   VARCHAR(255)  NOT NULL,
    score      INT DEFAULT 0 NULL,
    created_at DATE          NULL,
    updated_at DATE          NULL
);

CREATE TABLE quiz
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT         NULL,
    category_id INT          NULL,
    created_by  INT          NULL,
    created_at  DATE         NULL,
    updated_at  DATE         NULL
);

CREATE TABLE question
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    text       TEXT NOT NULL,
    quiz_id    INT  NULL,
    created_at DATE NULL,
    updated_at DATE NULL
);

CREATE TABLE answer
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    text        TEXT       NOT NULL,
    question_id INT        NULL,
    is_correct  TINYINT(1) NOT NULL,
    created_at  DATE       NULL,
    updated_at  DATE       NULL
);

CREATE TABLE user_roles
(
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE images
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    image       MEDIUMBLOB   NULL,
    mime_type   VARCHAR(255) NULL,
    name        VARCHAR(255) NULL,
    user_id     INT          NULL,
    quiz_id     INT          NULL,
    question_id INT          NULL
);

create table quiz_attempt
(
    id                int auto_increment primary key,
    user_id           int           not null,
    quiz_id           int           not null,
    score_points      int default 0 not null,
    correct_answers   int default 0 not null,
    incorrect_answers int default 0 not null,
    start_time        date          not null,
    end_time          date,
    total_time_spent  int
);


-- Indexes
CREATE INDEX question_id ON answer (question_id);
CREATE INDEX quiz_id ON question (quiz_id);
CREATE INDEX category_id ON quiz (category_id);
CREATE INDEX created_by ON quiz (created_by);

-- Contraintes de clé étrangère
ALTER TABLE quiz
    ADD CONSTRAINT quiz_ibfk_1 FOREIGN KEY (category_id) REFERENCES category (id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE quiz
    ADD CONSTRAINT quiz_ibfk_2 FOREIGN KEY (created_by) REFERENCES user (id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE question
    ADD CONSTRAINT question_ibfk_1 FOREIGN KEY (quiz_id) REFERENCES quiz (id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE answer
    ADD CONSTRAINT answer_ibfk_1 FOREIGN KEY (question_id) REFERENCES question (id);
ALTER TABLE user_roles
    ADD CONSTRAINT user_roles_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE CASCADE;
ALTER TABLE user_roles
    ADD CONSTRAINT user_roles_ibfk_2 FOREIGN KEY (role_id) REFERENCES role (id) ON UPDATE CASCADE;
ALTER TABLE images
    ADD CONSTRAINT FK_fccua10sh2240kfshte8bkbpt FOREIGN KEY (user_id) REFERENCES user (id);
ALTER TABLE images
    ADD CONSTRAINT FK_1q6j2w8hj0y8f8i1j6qy5t5k4 FOREIGN KEY (quiz_id) REFERENCES quiz (id);
ALTER TABLE images
    ADD CONSTRAINT FK_1q6j2w8hj0y8f8i1j6qy5t5k3 FOREIGN KEY (question_id) REFERENCES question (id);
alter table quiz_attempt
    add constraint FK_quiz_attempt_user foreign key (user_id) references user (id) on update cascade on delete cascade;
alter table quiz_attempt
    add constraint FK_quiz_attempt_quiz foreign key (quiz_id) references quiz (id) on update cascade on delete cascade;
