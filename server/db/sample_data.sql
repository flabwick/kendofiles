-- Sample folders
INSERT INTO folders (id, name, parent_id, path, is_root)
VALUES
  (1, 'Home', NULL, 'Home', true),
  (2, 'Documents', 1, 'Home/Documents', false),
  (3, 'Images', 1, 'Home/Images', false),
  (4, 'Work', 2, 'Home/Documents/Work', false),
  (5, 'Personal', 2, 'Home/Documents/Personal', false),
  (6, 'Projects', 4, 'Home/Documents/Work/Projects', false),
  (7, 'Vacations', 3, 'Home/Images/Vacations', false),
  (8, 'Italy2024', 7, 'Home/Images/Vacations/Italy2024', false);

-- Sample files
INSERT INTO files (id, name, folder_id, extension, size)
VALUES
  (1, 'resume.pdf', 4, 'pdf', 2500000),
  (2, 'meeting_notes.txt', 4, 'txt', 15000),
  (3, 'project_plan.md', 6, 'md', 50000),
  (4, 'data.json', 6, 'json', 120000),
  (5, 'expenses.csv', 5, 'csv', 75000),
  (6, 'novel.epub', 5, 'epub', 5000000),
  (7, 'beach.jpg', 8, 'jpg', 3500000),
  (8, 'mountains.jpg', 8, 'jpg', 4200000);
