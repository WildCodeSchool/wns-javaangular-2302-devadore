/*LES INSERT DANS CETTE ORDRE POUR EVITER LES CONTRAINTES FK ... VERIFIER QUE LES ID CORRESPONDENT*/


/*ROLE TABLE*/
INSERT INTO `quizz4all`.`role` (`role`) VALUES
    ('admin'),
    ('user'),
    ('anonymous');

/*CATEGORIE TABLE*/
INSERT INTO quizz4all.categorie (name) VALUES
    ('Géographie'),
    ('Sports'),
    ('IT');
/*ANSWER TABLE*/
INSERT INTO `quizz4all`.`answer` (`content_answer`, `correct`) VALUES
    ('Paris', 1),
    ('Tokyo', 0),
    ('New York', 0),
    ('Python', 1),
    ('Java', 0),
    ('C++', 0),
    ('2023', 1),
    ('2024', 0),
    ('2025', 0);

/*QUESTION TABLE*/
INSERT INTO `quizz4all`.`question` (`type`, `content`, `image`, `answer_id`, `timer`) VALUES
    ('Choix unique', 'Quelle est la capitale de la France ?', NULL, 1, 5),
    ('Choix unique', 'Quel est le langage de programmation le plus populaire ?', NULL, 4, 5),
    ('Choix unique', 'En quelle année aura lieu la prochaine Coupe du monde ?', NULL, 7, 15);

/*QUIZ TABLE*/
INSERT INTO `quizz4all`.`quiz` (`title`, `question_id`, `quiz_room_id`, `created_at`) VALUES
    ('Capitales mondiales', 1, 1, '2023-05-01 08:30:00'),
    ('Langages de programmation', 2, 2, '2023-05-01 09:30:00'),
    ('Sport aléatoire', 3, 3, '2023-05-02 12:30:00');

/*QUIZ ROOM TABLE*/
INSERT INTO `quizz4all`.`quiz_room` (`pin`, `status`, `user_create_quiz_play`, `startAt`, `endAt`) VALUES
    (123456, 'active', 1, '2023-05-01 09:00:00', '2023-05-01 10:00:00'),
    (654321, 'inactive', 0, '2023-05-02 13:00:00', '2023-05-02 14:00:00'),
    (111222, 'active', 1, '2023-05-03 11:00:00', '2023-05-03 12:00:00');

/*USER TABLE*/
INSERT INTO `user` (`firstname`, `lastname`, `birthdate`, `email`, `password`, `avatar`, `role_id`, `quiz_room_id`, `quiz_id`, `score`) VALUES
    ('Admin', 'Admin', '1990-05-21 00:00:00', 'admin@gmail.com', 'admin', 'https://example.com/avatar1.jpg', 1, 1, 1, 954),
    ('User1', 'User1', '1995-09-12 00:00:00', 'user1@yahoo.com', 'user1', 'https://example.com/avatar2.jpg', 2, 2, 2, 978),
    ('User2', 'User2', '1987-11-02 00:00:00', 'user2@hotmail.com', 'user2', 'https://example.com/avatar3.jpg', 2, 1, 2, 1045);