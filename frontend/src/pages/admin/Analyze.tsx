import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "../../components/ui/field";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../../components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"
import { Button } from "../../components/ui/button";
import { DatePicker } from "../../components/DatePicker"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../../lib/utils"
import type { Department } from "../../lib/types";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Oval } from "react-loader-spinner";
import DisplayChart from "../../components/DisplayChart";

type FormData = {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    organizationId: number | null | undefined;
    departmentId: number | null | undefined;
}

type ChartData = {
    Sunday: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
}

const Analyze = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState<ChartData | {}>({});
    const [showGraph, setShowGraph] = useState(false);
    const [maxAbsenteeDay, setMaxAbsenteeDay] = useState("");
    const [formData, setFormData] = useState<FormData>({
        fromDate: undefined,
        toDate: undefined,
        organizationId: null,
        departmentId: null,
    })
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
    } | undefined>(undefined);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post("/admin/analyze", formData);
            console.log(res);
            setChartData(res.data.data);
            setShowGraph(true);
        } catch (err) {
            if (err instanceof AxiosError) {
                const message = err.response?.data.message;
                toast.error(`Error analysing: ${message}`);
                console.log(err, message);
            }
        } finally {
            setLoading(false);
            setFormData((prev) => ({
                ...prev,
                fromDate: undefined,
                toDate: undefined,
                departmentId: null,
            }))
        }
    }

    useEffect(() => {
        if (user && orgData) {
            const userOrgId = user.manages;
            const selected = orgData.find((org) => org.id === userOrgId);
            setFormData((prev) => ({
                ...prev,
                organizationId: userOrgId
            }))
            setSelectedOrg(selected);
        }
    }, [orgData]);

    useEffect(() => {
        // Calculate the max absentee day
        if (Object.keys(chartData).length !== 0)
            setMaxAbsenteeDay(Object.keys(chartData).reduce((a, b) => chartData[a] > chartData[b] ? a : b))
    }, [chartData])

    useEffect(() => {
        // Fetch organizations and departments
        const fetchOrgData = async () => {
            const res = await api.get("/org/org-data");
            setOrgData(res.data.data);
        }
        fetchOrgData();
    }, [])

    return (
        <div className="flex items-center justify-center flex-col gap-10">
            <div className="my-10 w-11/12 lg:w-1/2">
                <form onSubmit={handleAnalyze}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Analyze leave distribution</FieldLegend>
                            <FieldDescription>Select a department and choose a period to analyze leave distribution</FieldDescription>
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
                                    <Field>
                                        <FieldLabel>Department</FieldLabel>
                                        <Popover open={openDeptBox} onOpenChange={setOpenDeptBox}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openDeptBox}
                                                    className="w-50 justify-between"
                                                    disabled={formData.organizationId ? false : true}
                                                >
                                                    {orgData && formData.organizationId && selectedOrg && formData.departmentId
                                                        ? selectedOrg.departments.find((dept) => dept.id === formData.departmentId)?.name
                                                        : "Select Department..."}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-50 p-0">
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
                                                                        setFormData((prev) => ({ ...prev, departmentId: (selectedOrg ? selectedOrg.departments.find((d) => d.name === currentValue)?.id : null) }));
                                                                        setOpenDeptBox(false);
                                                                    }}
                                                                >
                                                                    {dept.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            formData.departmentId === dept.id ? "opacity-100" : "opacity-0"
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
                                    <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                                        <Field>
                                            <FieldLabel>From date</FieldLabel>
                                            <DatePicker date={formData.fromDate} setDate={(date: Date) => setFormData((prev) => ({ ...prev, fromDate: date }))} />
                                        </Field>
                                        <Field>
                                            <FieldLabel>To date</FieldLabel>
                                            <DatePicker date={formData.toDate} setDate={(date: Date) => setFormData((prev) => ({ ...prev, toDate: date }))} />
                                        </Field>
                                    </div>
                                    <Field>
                                        <Button type="submit">
                                            Analyze
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            }
                        </FieldSet>
                    </FieldGroup>
                </form>
            </div>
            <div>
                {showGraph && <DisplayChart data={chartData} />}
            </div>
            {showGraph && <div className="border rounded-lg p-5 bg-gray-100 my-10">
                <p>Highest rate of absentee in: {maxAbsenteeDay}</p>
            </div>}
        </div>
    )
}

export default Analyze;