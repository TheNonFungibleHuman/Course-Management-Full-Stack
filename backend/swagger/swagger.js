const json = (schema) => ({
  content: { "application/json": { schema } },
});

const schema = (name) => ({ $ref: `#/components/schemas/${name}` });
const arrayOf = (name) => ({ type: "array", items: schema(name) });

const errorNames = {
  400: "ValidationError",
  404: "NotFound",
  409: "Conflict",
  500: "ServerError",
};

function operation({
  tag,
  summary,
  operationId,
  parameters,
  requestSchema,
  responseSchema,
  status = 200,
  responseDescription = "Successful response",
  errors = [500],
}) {
  const responses = {
    [status]: {
      description: responseDescription,
      ...(responseSchema ? json(responseSchema) : {}),
    },
  };

  for (const code of errors) {
    responses[code] = {
      $ref: `#/components/responses/${errorNames[code]}`,
    };
  }

  return {
    tags: [tag],
    summary,
    operationId,
    ...(parameters ? { parameters } : {}),
    ...(requestSchema
      ? { requestBody: { required: true, ...json(requestSchema) } }
      : {}),
    responses,
  };
}

const id = {
  name: "id",
  in: "path",
  required: true,
  description: "Numeric record ID",
  schema: { type: "integer", minimum: 1 },
};

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Course Management API",
    version: "1.0.0",
    description:
      "Endpoints, request bodies and responses used by the course management frontend.",
  },
  servers: [
    {
      url: "/",
      description: "Current server",
    },
  ],
  tags: [
    { name: "Students" },
    { name: "Courses" },
    { name: "Categories" },
    { name: "Enrolments" },
    { name: "Dashboard" },
  ],
  components: {
    schemas: {
      StudentInput: {
        type: "object",
        required: ["name", "email", "phone"],
        properties: {
          name: { type: "string", maxLength: 150, example: "Aisha Patel" },
          email: {
            type: "string",
            format: "email",
            maxLength: 255,
            example: "aisha.patel@example.com",
          },
          phone: {
            type: "string",
            pattern: "^\\+230[0-9]{8}$",
            description: "Mauritian number: the country code +230 followed by 8 digits, no spaces",
            example: "+23057123401",
          },
        },
      },
      Student: {
        allOf: [
          schema("StudentInput"),
          {
            type: "object",
            properties: {
              student_id: { type: "integer", example: 1 },
              total_enrolments: {
                type: "integer",
                description: "How many courses this student is enrolled on",
                example: 2,
              },
              active_enrolments: { type: "integer", example: 1 },
              completed_enrolments: { type: "integer", example: 1 },
              cancelled_enrolments: { type: "integer", example: 0 },
            },
          },
        ],
      },
      CategoryInput: {
        type: "object",
        required: ["category_name"],
        properties: {
          category_name: {
            type: "string",
            maxLength: 100,
            example: "Web Development",
          },
          description: {
            type: "string",
            maxLength: 255,
            nullable: true,
            example: "Front-end and back-end technologies for building web applications",
          },
        },
      },
      Category: {
        allOf: [
          schema("CategoryInput"),
          {
            type: "object",
            properties: { category_id: { type: "integer", example: 1 } },
          },
        ],
      },
      CourseInput: {
        type: "object",
        required: ["course_name", "duration", "price", "category_id"],
        properties: {
          course_name: {
            type: "string",
            maxLength: 150,
            example: "Full-Stack Web Development",
          },
          description: {
            type: "string",
            maxLength: 255,
            nullable: true,
            example: "Build and deploy a complete application from database to interface",
          },
          duration: { type: "integer", minimum: 1, example: 60 },
          price: { type: "number", minimum: 0, example: 24000 },
          category_id: { type: "integer", minimum: 1, example: 1 },
        },
      },
      Course: {
        type: "object",
        properties: {
          course_id: { type: "integer", example: 1 },
          course_name: { type: "string", example: "Full-Stack Web Development" },
          description: {
            type: "string",
            nullable: true,
            example: "Build and deploy a complete application from database to interface",
          },
          duration: { type: "integer", example: 60 },
          price: { type: "string", example: "24000.00" },
          category_id: { type: "integer", example: 1 },
          category_name: { type: "string", example: "Web Development" },
          enrolment_count: {
            type: "integer",
            description: "How many students are enrolled on this course",
            example: 9,
          },
          active_enrolments: { type: "integer", example: 7 },
        },
      },
      CourseStudent: {
        type: "object",
        properties: {
          student_id: { type: "integer", example: 1 },
          name: { type: "string", example: "Aisha Patel" },
          email: { type: "string", format: "email" },
          phone: { type: "string", example: "+230 5712 3401" },
          enrolment_id: { type: "integer", example: 1 },
          enrolment_date: { type: "string", format: "date" },
          status: { type: "string", enum: ["Active", "Completed", "Cancelled"] },
        },
      },
      EnrolmentInput: {
        type: "object",
        required: ["student_id", "course_id", "enrolment_date", "status"],
        properties: {
          student_id: { type: "integer", minimum: 1, example: 1 },
          course_id: { type: "integer", minimum: 1, example: 1 },
          enrolment_date: {
            type: "string",
            format: "date",
            example: "2026-01-15",
          },
          status: {
            type: "string",
            enum: ["Active", "Completed", "Cancelled"],
            example: "Active",
          },
        },
      },
      Enrolment: {
        allOf: [
          schema("EnrolmentInput"),
          {
            type: "object",
            properties: { enrolment_id: { type: "integer", example: 1 } },
          },
        ],
      },
      EnrolmentDetails: {
        allOf: [
          schema("Enrolment"),
          {
            type: "object",
            properties: {
              student_name: { type: "string", example: "Aisha Patel" },
              student_email: {
                type: "string",
                format: "email",
                example: "aisha.patel@example.com",
              },
              course_name: { type: "string", example: "Full-Stack Web Development" },
              category_id: { type: "integer", example: 1 },
              category_name: { type: "string", example: "Web Development" },
            },
          },
        ],
      },
      DashboardStats: {
        type: "object",
        properties: {
          total_students: { type: "integer", example: 5 },
          total_courses: { type: "integer", example: 6 },
          total_categories: { type: "integer", example: 4 },
          total_enrolments: { type: "integer", example: 8 },
          active_enrolments: { type: "integer", example: 4 },
          completed_enrolments: { type: "integer", example: 3 },
          cancelled_enrolments: { type: "integer", example: 1 },
          total_revenue: {
            type: "string",
            example: "83000.00",
            description:
              "Sum of course prices for Active and Completed enrolments. Cancelled enrolments are excluded.",
          },
          popular_courses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                course_id: { type: "integer", example: 1 },
                course_name: { type: "string" },
                enrolment_count: { type: "integer", example: 2 },
              },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Student not found" },
          errors: {
            type: "object",
            additionalProperties: { type: "string" },
          },
        },
      },
      Message: {
        type: "object",
        description: "Confirmation returned when a record is deleted",
        properties: {
          message: {
            type: "string",
            example: "Student deleted successfully",
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: "Invalid request data",
        ...json(schema("Error")),
      },
      NotFound: {
        description: "Record not found",
        ...json(schema("Error")),
      },
      Conflict: {
        description: "Request conflicts with existing data",
        ...json(schema("Error")),
      },
      ServerError: {
        description: "Unexpected server error",
        ...json(schema("Error")),
      },
    },
  },
  paths: {
    "/api/students": {
      get: operation({
        tag: "Students",
        summary: "List all students",
        operationId: "getAllStudents",
        responseSchema: arrayOf("Student"),
      }),
      post: operation({
        tag: "Students",
        summary: "Create a student",
        operationId: "createStudent",
        requestSchema: schema("StudentInput"),
        responseSchema: schema("Student"),
        status: 201,
        errors: [400, 409, 500],
      }),
    },
    "/api/students/{id}": {
      get: operation({
        tag: "Students",
        summary: "Get one student",
        operationId: "getStudentById",
        parameters: [id],
        responseSchema: schema("Student"),
        errors: [400, 404, 500],
      }),
      put: operation({
        tag: "Students",
        summary: "Update a student",
        operationId: "updateStudent",
        parameters: [id],
        requestSchema: schema("StudentInput"),
        responseSchema: schema("Student"),
        errors: [400, 404, 409, 500],
      }),
      delete: operation({
        tag: "Students",
        summary: "Delete a student",
        operationId: "deleteStudent",
        parameters: [id],
        responseSchema: schema("Message"),
        responseDescription: "Student deleted",
        errors: [400, 404, 409, 500],
      }),
    },
    "/api/courses": {
      get: operation({
        tag: "Courses",
        summary: "List courses, optionally filtered by category",
        operationId: "getAllCourses",
        parameters: [
          {
            name: "category_id",
            in: "query",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responseSchema: arrayOf("Course"),
        errors: [400, 500],
      }),
      post: operation({
        tag: "Courses",
        summary: "Create a course",
        operationId: "createCourse",
        requestSchema: schema("CourseInput"),
        responseSchema: schema("Course"),
        status: 201,
        errors: [400, 500],
      }),
    },
    "/api/courses/{id}": {
      get: operation({
        tag: "Courses",
        summary: "Get one course",
        operationId: "getCourseById",
        parameters: [id],
        responseSchema: schema("Course"),
        errors: [400, 404, 500],
      }),
      put: operation({
        tag: "Courses",
        summary: "Update a course",
        operationId: "updateCourse",
        parameters: [id],
        requestSchema: schema("CourseInput"),
        responseSchema: schema("Course"),
        errors: [400, 404, 500],
      }),
      delete: operation({
        tag: "Courses",
        summary: "Delete a course",
        operationId: "deleteCourse",
        parameters: [id],
        responseSchema: schema("Message"),
        responseDescription: "Course deleted",
        errors: [400, 404, 409, 500],
      }),
    },
    "/api/courses/{id}/students": {
      get: operation({
        tag: "Courses",
        summary: "List students enrolled in a course",
        operationId: "getCourseStudents",
        parameters: [id],
        responseSchema: arrayOf("CourseStudent"),
        errors: [400, 404, 500],
      }),
    },
    "/api/categories": {
      get: operation({
        tag: "Categories",
        summary: "List all categories",
        operationId: "getAllCategories",
        responseSchema: arrayOf("Category"),
      }),
      post: operation({
        tag: "Categories",
        summary: "Create a category",
        operationId: "createCategory",
        requestSchema: schema("CategoryInput"),
        responseSchema: schema("Category"),
        status: 201,
        errors: [400, 409, 500],
      }),
    },
    "/api/categories/{id}": {
      get: operation({
        tag: "Categories",
        summary: "Get one category",
        operationId: "getCategoryById",
        parameters: [id],
        responseSchema: schema("Category"),
        errors: [400, 404, 500],
      }),
      put: operation({
        tag: "Categories",
        summary: "Update a category",
        operationId: "updateCategory",
        parameters: [id],
        requestSchema: schema("CategoryInput"),
        responseSchema: schema("Category"),
        errors: [400, 404, 409, 500],
      }),
      delete: operation({
        tag: "Categories",
        summary: "Delete a category",
        operationId: "deleteCategory",
        parameters: [id],
        responseSchema: schema("Message"),
        responseDescription: "Category deleted",
        errors: [400, 404, 409, 500],
      }),
    },
    "/api/enrolments": {
      get: operation({
        tag: "Enrolments",
        summary: "List all enrolments",
        operationId: "getAllEnrolments",
        responseSchema: arrayOf("Enrolment"),
      }),
      post: operation({
        tag: "Enrolments",
        summary: "Create an enrolment",
        operationId: "createEnrolment",
        requestSchema: schema("EnrolmentInput"),
        responseSchema: schema("Enrolment"),
        status: 201,
        errors: [400, 409, 500],
      }),
    },
    "/api/enrolments/details": {
      get: operation({
        tag: "Enrolments",
        summary: "List enrolments with student, course and category names",
        operationId: "getEnrolmentDetails",
        responseSchema: arrayOf("EnrolmentDetails"),
      }),
    },
    "/api/enrolments/{id}": {
      get: operation({
        tag: "Enrolments",
        summary: "Get one enrolment",
        operationId: "getEnrolmentById",
        parameters: [id],
        responseSchema: schema("Enrolment"),
        errors: [400, 404, 500],
      }),
      put: operation({
        tag: "Enrolments",
        summary: "Update an enrolment",
        operationId: "updateEnrolment",
        parameters: [id],
        requestSchema: schema("EnrolmentInput"),
        responseSchema: schema("Enrolment"),
        errors: [400, 404, 409, 500],
      }),
      delete: operation({
        tag: "Enrolments",
        summary: "Delete an enrolment",
        operationId: "deleteEnrolment",
        parameters: [id],
        responseSchema: schema("Message"),
        responseDescription: "Enrolment deleted",
        errors: [400, 404, 500],
      }),
    },
    "/api/dashboard/stats": {
      get: operation({
        tag: "Dashboard",
        summary: "Get dashboard totals and popular courses",
        operationId: "getDashboardStats",
        responseSchema: schema("DashboardStats"),
      }),
    },
  },
};

export default swaggerDocument;
