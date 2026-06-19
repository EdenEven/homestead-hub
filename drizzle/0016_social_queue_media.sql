ALTER TABLE `socialQueue`
  ADD COLUMN `mediaUrl` varchar(2048),
  ADD COLUMN `mediaType` enum('image','video');
