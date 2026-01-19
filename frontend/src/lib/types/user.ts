export type Employee = {
    id: number;
    email: string;
    orgEmpId: string;
    firstName: string;
    lastName: string;
    contactNo: string;
    role: "employee";
    address: string;
    joiningDate: Date;
    adminId: number;
}

export type Admin = {
    id: number;
    email: string;
    orgEmpId: string;
    firstName: string;
    lastName: string;
    contactNo: string;
    role: "employee";
    address: string;
    joiningDate: Date;
    manages: number;
}

export type EmployeeData = {
    email: string;
    orgEmpId: string;
    firstName: string;
    lastName: string;
    gender: string;
    password: string;
    contactNo: string;
    organizationId: number | null | undefined;
    departmentId: number | null | undefined;
    position: string;
    address: string;
    joiningDate: Date;
}

export type User = Employee & Admin | null;