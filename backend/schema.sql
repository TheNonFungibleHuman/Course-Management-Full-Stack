CREATE DATABASE IF NOT EXISTS course_management;

USE course_management;

CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    duration DECIMAL(7, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS enrolments (
    enrolment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolment_date DATE NOT NULL,
    status ENUM('Active', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Active',
    UNIQUE (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

INSERT INTO categories (category_name) VALUES
    ('Web Development'),
    ('Data Science'),
    ('Design'),
    ('Business');

INSERT INTO students (name, email, phone) VALUES
    ('Aisha Patel', 'aisha.patel@example.com', '+230 5712 3401'),
    ('Daniel Wong', 'daniel.wong@example.com', '+230 5823 4512'),
    ('Emma Laurent', 'emma.laurent@example.com', '+230 5934 5623'),
    ('Noah Williams', 'noah.williams@example.com', '+230 5045 6734'),
    ('Sara Ahmed', 'sara.ahmed@example.com', '+230 5156 7845');

INSERT INTO courses (course_name, duration, price, category_id) VALUES
    ('Full-Stack Web Development', 60, 24000, 1),
    ('JavaScript Fundamentals', 24, 9500, 1),
    ('Introduction to Data Science', 40, 18000, 2),
    ('UI and UX Design', 30, 12500, 3),
    ('Digital Marketing', 20, 8000, 4),
    ('Project Management', 25, 11000, 4);

INSERT INTO enrolments (student_id, course_id, enrolment_date, status) VALUES
    (1, 1, '2026-01-15', 'Active'),
    (1, 3, '2026-02-10', 'Completed'),
    (2, 1, '2026-03-05', 'Active'),
    (2, 4, '2026-03-12', 'Active'),
    (3, 2, '2026-04-01', 'Completed'),
    (4, 5, '2026-04-18', 'Cancelled'),
    (5, 3, '2026-05-06', 'Active'),
    (5, 6, '2026-05-20', 'Completed');
