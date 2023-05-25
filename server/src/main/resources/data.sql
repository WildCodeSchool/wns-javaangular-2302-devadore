INSERT INTO quizzforall.role (id, name) VALUES (1, 'ADMIN');
INSERT INTO quizzforall.role (id, name) VALUES (2, 'USER');


INSERT INTO quizzforall.user (id, username, email, password, avatar, score, created_at, updated_at) VALUES (1, 'lateam', 'lateam@wcs.com', '$2a$10$b3cbsotI.60ddyK4EhaWa.7G2aKjRrdXx3kc7K5RmxYfWq50FqEm6', '/assets/images/defaultAvatars/guerrier (Personnalisé).png', 600, '2022-01-01', '2022-01-01');
INSERT INTO quizzforall.user (id, username, email, password, avatar, score, created_at, updated_at) VALUES (2, 'momoLesRouflaquettes', 'momo@mail.com', '$2a$10$e2Q9PgIvuN4nEZKvE/tjJeZQr5pjT.Vze2YX4CZRgVatIiBV06Q/6', '/assets/images/defaultAvatars/mago (Personnalisé).png', 500, '2022-01-02', '2022-01-02');
INSERT INTO quizzforall.user (id, username, email, password, avatar, score, created_at, updated_at) VALUES (3, 'freddy', 'freddy@mail.com', '$2a$10$GznzWo9AlOLbDvbLcSDX0OM6dIsug6FcZ8S4.d2EQP2fKn4wJXw2e', '/assets/images/defaultAvatars/rodeur (Personnalisé).png', 400, '2022-01-03', '2022-01-03');
INSERT INTO quizzforall.user (id, username, email, password, avatar, score, created_at, updated_at) VALUES (4, 'yuyu', 'yu@mail.com', '$2a$10$dW99jDD36hhKoxZxkAkwauyfAVl61mEZfRpP57vITR66qHYu3dNqC', '/assets/images/defaultAvatars/rodeur (Personnalisé).png', 700, null, null);


INSERT INTO quizzforall.user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO quizzforall.user_roles (user_id, role_id) VALUES (2, 2);
INSERT INTO quizzforall.user_roles (user_id, role_id) VALUES (3, 2);
INSERT INTO quizzforall.user_roles (user_id, role_id) VALUES (4, 2);


INSERT INTO quizzforall.categorie (id, name, description, created_at, updated_at) VALUES (1, 'Science', 'Questions related to science and scientific concepts', '2022-01-01', '2022-01-01');
INSERT INTO quizzforall.categorie (id, name, description, created_at, updated_at) VALUES (2, 'Geography', 'Questions related to geography and world regions', '2022-01-02', '2022-01-02');
INSERT INTO quizzforall.categorie (id, name, description, created_at, updated_at) VALUES (3, 'History', 'Questions related to historical events and figures', '2022-01-03', '2022-01-03');


INSERT INTO quizzforall.quiz (id, title, description, category_id, created_by, created_at, updated_at) VALUES (1, 'Science Quiz 1', 'A quiz about general science concepts', 1, 1, '2022-01-01', '2022-01-01');
INSERT INTO quizzforall.quiz (id, title, description, category_id, created_by, created_at, updated_at) VALUES (2, 'Geography Quiz 1', 'A quiz about world geography', 2, 2, '2022-01-02', '2022-01-02');
INSERT INTO quizzforall.quiz (id, title, description, category_id, created_by, created_at, updated_at) VALUES (3, 'History Quiz 1', 'A quiz about historical events and figures', 3, 3, '2022-01-03', '2022-01-03');


INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (1, 'What is the chemical symbol for water?', 1, '2022-01-01', '2022-01-01');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (2, 'What is the capital of Australia?', 2, '2022-01-02', '2022-01-02');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (3, 'Who was the first president of the United States?', 3, '2022-01-03', '2022-01-03');


INSERT INTO quizzforall.answer (id, text, question_id, is_correct, created_at, updated_at) VALUES (1, 'H2O', 1, 1, '2022-01-01', '2022-01-01');
INSERT INTO quizzforall.answer (id, text, question_id, is_correct, created_at, updated_at) VALUES (2, 'Sydney', 2, 1, '2022-01-02', '2022-01-02');
INSERT INTO quizzforall.answer (id, text, question_id, is_correct, created_at, updated_at) VALUES (3, 'George Washington', 3, 1, '2022-01-03', '2022-01-03');
INSERT INTO quizzforall.answer (id, text, question_id, is_correct, created_at, updated_at) VALUES (4, 'Oxygen', 1, 0, '2022-01-01', '2022-01-01');
INSERT INTO quizzforall.answer (id, text, question_id, is_correct, created_at, updated_at) VALUES (5, 'Melbourne', 2, 0, '2022-01-02', '2022-01-02');
INSERT INTO quizzforall.answer (id, text, question_id, is_correct, created_at, updated_at) VALUES (6, 'Thomas Jefferson', 3, 0, '2022-01-03', '2022-01-03');
