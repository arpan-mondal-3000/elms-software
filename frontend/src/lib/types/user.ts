export type Employee = {
    email: string;
    emp_id: string;
    first_name: string;
    last_name: string;
    password: string;
    contact_no: string;
    organization_id: number | null | undefined;
    department_id: number | null | undefined;
    address: string;
    joining_date: Date;
}