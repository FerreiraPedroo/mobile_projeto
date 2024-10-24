-- MySQL Script generated by MySQL Workbench
-- Fri Sep 13 19:47:44 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mobil
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mobil
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mobil` DEFAULT CHARACTER SET utf8 ;
USE `mobil` ;

-- -----------------------------------------------------
-- Table `mobil`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mobil`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `user_type` VARCHAR(45) NULL,
  `driver_id` INT NULL,
  `token` LONGTEXT NULL,
`recovery_password` VARCHAR(128) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `mobil`.`route`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mobil`.`route` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  `photo` VARCHAR(128) NULL,
  `day` VARCHAR(90) NOT NULL,
  `start_time` VARCHAR(90) NULL DEFAULT NULL ,
  `end_time` VARCHAR(90) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mobil`.`point`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mobil`.`point` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(90) NOT NULL,
  `maps` VARCHAR(45) NULL,
  `photo` VARCHAR(128) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
COMMENT = '							';


-- -----------------------------------------------------
-- Table `mobil`.`route_points`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mobil`.`route_points` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `route_id` INT NOT NULL,
  `point_id` INT NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mobil`.`responsable_passager`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mobil`.`passager` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_responsable_id` INT NOT NULL,
  `name` VARCHAR(90) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `route`.`passager`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mobil`.`route_passagers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `passager_id` INT NOT NULL,
  `route_id` INT NOT NULL,
  `boarding_point_id` INT NULL,
  `landing_point_id` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
