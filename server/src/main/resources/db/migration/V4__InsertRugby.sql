INSERT INTO quizzforall.quiz (id, title, description, category_id, created_by, created_at, updated_at) VALUES (7,'Rugby','Questions Rugby',4,2,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (75,'Quelle est la forme la plus courante de rugby, jouée à quinze joueurs de chaque côté ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (76,'Quel pays a remporté la Coupe du Monde de Rugby 2019 ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (77,'Combien de points vaut un essai au rugby ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (78,'Dans le rugby à XV, combien de remplacements peuvent être effectués pendant un match ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (79,'Quel est le surnom de l''équipe nationale de rugby de la Nouvelle-Zélande ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (80,'Quelle compétition annuelle oppose l''Angleterre, l''Écosse, le pays de Galles, l''Irlande, la France et l''Italie en rugby ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (81,'En rugby, quel est le nom donné à l''action de plaquer un adversaire au sol ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (82,'Combien de mi-temps dure un match de rugby à quinze ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (83,'Quel pays est considéré comme le berceau du rugby ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.question (id, text, quiz_id, created_at, updated_at) VALUES (84,'Quelle est la plus haute compétition de club en rugby, opposant les meilleures équipes d''Europe ?',7,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Rugby à XIII',75,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Rugby à sept',75,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Rugby à douze',75,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Rugby à quinze',75,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Nouvelle-Zélande',76,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Australie',76,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Afrique du Sud',76,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Angleterre',76,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('2 points',77,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('3 points',77,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('4 points',77,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('5 points',77,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Aucun',78,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('3 remplacements',78,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('7 remplacements',78,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Autant que l''équipe le souhaite',78,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Les All Blacks',79,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Les Kangourous',79,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Les Springboks',79,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Les Wallabies',79,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('La Coupe du Monde de Rugby',80,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Le Tournoi des Six Nations',80,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('La Coupe d''Europe de Rugby',80,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('La Coupe du Monde de Rugby à VII',80,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Tackle',81,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Drop goal',81,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Scrum',81,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Maul',81,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('20 minutes',82,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('30 minutes',82,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('40 minutes',82,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('45 minutes',82,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Angleterre',83,1,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Nouvelle-Zélande',83,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('France',83,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Irlande',83,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Coupe du Monde de Rugby',84,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Coupe d''Europe de Rugby (Champions Cup)',84,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Tournoi des Six Nations',84,0,'2023-02-14','2023-02-14');
INSERT INTO quizzforall.answer(text, question_id, is_correct, created_at, updated_at) VALUES ('Coupe du Monde de Rugby à VII',84,0,'2023-02-14','2023-02-14');