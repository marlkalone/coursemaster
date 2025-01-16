import { Course } from "src/core/course/entities/course.entity";

export class EnrollmentWithCourse {
    id: number;
    user_id: number;
    course_id: number;
    enrolled_at: Date | string;
    course: Course;
}
