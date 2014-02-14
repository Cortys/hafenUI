-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 15. Feb 2014 um 00:32
-- Server Version: 5.5.33
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `containerhafen`
--
CREATE DATABASE IF NOT EXISTS `containerhafen` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `containerhafen`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `container`
--

DROP TABLE IF EXISTS `container`;
CREATE TABLE IF NOT EXISTS `container` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET latin1 NOT NULL,
  `manufacturer` int(10) unsigned DEFAULT NULL,
  `rfid` bigint(20) NOT NULL,
  `point` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `manufacturer` (`manufacturer`,`point`,`rfid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
CREATE TABLE IF NOT EXISTS `manufacturers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `maps`
--

DROP TABLE IF EXISTS `maps`;
CREATE TABLE IF NOT EXISTS `maps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `background` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `backgroundRatio` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Daten für Tabelle `maps`
--

INSERT INTO `maps` (`id`, `name`, `background`, `backgroundRatio`) VALUES
(1, 'Lame Lane', 'simpleRound', 1.5),
(2, 'Wheezy Ways', 'complexRound', 1.5);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `points`
--

DROP TABLE IF EXISTS `points`;
CREATE TABLE IF NOT EXISTS `points` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `map` int(10) unsigned NOT NULL,
  `x` int(10) unsigned NOT NULL,
  `y` int(10) unsigned NOT NULL,
  `type` int(10) unsigned NOT NULL,
  `code` int(11) NOT NULL,
  `name` char(1) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `map` (`map`,`type`),
  KEY `code` (`code`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

--
-- Daten für Tabelle `points`
--

INSERT INTO `points` (`id`, `map`, `x`, `y`, `type`, `code`, `name`) VALUES
(1, 1, 333, 100, 1, 0, 'A'),
(2, 1, 666, 100, 2, 0, 'B'),
(3, 1, 666, 900, 2, 0, 'E'),
(4, 1, 333, 900, 2, 0, 'F'),
(5, 1, 902, 300, 1, 0, 'C'),
(6, 1, 902, 700, 1, 0, 'D'),
(7, 1, 98, 700, 1, 0, 'G'),
(8, 1, 98, 300, 2, 0, 'H');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `robots`
--

DROP TABLE IF EXISTS `robots`;
CREATE TABLE IF NOT EXISTS `robots` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET latin1 NOT NULL,
  `picture` varchar(50) CHARACTER SET latin1 NOT NULL DEFAULT 'defaultRobot',
  `bluetooth` bit(48) NOT NULL,
  `turn` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`bluetooth`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=8 ;

--
-- Daten für Tabelle `robots`
--

INSERT INTO `robots` (`id`, `name`, `picture`, `bluetooth`, `turn`) VALUES
(1, 'Heinrich', 'cat', b'111010000000011010001000001111101110101101101111', NULL),
(2, 'Henriette', 'owl', b'000000000000000000000000000000000000000000000000', NULL),
(3, 'Harald', 'hedgedog', b'000000000000000000000000000000000000000000000000', NULL),
(4, 'Hildegard', 'penguin', b'000000000000000000000000000000000000000000000000', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `turns`
--

DROP TABLE IF EXISTS `turns`;
CREATE TABLE IF NOT EXISTS `turns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lastPoint` int(10) unsigned NOT NULL,
  `currentPoint` int(10) unsigned NOT NULL,
  `nextPoint` int(10) unsigned NOT NULL,
  `direction` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lastPoint` (`lastPoint`,`currentPoint`,`nextPoint`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
