// Images
import Banner from "../assets/auth_banner.png"

// Types
import { type Employee, type Organization, type Department } from "../lib/types"

// Library
import { useState } from "react"

// Components
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button";
import { DatePicker } from "../components/DatePicker"

export default function Register() {
    const [userData, setUserData] = useState<Employee>({
        email: "",
        emp_id: "",
        first_name: "",
        last_name: "",
        password: "",
        contact_no: "",
        organization: undefined,
        department: undefined,
        address: "",
        joining_date: new Date(),
    });

    const handleRegister = () => {
        console.log(userData);
        alert("You have Registered successfully.");
    }

    return (
        <>
            <div className="md:grid md:grid-cols-2 h-screen items-center">
                {/* Left section */}
                <div className="hidden md:block">
                    <img src={Banner} alt="Register Banner" />
                </div>
                {/* Login form */}
                <div className="flex items-center justify-center bg-muted h-full">
                    <form className="w-3/4 shadow-lg p-10 rounded-lg bg-background">
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend>Register</FieldLegend>
                                <FieldDescription>Register as employee to your organization</FieldDescription>
                                <FieldGroup>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>First name</FieldLabel>
                                            <Input
                                                value={userData.first_name}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, first_name: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Last name</FieldLabel>
                                            <Input
                                                value={userData.last_name}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, last_name: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                    </div>
                                    <Field>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input
                                            value={userData.email}
                                            onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Password</FieldLabel>
                                        <Input
                                            value={userData.password}
                                            onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
                                            required
                                        />
                                    </Field>
                                    <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                                        <Field>
                                            <FieldLabel>Organization</FieldLabel>
                                            <Input
                                                value={userData.contact_no}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, contact_no: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Department</FieldLabel>
                                            <Input
                                                value={userData.address}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, address: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Joining date</FieldLabel>
                                            <DatePicker date={userData.joining_date} setDate={(date: Date) => setUserData((prev) => ({ ...prev, joining_date: date }))} />
                                        </Field>
                                    </div>
                                    <Field>
                                        <FieldLabel>Employee ID</FieldLabel>
                                        <Input
                                            value={userData.emp_id}
                                            onChange={(e) => setUserData((prev) => ({ ...prev, emp_id: e.target.value }))}
                                            required
                                        />
                                    </Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Contact no</FieldLabel>
                                            <Input
                                                value={userData.contact_no}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, contact_no: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Address</FieldLabel>
                                            <Input
                                                value={userData.address}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, address: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                    </div>
                                    <Field>
                                        <Button onClick={handleRegister}>
                                            Register
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </form>
                </div>
            </div>
        </>
    )
}