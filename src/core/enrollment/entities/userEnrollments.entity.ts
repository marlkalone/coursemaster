import { EnrollmentWithCourse } from "./enrollmentWithCourse.entity";

export class UserEnrollments {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: string | Date;
    enrollments: EnrollmentWithCourse[];
}
