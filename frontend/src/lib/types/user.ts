import { type Department, type Organization } from "./organization";

export type Employee = {
    email: string;
    emp_id: string;
    first_name: string;
    last_name: string;
    password: string;
    contact_no: string;
    organization?: Organization;
    department?: Department;
    address: string;
    joining_date: Date;
}