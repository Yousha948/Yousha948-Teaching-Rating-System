import pool from '../Config/db.js';

// Create a new course
export const createCourse = async (req, res) => {
    const { courseName, departmentId } = req.body; // Credits removed as per updated schema

    try {
        const [result] = await pool.execute(`
            INSERT INTO Courses (CourseName, DepartmentID)
            VALUES (?, ?)
        `, [courseName, departmentId]);

        res.status(201).json({ message: 'Course created successfully', courseId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create course', details: error.message });
    }
};

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                c.CourseID, 
                c.CourseName, 
                c.Description, 
                c.Credits
            FROM Courses c
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve courses', details: error.message });
    }
};

// Get a specific course by ID
export const getCourseById = async (req, res) => {
    const { courseId } = req.params;

    try {
        const [rows] = await pool.execute(`
            SELECT 
                c.CourseID, 
                c.CourseName, 
                c.DepartmentID, 
                d.DepartmentName
            FROM Courses c
            JOIN Departments d ON c.DepartmentID = d.DepartmentID
            WHERE c.CourseID = ?
        `, [courseId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve course', details: error.message });
    }
};

// Update a course
export const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { courseName, departmentId } = req.body; // Credits removed as per updated schema

    try {
        const [result] = await pool.execute(`
            UPDATE Courses
            SET CourseName = ?, DepartmentID = ?
            WHERE CourseID = ?
        `, [courseName, departmentId, courseId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update course', details: error.message });
    }
};

// Delete a course
export const deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const [result] = await pool.execute(`
            DELETE FROM Courses WHERE CourseID = ?
        `, [courseId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete course', details: error.message });
    }
};
