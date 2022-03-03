import postgres from 'postgres';
-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Reviews'
--
-- ---

DROP TABLE IF EXISTS `Reviews`;

CREATE TABLE `Reviews` (
  `review_id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_id` INTEGER NOT NULL,
  `rating` INTEGER NOT NULL,
  `summary` VARCHAR NOT NULL,
  `recommend` BINARY(1) NULL DEFAULT NULL,
  `response` VARCHAR NULL DEFAULT NULL,
  `body` VARCHAR NULL DEFAULT NULL,
  `date` TIMESTAMP NOT NULL AUTO_INCREMENT,
  `reviewer_name` VARCHAR NOT NULL,
  `helpfulness` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ()
);

-- ---
-- Table 'Photos'
--
-- ---

DROP TABLE IF EXISTS `Photos`;

CREATE TABLE `Photos` (
  `review_id` INT NOT NULL,
  `photo_url` VARCHAR NULL,
  PRIMARY KEY (`review_id`)
);

-- ---
-- Table 'Metadata'
--
-- ---

DROP TABLE IF EXISTS `Metadata`;

CREATE TABLE `Metadata` (
  `product_id` INTEGER NOT NULL,
  `one_star` INTEGER NOT NULL DEFAULT 0,
  `two_stars` INTEGER NOT NULL DEFAULT 0,
  `three_stars` INTEGER NOT NULL DEFAULT 0,
  `four_stars` INTEGER NOT NULL DEFAULT 0,
  `five_stars` INTEGER NOT NULL DEFAULT 0,
  `recommended_true` INTEGER NOT NULL DEFAULT 0,
  `recommended_false` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`product_id`)
);

-- ---
-- Table 'Characteristics'
--
-- ---

DROP TABLE IF EXISTS `Characteristics`;

CREATE TABLE `Characteristics` (
  `characteristic_id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_id` INTEGER NOT NULL,
  `characteristic` VARCHAR NOT NULL,
  `score` DECIMAL NOT NULL DEFAULT 0,
  PRIMARY KEY (`product_id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `Reviews` ADD FOREIGN KEY (review_id) REFERENCES `Photos` (`review_id`);
ALTER TABLE `Metadata` ADD FOREIGN KEY (product_id) REFERENCES `Characteristics` (`product_id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Reviews` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Photos` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Metadata` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Characteristics` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Reviews` (`review_id`,`product_id`,`rating`,`summary`,`recommend`,`response`,`body`,`date`,`reviewer_name`,`helpfulness`) VALUES
-- ('','','','','','','','','','');
-- INSERT INTO `Photos` (`review_id`,`photo_url`) VALUES
-- ('','');
-- INSERT INTO `Metadata` (`product_id`,`one_star`,`two_stars`,`three_stars`,`four_stars`,`five_stars`,`recommended_true`,`recommended_false`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `Characteristics` (`characteristic_id`,`product_id`,`characteristic`,`score`) VALUES
-- ('','','','');