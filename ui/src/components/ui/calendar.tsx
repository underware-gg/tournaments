import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerSingleProps } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CalendarProps extends Omit<DayPickerSingleProps, "mode"> {
  onTimeChange?: (hour: number, minute: number) => void;
  selectedTime?: Date;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selectedTime = new Date(),
  onTimeChange,
  ...props
}: CalendarProps) {
  const today = new Date();
  const fromMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return (
    <DayPicker
      mode="single"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      fromMonth={fromMonth} // Disable navigation to previous months
      disabled={{ before: today }} // Disable selection of past dates
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex gap-2 pt-1 relative items-center",
        caption_label: "flex items-center gap-2 text-sm font-medium",
        nav: "flex items-center gap-4",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 rounded-none"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-center",
        head_cell:
          "text-retro-green rounded-md w-9 font-normal text-[0.8rem] dark:text-neutral-400",
        row: "flex justify-center w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-neutral-100/50 [&:has([aria-selected])]:bg-retro-green first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-neutral-800/50 dark:[&:has([aria-selected])]:bg-neutral-800",
        day: "h-9 w-9 p-0 font-normal aria-selected:bg-retro-green-dark aria-selected:text-black rounded-none",
        day_range_end: "day-range-end",
        day_selected:
          "bg-retro-green text-black hover:bg-neutral-900 hover:text-neutral-50 focus:bg-neutral-900 focus:text-neutral-50",
        day_today: "text-neutral-500 border border-retro-green-dark",
        day_outside:
          "day-outside text-neutral-500 aria-selected:bg-neutral-100/50 aria-selected:text-neutral-500",
        day_disabled: "text-neutral-500 opacity-50 dark:text-neutral-400",
        day_range_middle:
          "aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4" {...props} />
        ),
        CaptionLabel: ({ displayMonth }) => {
          const now = new Date();
          const isToday = selectedTime.toDateString() === now.toDateString();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();

          return (
            <div className="flex flex-row items-center">
              {onTimeChange && (
                <div className="flex items-center gap-1 pr-2">
                  <Select
                    value={format(selectedTime, "HH")}
                    onValueChange={(hour) => {
                      onTimeChange(parseInt(hour), selectedTime.getMinutes());
                    }}
                  >
                    <SelectTrigger className="w-auto [&>svg]:hidden w-[40px] px-2">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                          disabled={isToday && i < currentHour}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>:</span>
                  <Select
                    value={format(selectedTime, "mm")}
                    onValueChange={(minute) => {
                      onTimeChange(selectedTime.getHours(), parseInt(minute));
                    }}
                  >
                    <SelectTrigger className="w-auto [&>svg]:hidden w-[40px] px-2">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(
                        (minute) => (
                          <SelectItem
                            key={minute}
                            value={minute.toString().padStart(2, "0")}
                            disabled={
                              isToday &&
                              selectedTime.getHours() === currentHour &&
                              minute <= currentMinute
                            }
                          >
                            {minute.toString().padStart(2, "0")}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <span>{format(displayMonth, "MMMM yyyy")}</span>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
