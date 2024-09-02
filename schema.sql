-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema IMAI
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `IMAI` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `IMAI`;

-- -----------------------------------------------------
-- Table `IMAI`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `IMAI`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(300) NULL DEFAULT NULL,
  `name` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `IMAI`.`Role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `IMAI`.`Role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `IMAI`.`UserRole`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `IMAI`.`UserRole` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `roleId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_UserRole_User_idx` (`userId` ASC) VISIBLE,
  INDEX `fk_UserRole_Role_idx` (`roleId` ASC) VISIBLE,
  CONSTRAINT `fk_UserRole_User`
    FOREIGN KEY (`userId`)
    REFERENCES `IMAI`.`User` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserRole_Role`
    FOREIGN KEY (`roleId`)
    REFERENCES `IMAI`.`Role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
