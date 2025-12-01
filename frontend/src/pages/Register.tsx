// Images
import Banner from "../assets/auth_banner.png"

// Types
import { type Department, type EmployeeData } from "../lib/types"

// Library
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuthStore } from "../store/authStore"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { AxiosError } from "axios"

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
import { Oval } from "react-loader-spinner";

// Dummy data
// export const organizations: Organization[] = [
//     { id: 1, name: "TechNova Solutions", location: "Bangalore" },
//     { id: 2, name: "Innova Labs", location: "Hyderabad" },
//     { id: 3, name: "DataSphere Analytics", location: "Pune" },
//     { id: 4, name: "GreenEdge Systems", location: "Chennai" },
//     { id: 5, name: "BluePeak Technologies", location: "Mumbai" },
// ];

// export const departments: Department[] = [
//     { id: 1, name: "Engineering", organizationId: 1 },
//     { id: 2, name: "Human Resources", organizationId: 1 },
//     { id: 3, name: "Research & Development", organizationId: 2 },
//     { id: 4, name: "Marketing", organizationId: 2 },
//     { id: 5, name: "Sales", organizationId: 3 },
//     { id: 6, name: "Customer Support", organizationId: 3 },
//     { id: 7, name: "Product Design", organizationId: 4 },
//     { id: 8, name: "Operations", organizationId: 5 },
//     { id: 9, name: "Finance", organizationId: 5 },
// ];

export default function Register() {
    const { register, loading } = useAuthStore();
    const navigate = useNavigate();
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
    const [orgData, setOrgData] = useState<{
        id: number,
        name: string,
        departments: Department[]
    }[] | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<{
        id: number,
        name: string,
        departments: Department[]
    } | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(userData);
        try {
            await register(userData);
            toast.success("Registration successful wait for admin approval.");
            navigate("/");
        } catch (err) {
            if (err instanceof AxiosError) {
                const message = err?.response?.data.message;
                console.log(err, message);
                toast.error(`Failed to register please try again. ${message}`);
            }
        }
    }

    useEffect(() => {
        // Fetch organizations and departments
        const fetchOrgData = async () => {
            const res = await api.get("/org/org-data");
            setOrgData(res.data.data);
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
                    <form className="w-3/4 shadow-lg p-10 rounded-lg bg-background" onSubmit={handleRegister}>
                        {loading ?
                            <div className="flex items-center justify-center">
                                <Oval
                                    visible={true}
                                    height="80"
                                    width="80"
                                    color="#000814"
                                    secondaryColor="#bad6ff"
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </div>
                            :
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
                                                type="password"
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
                                                            {orgData && userData.organizationId
                                                                ? orgData.find((org) => org.id === userData.organizationId)?.name
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
                                                                    {orgData?.map((org) => (
                                                                        <CommandItem
                                                                            key={org.id}
                                                                            value={org.name}
                                                                            onSelect={(currentValue) => {
                                                                                setUserData((prev) => ({ ...prev, departmentId: null, organizationId: (orgData ? orgData.find((o) => o.name === currentValue)?.id : null) }));
                                                                                setSelectedOrg(org);
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
                                                            {orgData && userData.organizationId && selectedOrg && userData.departmentId
                                                                ? selectedOrg.departments.find((dept) => dept.id === userData.departmentId)?.name
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
                                                                    {selectedOrg?.departments.map((dept) => (
                                                                        <CommandItem
                                                                            key={dept.id}
                                                                            value={dept.name}
                                                                            onSelect={(currentValue) => {
                                                                                setUserData((prev) => ({ ...prev, departmentId: (selectedOrg ? selectedOrg.departments.find((d) => d.name === currentValue)?.id : null) }));
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
                                            <Button type="submit">
                                                Register
                                            </Button>
                                        </Field>
                                    </FieldGroup>
                                </FieldSet>
                            </FieldGroup>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}