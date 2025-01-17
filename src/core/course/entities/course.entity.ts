export class Course {
    id: number;
    title: string;
    description: string;
    hours: number;
    created_at: Date;
}

export class Course2 {
    id: number;
    title: string;
    description: string;
    hours: number;
    created_at: Date | string;
}