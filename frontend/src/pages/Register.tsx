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
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover"

// Dummy data
export const organizations: Organization[] = [
    { id: 1, name: "TechNova Solutions", location: "Bangalore" },
    { id: 2, name: "Innova Labs", location: "Hyderabad" },
    { id: 3, name: "DataSphere Analytics", location: "Pune" },
    { id: 4, name: "GreenEdge Systems", location: "Chennai" },
    { id: 5, name: "BluePeak Technologies", location: "Mumbai" },
];

export const departments: Department[] = [
    { id: 1, name: "Engineering", org_id: 1 },
    { id: 2, name: "Human Resources", org_id: 1 },
    { id: 3, name: "Research & Development", org_id: 2 },
    { id: 4, name: "Marketing", org_id: 2 },
    { id: 5, name: "Sales", org_id: 3 },
    { id: 6, name: "Customer Support", org_id: 3 },
    { id: 7, name: "Product Design", org_id: 4 },
    { id: 8, name: "Operations", org_id: 5 },
    { id: 9, name: "Finance", org_id: 5 },
];

export default function Register() {
    const [userData, setUserData] = useState<Employee>({
        email: "",
        emp_id: "",
        first_name: "",
        last_name: "",
        password: "",
        contact_no: "",
        organization_id: null,
        department_id: null,
        address: "",
        joining_date: new Date(),
    });
    const [openOrgBox, setOpenOrgBox] = useState(false);
    const [openDeptBox, setOpenDeptBox] = useState(false);

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
                                            <Popover open={openOrgBox} onOpenChange={setOpenOrgBox}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openOrgBox}
                                                        className="w-[200px] justify-between"
                                                    >
                                                        {organizations && userData.organization_id
                                                            ? organizations.find((org) => org.id === userData.organization_id)?.name
                                                            : "Select Organization..."}
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search Organizations..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No organization found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {organizations.map((org) => (
                                                                    <CommandItem
                                                                        key={org.id}
                                                                        value={org.name}
                                                                        onSelect={(currentValue) => {
                                                                            setUserData((prev) => ({ ...prev, organization_id: (organizations ? organizations.find((o) => o.name === currentValue)?.id : null) }));
                                                                            setOpenOrgBox(false);
                                                                        }}
                                                                    >
                                                                        {org.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                userData.organization_id === org.id ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Department</FieldLabel>
                                            <Popover open={openDeptBox} onOpenChange={setOpenDeptBox}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openDeptBox}
                                                        className="w-[200px] justify-between"
                                                        disabled={userData.organization_id ? false : true}
                                                    >
                                                        {organizations && userData.organization_id && departments && userData.department_id
                                                            ? departments.find((dept) => dept.id === userData.department_id)?.name
                                                            : "Select Department..."}
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search Departments..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No Departments found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {departments.filter((d) => d.org_id === userData.organization_id).map((dept) => (
                                                                    <CommandItem
                                                                        key={dept.id}
                                                                        value={dept.name}
                                                                        onSelect={(currentValue) => {
                                                                            setUserData((prev) => ({ ...prev, department_id: (organizations ? departments.find((d) => d.name === currentValue)?.id : null) }));
                                                                            setOpenDeptBox(false);
                                                                        }}
                                                                    >
                                                                        {dept.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                userData.department_id === dept.id ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </Field>
                                    </div>
                                    <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                                        <Field>
                                            <FieldLabel>Employee ID</FieldLabel>
                                            <Input
                                                value={userData.emp_id}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, emp_id: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Joining date</FieldLabel>
                                            <DatePicker date={userData.joining_date} setDate={(date: Date) => setUserData((prev) => ({ ...prev, joining_date: date }))} />
                                        </Field>
                                    </div>
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