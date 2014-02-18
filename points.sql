-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 18. Feb 2014 um 14:11
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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
