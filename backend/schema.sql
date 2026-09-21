-- Online Course Management System - database schema and seed data
--
-- Re-runnable: drops the database first, so this script always leaves the
-- database in exactly the state below. The DROP means running it again wipes
-- any data added through the application, which is the point for a demo reset.

DROP DATABASE IF EXISTS course_management;
CREATE DATABASE course_management;
USE course_management;

-- ---------------------------------------------------------------- categories

CREATE TABLE categories (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description   VARCHAR(255) NULL,
    CONSTRAINT uq_categories_name UNIQUE (category_name)
) ENGINE = InnoDB;

-- ------------------------------------------------------------------ students

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(30)  NOT NULL,
    CONSTRAINT uq_students_email UNIQUE (email)
) ENGINE = InnoDB;

-- ------------------------------------------------------------------- courses

CREATE TABLE courses (
    course_id   INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    description VARCHAR(255) NULL,
    duration    INT UNSIGNED NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT uq_courses_name UNIQUE (course_name),
    CONSTRAINT chk_courses_duration CHECK (duration > 0),
    CONSTRAINT chk_courses_price CHECK (price >= 0),
    CONSTRAINT fk_courses_category FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- A course belongs to exactly one category, so the foreign key is indexed to
-- keep the category filter and the category/course join fast.
CREATE INDEX idx_courses_category ON courses (category_id);

-- ---------------------------------------------------------------- enrolments
--
-- Junction table resolving the many-to-many relationship between students and
-- courses. One student cannot be enrolled on the same course twice.

CREATE TABLE enrolments (
    enrolment_id   INT AUTO_INCREMENT PRIMARY KEY,
    student_id     INT  NOT NULL,
    course_id      INT  NOT NULL,
    enrolment_date DATE NOT NULL,
    status ENUM('Active', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Active',
    CONSTRAINT uq_enrolments_student_course UNIQUE (student_id, course_id),
    CONSTRAINT fk_enrolments_student FOREIGN KEY (student_id)
        REFERENCES students (student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_enrolments_course FOREIGN KEY (course_id)
        REFERENCES courses (course_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- The two foreign keys above are covered by uq_enrolments_student_course and
-- the primary key, but course_id is the leading column of no index on its own,
-- so the course side is indexed explicitly for the join and the delete check.
CREATE INDEX idx_enrolments_course ON enrolments (course_id);

-- ------------------------------------------------------------------ seed data

INSERT INTO categories (category_name, description) VALUES
    ('Web Development',  'Front-end and back-end technologies for building web applications'),
    ('Data Science',     'Data analysis, statistics, machine learning and visualisation'),
    ('Design',           'User interface, user experience and visual design'),
    ('Business',         'Management, marketing and professional business skills'),
    ('Cloud and DevOps', 'Cloud platforms, deployment pipelines and infrastructure');

INSERT INTO students (name, email, phone) VALUES
    ('Aisha Patel',        'aisha.patel@example.com',        '+230 5712 3401'),
    ('Daniel Wong',        'daniel.wong@example.com',        '+230 5823 4512'),
    ('Emma Laurent',       'emma.laurent@example.com',       '+230 5934 5623'),
    ('Noah Williams',      'noah.williams@example.com',      '+230 5045 6734'),
    ('Sara Ahmed',         'sara.ahmed@example.com',         '+230 5156 7845'),
    ('Liam O''Brien',      'liam.obrien@example.com',        '+230 5267 8956'),
    ('Priya Nair',         'priya.nair@example.com',         '+230 5378 9067'),
    ('Marco Rossi',        'marco.rossi@example.com',        '+230 5489 0178'),
    ('Chloe Dubois',       'chloe.dubois@example.com',       '+230 5590 1289'),
    ('Ethan Brown',        'ethan.brown@example.com',        '+230 5601 2390'),
    ('Fatima Khan',        'fatima.khan@example.com',        '+230 5712 3402'),
    ('Lucas Silva',        'lucas.silva@example.com',        '+230 5823 4513'),
    ('Hannah Kim',         'hannah.kim@example.com',         '+230 5934 5624'),
    ('Omar Haddad',        'omar.haddad@example.com',        '+230 5045 6735'),
    ('Isabella Costa',     'isabella.costa@example.com',     '+230 5156 7846'),
    ('Jacob Meyer',        'jacob.meyer@example.com',        '+230 5267 8957'),
    ('Amara Okafor',       'amara.okafor@example.com',       '+230 5378 9068'),
    ('Ryan Tanaka',        'ryan.tanaka@example.com',        '+230 5489 0179'),
    ('Sofia Petrova',      'sofia.petrova@example.com',      '+230 5590 1290'),
    ('Nathan Clark',       'nathan.clark@example.com',       '+230 5601 2391'),
    ('Zara Malik',         'zara.malik@example.com',         '+230 5712 3403'),
    ('Felix Andersen',     'felix.andersen@example.com',     '+230 5823 4514'),
    ('Maya Rodriguez',     'maya.rodriguez@example.com',     '+230 5934 5625'),
    ('Kofi Mensah',        'kofi.mensah@example.com',        '+230 5045 6736');

INSERT INTO courses (course_name, description, duration, price, category_id) VALUES
    ('Full-Stack Web Development',   'Build and deploy a complete application from database to interface', 60, 24000.00, 1),
    ('JavaScript Fundamentals',      'Core language syntax, functions, objects and the DOM',                24,  9500.00, 1),
    ('React Fundamentals',           'Components, props, state, hooks and client-side routing',            32, 14000.00, 1),
    ('Node.js and Express APIs',     'REST API design, routing, middleware and database access',           36, 16000.00, 1),
    ('HTML and CSS Essentials',      'Semantic markup, layout, responsive design and accessibility',        18,  6500.00, 1),
    ('Introduction to Data Science', 'Data cleaning, analysis and visualisation with Python',               40, 18000.00, 2),
    ('SQL for Analysts',             'Querying, joining, grouping and aggregating relational data',         20,  9000.00, 2),
    ('Machine Learning Basics',      'Supervised learning, model evaluation and practical workflows',        48, 22000.00, 2),
    ('UI and UX Design',             'User research, wireframing, prototyping and usability testing',        30, 12500.00, 3),
    ('Graphic Design Principles',    'Colour, typography, composition and layout for digital media',        22,  8500.00, 3),
    ('Digital Marketing',            'Search, social, content and email marketing fundamentals',            20,  8000.00, 4),
    ('Project Management',           'Planning, scheduling, risk and stakeholder communication',             25, 11000.00, 4),
    ('Business Analytics',           'Turning business data into decisions with reporting and dashboards',   28, 13000.00, 4),
    ('Cloud Fundamentals',           'Core cloud services, storage, networking and identity',               26, 12000.00, 5),
    ('DevOps and CI/CD',             'Version control, pipelines, containers and automated deployment',      34, 17500.00, 5);

INSERT INTO enrolments (student_id, course_id, enrolment_date, status) VALUES
    (1, 1, '2026-01-12', 'Active'),
    (1, 6, '2026-01-26', 'Completed'),
    (2, 1, '2026-01-15', 'Active'),
    (2, 9, '2026-02-02', 'Active'),
    (3, 2, '2026-01-20', 'Completed'),
    (3, 13, '2026-03-11', 'Active'),
    (4, 11, '2026-01-22', 'Active'),
    (4, 4, '2026-04-06', 'Active'),
    (5, 6, '2026-01-28', 'Active'),
    (5, 8, '2026-05-19', 'Active'),
    (6, 3, '2026-02-03', 'Active'),
    (6, 5, '2026-02-17', 'Completed'),
    (6, 15, '2026-06-02', 'Active'),
    (7, 12, '2026-02-05', 'Active'),
    (7, 13, '2026-04-14', 'Cancelled'),
    (8, 1, '2026-02-09', 'Active'),
    (8, 10, '2026-03-03', 'Completed'),
    (9, 9, '2026-02-11', 'Active'),
    (9, 14, '2026-05-26', 'Active'),
    (10, 6, '2026-02-16', 'Cancelled'),
    (10, 7, '2026-03-18', 'Active'),
    (11, 5, '2026-02-19', 'Completed'),
    (11, 10, '2026-04-21', 'Active'),
    (12, 2, '2026-02-24', 'Active'),
    (12, 3, '2026-06-09', 'Active'),
    (13, 4, '2026-02-26', 'Active'),
    (13, 7, '2026-05-05', 'Completed'),
    (14, 6, '2026-03-02', 'Active'),
    (14, 8, '2026-06-16', 'Active'),
    (15, 12, '2026-03-05', 'Active'),
    (15, 11, '2026-04-02', 'Cancelled'),
    (16, 9, '2026-03-09', 'Completed'),
    (16, 14, '2026-06-23', 'Active'),
    (17, 1, '2026-03-12', 'Active'),
    (17, 13, '2026-05-12', 'Active'),
    (18, 15, '2026-03-16', 'Active'),
    (18, 2, '2026-04-09', 'Completed'),
    (19, 6, '2026-03-19', 'Active'),
    (19, 3, '2026-06-30', 'Active'),
    (20, 5, '2026-03-23', 'Active'),
    (20, 10, '2026-05-14', 'Cancelled'),
    (21, 4, '2026-03-26', 'Active'),
    (21, 8, '2026-07-07', 'Active'),
    (22, 11, '2026-04-03', 'Completed'),
    (22, 7, '2026-06-11', 'Active'),
    (23, 12, '2026-04-08', 'Active'),
    (23, 15, '2026-07-14', 'Active'),
    (24, 13, '2026-04-13', 'Active'),
    (24, 9, '2026-05-21', 'Cancelled'),
    (1, 3, '2026-05-04', 'Active'),
    (2, 5, '2026-05-18', 'Completed'),
    (5, 7, '2026-05-25', 'Active'),
    (8, 4, '2026-06-04', 'Active'),
    (8, 13, '2026-06-18', 'Active'),
    (12, 8, '2026-06-25', 'Active'),
    (15, 6, '2026-07-02', 'Active'),
    (16, 1, '2026-07-09', 'Active'),
    (19, 12, '2026-07-16', 'Active'),
    (21, 3, '2026-07-21', 'Active'),
    (23, 1, '2026-07-23', 'Active'),
    (6, 9, '2026-07-06', 'Completed'),
    (11, 15, '2026-06-29', 'Active'),
    (13, 11, '2026-04-27', 'Cancelled'),
    (18, 3, '2026-02-12', 'Completed'),
    (2, 12, '2026-03-30', 'Active'),
    -- Concentrated on the most popular course so the dashboard ranking has a
    -- clear leader rather than several courses tied at the same count.
    (11, 1, '2026-03-24', 'Active'),
    (12, 1, '2026-06-15', 'Active'),
    (13, 1, '2026-05-08', 'Active');
