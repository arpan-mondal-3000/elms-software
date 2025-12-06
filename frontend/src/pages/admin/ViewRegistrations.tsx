// Library
import { useEffect, useState } from "react"
import { api } from "../../api/api"
import { toast } from "sonner"

import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/alert-dialog"

import { Oval } from "react-loader-spinner";

type EmployeeData = {
    id: number,
    orgEmpId: string,
    firstName: string,
    lastName: string,
    email: string,
    contactNo: string,
    address: string,
    joiningDate: string,
    isApproved: Boolean,
}

export default function ViewRegistrations() {
    const [approvedEmployee, setApprovedEmployee] = useState<EmployeeData[]>([]);
    const [unapprovedEmployee, setUnapprovedEmployee] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);

    const handleApprove = async (id: number) => {
        try {
            setLoading(true);
            await api.post("/admin/approve", { employeeId: id });
            const approved = unapprovedEmployee.find((emp: EmployeeData) => emp.id === id);
            setUnapprovedEmployee((prev) => prev.filter((emp: EmployeeData) => emp.id !== id));
            if (approved)
                setApprovedEmployee((prev) => [...prev, approved]);
            toast.success(`${approved?.firstName} ${approved?.lastName} approved successfully.`);
        } catch (err) {
            console.error("Error approving employee: ", err);
            toast.error("Error approving employee!");
        } finally {
            setLoading(false);
        }
    }

    const handleReject = async (id: number) => {
        try {
            setLoading(true);
            await api.post("/admin/reject", { employeeId: id });
            const deleted = unapprovedEmployee.find((emp: EmployeeData) => emp.id === id);
            setUnapprovedEmployee((prev) => prev.filter((emp: EmployeeData) => emp.id !== id));
            toast.success(`${deleted?.firstName} ${deleted?.lastName} rejected successfully.`);
        } catch (err) {
            console.error("Error rejecting employee: ", err);
            toast.error("Error rejecting employee!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true)
                const data = await api.get("/admin/employees");
                console.log(data.data.data);
                setApprovedEmployee(data.data.data.filter((e: EmployeeData) => e.isApproved === true));
                setUnapprovedEmployee(data.data.data.filter((e: EmployeeData) => e.isApproved === false));
            } catch (err) {
                console.error("Error fetching employees: ", err);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, [])

    return (
        <>
            <div className="flex w-full flex-col gap-6">
                <Tabs defaultValue="unapproved">
                    <div className="m-10">
                        <TabsList>
                            <TabsTrigger value="unapproved">Unapproved</TabsTrigger>
                            <TabsTrigger value="approved">Approved</TabsTrigger>
                        </TabsList>
                    </div>
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
                        <>
                            <TabsContent value="unapproved">
                                {unapprovedEmployee.length === 0 &&
                                    <p className="mx-10 text-gray-500">No pending employee approval.</p>
                                }
                                {unapprovedEmployee.length !== 0 &&
                                    unapprovedEmployee.map((emp) =>
                                        <Card
                                            className="mx-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                                            key={emp.id}
                                        >
                                            <CardHeader className="flex flex-col items-center text-center pb-2">
                                                {/* Profile Image */}
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                                                    alt="Employee"
                                                    className="w-28 h-28 rounded-full object-cover shadow-md border"
                                                />

                                                <CardTitle className="text-2xl mt-4 font-bold">
                                                    {emp.firstName} {emp.lastName}
                                                </CardTitle>
                                                <p className="text-sm text-gray-500">{emp.email}</p>
                                            </CardHeader>

                                            <CardContent className="px-6">
                                                <div className="mt-4">
                                                    <div className="text-xl font-semibold mb-3 border-b pb-1">
                                                        Employee Information
                                                    </div>

                                                    <div className="space-y-2 text-gray-700">
                                                        <p>
                                                            <span className="font-semibold">Employee ID:</span> {emp.orgEmpId}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Joining Date:</span> {emp.joiningDate}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Address:</span> {emp.address}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Contact No:</span> {emp.contactNo}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="gap-3 flex justify-center pb-5">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button>Approve</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Do you want to approve {emp.firstName} {emp.lastName}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                After approval this employee will be able to login and apply for leave. This cannot be undone!
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleApprove(emp.id)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive">Reject</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Do you want to reject {emp.firstName} {emp.lastName}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This employee will be rejected and deleted. It cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleReject(emp.id)} className="bg-red-500">Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </CardFooter>
                                        </Card>
                                    )
                                }
                            </TabsContent>
                            <TabsContent value="approved">
                                {approvedEmployee.length === 0 &&
                                    <p className="mx-10 text-gray-500">No approved employees yet</p>
                                }
                                {approvedEmployee.length !== 0 &&
                                    approvedEmployee.map((emp) =>
                                        <Card
                                            className="mx-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                                            key={emp.id}
                                        >
                                            <CardHeader className="flex flex-col items-center text-center pb-2">
                                                {/* Profile Image */}
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                                                    alt="Employee"
                                                    className="w-28 h-28 rounded-full object-cover shadow-md border"
                                                />

                                                <CardTitle className="text-2xl mt-4 font-bold">
                                                    {emp.firstName} {emp.lastName}
                                                </CardTitle>
                                                <p className="text-sm text-gray-500">{emp.email}</p>
                                            </CardHeader>

                                            <CardContent className="px-6">
                                                <div className="mt-4">
                                                    <div className="text-xl font-semibold mb-3 border-b pb-1">
                                                        Employee Information
                                                    </div>

                                                    <div className="space-y-2 text-gray-700">
                                                        <p>
                                                            <span className="font-semibold">Employee ID:</span> {emp.orgEmpId}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Joining Date:</span> {emp.joiningDate}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Address:</span> {emp.address}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Contact No:</span> {emp.contactNo}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="gap-3 flex justify-center pb-5">
                                                {/* <Button
                                                    variant="destructive"
                                                    className="px-6 py-2 rounded-full shadow-md"
                                                >
                                                    Delete
                                                </Button> */}
                                            </CardFooter>
                                        </Card>
                                    )
                                }
                            </TabsContent>
                        </>
                    }
                </Tabs>
            </div>
        </>
    )
}