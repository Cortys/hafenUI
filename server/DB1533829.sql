-- phpMyAdmin SQL Dump
-- version 4.0.5
-- http://www.phpmyadmin.net
--
-- Host: rdbms
-- Erstellungszeit: 14. Jan 2014 um 13:50
-- Server Version: 5.5.31-log
-- PHP-Version: 5.2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `DB1533829`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `container`
--

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
-- Tabellenstruktur für Tabelle `directions`
--

CREATE TABLE IF NOT EXISTS `directions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `short` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `picture` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- Daten für Tabelle `directions`
--

INSERT INTO `directions` (`id`, `description`, `short`, `picture`) VALUES
(1, 'turn left', 'l', 'left'),
(2, 'turn right', 'r', 'right'),
(3, 'turn back', 'b', 'back'),
(4, 'go forward', 'f', 'forward');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `manufacturers`
--

CREATE TABLE IF NOT EXISTS `manufacturers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `maps`
--

CREATE TABLE IF NOT EXISTS `maps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `points`
--

CREATE TABLE IF NOT EXISTS `points` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `map` int(10) unsigned NOT NULL,
  `x` int(10) unsigned NOT NULL,
  `y` int(10) unsigned NOT NULL,
  `type` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `map` (`map`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `robots`
--

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
(1, 'Heinrich', 'defaultRobot', b'111010000000011010001000001111101110101101101111', NULL),
(2, 'Henriette', 'defaultRobot', b'000000000000000000000000000000000000000000000000', NULL),
(3, 'Harald', 'defaultRobot', b'000000000000000000000000000000000000000000000000', NULL),
(4, 'Hildegard', 'defaultRobot', b'000000000000000000000000000000000000000000000000', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `turns`
--

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