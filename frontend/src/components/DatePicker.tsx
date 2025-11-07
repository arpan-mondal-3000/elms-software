import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover"

export function DatePicker({ date, setDate }: { date: Date | undefined, setDate: (date: Date) => void }) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                    >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date: Date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                        required
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
