-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: bug_tracker
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `issues`
--

DROP TABLE IF EXISTS `issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issues` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `issue_title` varchar(100) NOT NULL,
  `issue_description` text NOT NULL,
  `reported_by` int NOT NULL,
  `status` varchar(20) NOT NULL,
  `priority` varchar(20) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `assigned_to` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`issue_id`),
  KEY `reported_by` (`reported_by`),
  KEY `issues_ibfk_3` (`project_id`),
  CONSTRAINT `issues_ibfk_1` FOREIGN KEY (`reported_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `issues_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issues`
--

LOCK TABLES `issues` WRITE;
/*!40000 ALTER TABLE `issues` DISABLE KEYS */;
INSERT INTO `issues` VALUES (3,1,'There is no commerce','Since this is not an app there is no commerce whatsoever!',4,'resolved','none','2023-04-20 16:12:16','2023-04-20 16:12:16','8,9'),(5,1,'There is missing food!','The food I brought to work is gone!',4,'pending','medium','2023-04-20 16:12:16','2023-04-20 16:16:36','7,8,9'),(6,2,'What mobile app? ','I did not know that I was working on a mobile app!!!',4,'pending','medium','2023-04-20 16:25:39','2023-04-20 16:25:39','9'),(7,13,'I can own the internet?','I feel like I can own the internet but I do not want to',4,'pending','low','2022-01-15 09:30:00','2023-04-20 16:34:36','3'),(8,1,'first buy','they bought the first product and it was an awful experience!',4,'pending','low','2023-04-20 16:12:16','2023-04-20 16:43:00','9'),(9,2,'We still make those?','didn\'t they make themselves or by AI?',4,'pending','high','2023-04-20 16:25:39','2023-04-20 17:03:11','8'),(10,13,'the net','I believe the net and inter net are the same thing',4,'pending','high','2022-01-15 09:30:00','2023-04-21 15:49:07','8'),(11,13,'can we delete?','I want to delete it!',4,'resolved','none','2022-01-15 09:30:00','2023-04-21 16:55:34',''),(12,2,'blue sort test','there is no sorting as of now!',4,'pending','low','2023-04-20 16:25:39','2023-04-24 12:02:35','5,7'),(13,1,'The website is down','The website cannot be accessed in firefox!',4,'pending','high','2023-04-20 16:12:16','2023-04-25 13:38:14','9'),(15,16,'We do not make music','We do not make music nor do we have rights to music...',7,'pending','high','2023-04-27 13:20:42','2023-04-27 13:20:42','8');
/*!40000 ALTER TABLE `issues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-02 14:44:15
