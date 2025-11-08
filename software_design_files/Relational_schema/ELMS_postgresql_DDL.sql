CREATE TABLE "users"(
    "id" INTEGER NOT NULL,
    "org_emp_id" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "contact_no" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) CHECK
        ("role" IN('')) NOT NULL,
        "department" INTEGER NOT NULL,
        "address" TEXT NOT NULL,
        "joining_date" DATE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "department"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "organization_id" INTEGER NOT NULL
);
ALTER TABLE
    "department" ADD PRIMARY KEY("id");
CREATE TABLE "admin"(
    "admin_id" INTEGER NOT NULL,
    "manages" INTEGER NOT NULL
);
ALTER TABLE
    "admin" ADD PRIMARY KEY("admin_id");
CREATE TABLE "employee"(
    "emp_id" INTEGER NOT NULL,
    "is_approved" BOOLEAN NOT NULL,
    "admin_id" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "employee" ADD PRIMARY KEY("emp_id");
CREATE TABLE "leave_balance"(
    "id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "leave_type" INTEGER NOT NULL,
    "used_days" INTEGER NOT NULL,
    "remaining_days" INTEGER NOT NULL
);
ALTER TABLE
    "leave_balance" ADD PRIMARY KEY("id");
CREATE TABLE "leave_type"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "max_days_per_year" INTEGER NOT NULL
);
ALTER TABLE
    "leave_type" ADD PRIMARY KEY("id");
CREATE TABLE "leave_request"(
    "id" BIGINT NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "approver_id" INTEGER NOT NULL,
    "leave_type" INTEGER NOT NULL,
    "status" VARCHAR(255) CHECK
        ("status" IN('')) NOT NULL,
        "start_date" DATE NOT NULL,
        "end_date" DATE NOT NULL,
        "total_days" INTEGER NOT NULL,
        "reason" TEXT NOT NULL,
        "submission_date" DATE NOT NULL,
        "approval_date" DATE NOT NULL,
        "approval_comments" TEXT NOT NULL
);
ALTER TABLE
    "leave_request" ADD PRIMARY KEY("id");
CREATE TABLE "organization"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" TEXT NOT NULL
);
ALTER TABLE
    "organization" ADD PRIMARY KEY("id");
CREATE TABLE "User Record"(
    "id" BIGINT NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "organization_id" BIGINT NOT NULL,
    "department_id" BIGINT NOT NULL
);
ALTER TABLE
    "User Record" ADD PRIMARY KEY("id");
ALTER TABLE
    "employee" ADD CONSTRAINT "employee_emp_id_foreign" FOREIGN KEY("emp_id") REFERENCES "users"("id");
ALTER TABLE
    "leave_request" ADD CONSTRAINT "leave_request_approver_id_foreign" FOREIGN KEY("approver_id") REFERENCES "admin"("admin_id");
ALTER TABLE
    "department" ADD CONSTRAINT "department_organization_id_foreign" FOREIGN KEY("organization_id") REFERENCES "User Record"("department_id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_department_foreign" FOREIGN KEY("department") REFERENCES "department"("id");
ALTER TABLE
    "leave_request" ADD CONSTRAINT "leave_request_employee_id_foreign" FOREIGN KEY("employee_id") REFERENCES "employee"("emp_id");
ALTER TABLE
    "admin" ADD CONSTRAINT "admin_manages_foreign" FOREIGN KEY("manages") REFERENCES "department"("id");
ALTER TABLE
    "leave_request" ADD CONSTRAINT "leave_request_leave_type_foreign" FOREIGN KEY("leave_type") REFERENCES "leave_type"("id");
ALTER TABLE
    "leave_balance" ADD CONSTRAINT "leave_balance_leave_type_foreign" FOREIGN KEY("leave_type") REFERENCES "leave_type"("id");
ALTER TABLE
    "admin" ADD CONSTRAINT "admin_admin_id_foreign" FOREIGN KEY("admin_id") REFERENCES "users"("id");
ALTER TABLE
    "User Record" ADD CONSTRAINT "user record_organization_id_foreign" FOREIGN KEY("organization_id") REFERENCES "organization"("id");
ALTER TABLE
    "employee" ADD CONSTRAINT "employee_admin_id_foreign" FOREIGN KEY("admin_id") REFERENCES "admin"("admin_id");
ALTER TABLE
    "leave_balance" ADD CONSTRAINT "leave_balance_employee_id_foreign" FOREIGN KEY("employee_id") REFERENCES "employee"("emp_id");
ALTER TABLE
    "department" ADD CONSTRAINT "department_name_foreign" FOREIGN KEY("name") REFERENCES "organization"("location");
ALTER TABLE
    "User Record" ADD CONSTRAINT "user record_id_foreign" FOREIGN KEY("id") REFERENCES "users"("id");