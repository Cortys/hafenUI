-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 23. Feb 2014 um 02:12
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
  KEY `code` (`code`),
  KEY `map` (`map`),
  KEY `type` (`type`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

--
-- Daten für Tabelle `points`
--

INSERT INTO `points` (`id`, `map`, `x`, `y`, `type`, `code`, `name`) VALUES
(1, 1, 333, 100, 1, 1, 'A'),
(2, 1, 666, 100, 2, 2, 'B'),
(3, 1, 666, 900, 2, 5, 'E'),
(4, 1, 333, 900, 2, 6, 'F'),
(5, 1, 902, 300, 1, 3, 'C'),
(6, 1, 902, 700, 1, 4, 'D'),
(7, 1, 98, 700, 1, 7, 'G'),
(8, 1, 98, 300, 2, 8, 'H');

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`bluetooth`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=8 ;

--
-- Daten für Tabelle `robots`
--

INSERT INTO `robots` (`id`, `name`, `picture`, `bluetooth`) VALUES
(1, 'Heinrich', 'cat', b'111010000000011010001000001111101110101101101111'),
(2, 'Henriette', 'owl', b'000000000000000000000000000000000000000000000000'),
(3, 'Harald', 'hedgedog', b'000000000000000000000000000000000000000000000000'),
(4, 'Hildegard', 'penguin', b'000000000000000000000000000000000000000000000000');

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
  `direction` enum('forward','left','right','turn') COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lastPoint` (`lastPoint`,`currentPoint`,`nextPoint`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=33 ;

--
-- Daten für Tabelle `turns`
--

INSERT INTO `turns` (`id`, `lastPoint`, `currentPoint`, `nextPoint`, `direction`) VALUES
(1, 8, 1, 2, 'forward'),
(2, 1, 2, 5, 'forward'),
(3, 2, 5, 6, 'forward'),
(4, 5, 6, 3, 'forward'),
(5, 6, 3, 4, 'forward'),
(6, 3, 4, 7, 'forward'),
(7, 4, 7, 8, 'forward'),
(8, 7, 8, 1, 'forward'),
(9, 1, 8, 7, 'forward'),
(10, 8, 7, 4, 'forward'),
(11, 7, 4, 3, 'forward'),
(12, 4, 3, 6, 'forward'),
(13, 3, 6, 5, 'forward'),
(14, 6, 5, 2, 'forward'),
(15, 5, 2, 1, 'forward'),
(16, 2, 1, 8, 'forward'),
(17, 1, 2, 1, 'turn'),
(18, 2, 5, 2, 'turn'),
(19, 5, 6, 5, 'turn'),
(20, 6, 3, 6, 'turn'),
(21, 3, 4, 3, 'turn'),
(22, 4, 7, 4, 'turn'),
(23, 7, 8, 7, 'turn'),
(24, 8, 1, 8, 'turn'),
(25, 1, 8, 1, 'turn'),
(26, 2, 1, 2, 'turn'),
(27, 5, 2, 5, 'turn'),
(28, 6, 5, 6, 'turn'),
(29, 3, 6, 3, 'turn'),
(30, 4, 3, 4, 'turn'),
(31, 7, 4, 7, 'turn'),
(32, 8, 7, 8, 'turn');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
