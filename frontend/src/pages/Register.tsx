// Images
import Banner from "../assets/auth_banner.png"

// Types
import { type Organization, type Department, type EmployeeData } from "../lib/types"

// Library
import { useEffect, useState } from "react"
import { api } from "../api/api"

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
    { id: 1, name: "Engineering", organizationId: 1 },
    { id: 2, name: "Human Resources", organizationId: 1 },
    { id: 3, name: "Research & Development", organizationId: 2 },
    { id: 4, name: "Marketing", organizationId: 2 },
    { id: 5, name: "Sales", organizationId: 3 },
    { id: 6, name: "Customer Support", organizationId: 3 },
    { id: 7, name: "Product Design", organizationId: 4 },
    { id: 8, name: "Operations", organizationId: 5 },
    { id: 9, name: "Finance", organizationId: 5 },
];

export default function Register() {
    const [userData, setUserData] = useState<EmployeeData>({
        email: "",
        orgEmpId: "",
        firstName: "",
        lastName: "",
        password: "",
        contactNo: "",
        organizationId: null,
        departmentId: null,
        address: "",
        joiningDate: new Date(),
    });
    const [openOrgBox, setOpenOrgBox] = useState(false);
    const [openDeptBox, setOpenDeptBox] = useState(false);

    const handleRegister = () => {
        console.log(userData);
        alert("You have Registered successfully.");
    }

    useEffect(() => {
        // Fetch organizations and departments
        const fetchOrgData = async () => {
            const data = await api.get("/org/org-data");
            console.log(data);
        }
        fetchOrgData();
    }, [])

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
                                                value={userData.firstName}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, firstName: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Last name</FieldLabel>
                                            <Input
                                                value={userData.lastName}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, lastName: e.target.value }))}
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
                                                        {organizations && userData.organizationId
                                                            ? organizations.find((org) => org.id === userData.organizationId)?.name
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
                                                                            setUserData((prev) => ({ ...prev, departmentId: null, organizationId: (organizations ? organizations.find((o) => o.name === currentValue)?.id : null) }));
                                                                            setOpenOrgBox(false);
                                                                        }}
                                                                    >
                                                                        {org.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                userData.organizationId === org.id ? "opacity-100" : "opacity-0"
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
                                                        disabled={userData.organizationId ? false : true}
                                                    >
                                                        {organizations && userData.organizationId && departments && userData.departmentId
                                                            ? departments.find((dept) => dept.id === userData.departmentId)?.name
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
                                                                {departments.filter((d) => d.organizationId === userData.organizationId).map((dept) => (
                                                                    <CommandItem
                                                                        key={dept.id}
                                                                        value={dept.name}
                                                                        onSelect={(currentValue) => {
                                                                            setUserData((prev) => ({ ...prev, departmentId: (organizations ? departments.find((d) => d.name === currentValue)?.id : null) }));
                                                                            setOpenDeptBox(false);
                                                                        }}
                                                                    >
                                                                        {dept.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                userData.departmentId === dept.id ? "opacity-100" : "opacity-0"
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
                                                value={userData.orgEmpId}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, orgEmpId: e.target.value }))}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Joining date</FieldLabel>
                                            <DatePicker date={userData.joiningDate} setDate={(date: Date) => setUserData((prev) => ({ ...prev, joiningDate: date }))} />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Contact no</FieldLabel>
                                            <Input
                                                value={userData.contactNo}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, contactNo: e.target.value }))}
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