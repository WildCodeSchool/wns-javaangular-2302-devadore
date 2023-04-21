-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema quizz4all
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema quizz4all
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `quizz4all` DEFAULT CHARACTER SET utf8 ;
USE `quizz4all` ;

-- -----------------------------------------------------
-- Table `quizz4all`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`role` (
                                                  `id` INT NOT NULL AUTO_INCREMENT,
                                                  `role` VARCHAR(45) NULL,
    PRIMARY KEY (`id`))
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`quiz-room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`quiz-room` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `pin` INT(6) NULL,
    `status` TINYINT(1) NULL DEFAULT 0,
    `user_create_quiz_play` TINYINT(1) NULL DEFAULT 0,
    `startAt` DATETIME NULL,
    `endAt` DATETIME NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `pin_UNIQUE` (`pin` ASC) VISIBLE)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`answer` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `content_answer` TEXT NULL DEFAULT NULL,
    `correct` TINYINT(1) NULL DEFAULT 1,
    PRIMARY KEY (`id`))
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`question` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(45) NOT NULL,
    `content` TEXT NULL DEFAULT NULL,
    `image` VARCHAR(255) NULL,
    `answer_id` BIGINT(20) NOT NULL,
    `timer` INT(100) NULL,
    PRIMARY KEY (`id`, `answer_id`),
    INDEX `fk_question_answer1_idx` (`answer_id` ASC) VISIBLE,
    CONSTRAINT `fk_question_answer1`
    FOREIGN KEY (`answer_id`)
    REFERENCES `quizz4all`.`answer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`quiz`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`quiz` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NULL,
    `question_id` BIGINT(20) NOT NULL,
    `quiz-room_id` BIGINT(20) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `update_at` DATETIME NULL,
    PRIMARY KEY (`id`, `question_id`, `quiz-room_id`),
    INDEX `fk_quiz_question1_idx` (`question_id` ASC) VISIBLE,
    INDEX `fk_quiz_quiz-room1_idx` (`quiz-room_id` ASC) VISIBLE,
    CONSTRAINT `fk_quiz_question1`
    FOREIGN KEY (`question_id`)
    REFERENCES `quizz4all`.`question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_quiz_quiz-room1`
    FOREIGN KEY (`quiz-room_id`)
    REFERENCES `quizz4all`.`quiz-room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`user` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(45) NULL,
    `lastname` VARCHAR(45) NULL,
    `birthdate` DATETIME NOT NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `role_id` INT NOT NULL,
    `quiz-room_id` BIGINT(20) NOT NULL,
    `quiz_id` BIGINT(20) NOT NULL,
    PRIMARY KEY (`id`, `role_id`, `quiz-room_id`, `quiz_id`),
    INDEX `fk_user_role_idx` (`role_id` ASC) VISIBLE,
    INDEX `fk_user_quiz-room1_idx` (`quiz-room_id` ASC) VISIBLE,
    INDEX `fk_user_quiz1_idx` (`quiz_id` ASC) VISIBLE,
    CONSTRAINT `fk_user_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `quizz4all`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_user_quiz-room1`
    FOREIGN KEY (`quiz-room_id`)
    REFERENCES `quizz4all`.`quiz-room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_user_quiz1`
    FOREIGN KEY (`quiz_id`)
    REFERENCES `quizz4all`.`quiz` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`categorie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`categorie` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    PRIMARY KEY (`id`))
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`user_has_quiz-room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`user_has_quiz-room` (
    `user_id` BIGINT(20) NOT NULL,
    `user_role_id` INT NOT NULL,
    `user_quiz-room_id` BIGINT(20) NOT NULL,
    `user_quiz_id` BIGINT(20) NOT NULL,
    `quiz-room_id` BIGINT(20) NOT NULL,
    PRIMARY KEY (`user_id`, `user_role_id`, `user_quiz-room_id`, `user_quiz_id`, `quiz-room_id`),
    INDEX `fk_user_has_quiz-room_quiz-room1_idx` (`quiz-room_id` ASC) VISIBLE,
    INDEX `fk_user_has_quiz-room_user1_idx` (`user_id` ASC, `user_role_id` ASC, `user_quiz-room_id` ASC, `user_quiz_id` ASC) VISIBLE,
    CONSTRAINT `fk_user_has_quiz-room_user1`
    FOREIGN KEY (`user_id` , `user_role_id` , `user_quiz-room_id` , `user_quiz_id`)
    REFERENCES `quizz4all`.`user` (`id` , `role_id` , `quiz-room_id` , `quiz_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_user_has_quiz-room_quiz-room1`
    FOREIGN KEY (`quiz-room_id`)
    REFERENCES `quizz4all`.`quiz-room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `quizz4all`.`categorie_has_quiz`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quizz4all`.`categorie_has_quiz` (
    `categorie_id` BIGINT(20) NOT NULL,
    `quiz_id` BIGINT(20) NOT NULL,
    `quiz_question_id` BIGINT(20) NOT NULL,
    `quiz_quiz-room_id` BIGINT(20) NOT NULL,
    PRIMARY KEY (`categorie_id`, `quiz_id`, `quiz_question_id`, `quiz_quiz-room_id`),
    INDEX `fk_categorie_has_quiz_quiz1_idx` (`quiz_id` ASC, `quiz_question_id` ASC, `quiz_quiz-room_id` ASC) VISIBLE,
    INDEX `fk_categorie_has_quiz_categorie1_idx` (`categorie_id` ASC) VISIBLE,
    CONSTRAINT `fk_categorie_has_quiz_categorie1`
    FOREIGN KEY (`categorie_id`)
    REFERENCES `quizz4all`.`categorie` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_categorie_has_quiz_quiz1`
    FOREIGN KEY (`quiz_id` , `quiz_question_id` , `quiz_quiz-room_id`)
    REFERENCES `quizz4all`.`quiz` (`id` , `question_id` , `quiz-room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
