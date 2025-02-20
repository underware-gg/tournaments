import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { StepProps } from "@/containers/CreateTournament";
import TournamentTimeline from "@/components/TournamentTimeline";

const Schedule = ({ form }: StepProps) => {
  const [showTypeDetails, setShowTypeDetails] = React.useState(false);

  const PREDEFINED_DURATIONS = [
    { value: 1, label: "1 D" },
    { value: 3, label: "3 D" },
    { value: 7, label: "1 W" },
    { value: 14, label: "2 W" },
  ];

  const DURATION_TO_DEFAULT_SUBMISSION = {
    1: 1, // 1 day -> 1 hour
    3: 6, // 3 days -> 6 hours
    7: 24, // 1 week -> 1 day (24 hours)
    14: 48, // 2 weeks -> 2 days (48 hours)
  } as const;

  const disablePastDates = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex flex-col">
        <span className="font-astronaut text-3xl font-bold">Schedule</span>
        <div className="w-full h-0.5 bg-retro-green/25" />
      </div>
      <div className="flex flex-row justify-between px-4">
        <div className="w-2/5">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                  <FormLabel className="font-astronaut text-2xl">
                    Start Time
                  </FormLabel>

                  <FormDescription>Select a future time</FormDescription>
                </div>

                <div className="flex flex-row gap-4">
                  <Calendar
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        const newDate = new Date(date);
                        const currentValue = field.value;
                        newDate.setHours(currentValue.getHours());
                        newDate.setMinutes(currentValue.getMinutes());
                        field.onChange(newDate);
                      }
                    }}
                    selectedTime={field.value}
                    onTimeChange={(hour, minute) => {
                      const newDate = new Date(field.value);
                      newDate.setHours(hour);
                      newDate.setMinutes(minute);
                      field.onChange(newDate);
                    }}
                    disabled={disablePastDates}
                    initialFocus
                    className="rounded-md border-4 border-retro-green-dark w-auto"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col justify-between w-3/5">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center gap-4">
                    <FormLabel className="font-astronaut text-2xl">
                      Duration
                    </FormLabel>
                    <FormDescription>
                      Select the tournament duration and submission period
                    </FormDescription>
                  </div>
                  <FormControl>
                    {/* Duration Section */}
                    <div className="flex flex-row items-center gap-5">
                      <div className="flex flex-row gap-2 w-1/3">
                        {PREDEFINED_DURATIONS.map(({ value, label }) => (
                          <Button
                            key={value}
                            type="button"
                            variant={
                              field.value === value ? "default" : "outline"
                            }
                            className="px-2"
                            onClick={() => {
                              field.onChange(value);
                            }}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 w-1/3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">
                            Duration
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {field.value} {field.value === 1 ? "day" : "days"}
                          </span>
                        </div>
                        <Slider
                          value={[field.value]}
                          onValueChange={([duration]) => {
                            field.onChange(duration);

                            // Set default submission period based on duration
                            const defaultSubmissionHours =
                              DURATION_TO_DEFAULT_SUBMISSION[
                                duration as keyof typeof DURATION_TO_DEFAULT_SUBMISSION
                              ] || Math.min(duration * 24, 24); // fallback to 24 hours or duration in hours if shorter

                            // Convert duration to hours for submission period check
                            const durationInHours = duration * 24;
                            const currentSubmissionHours =
                              form.watch("submissionPeriod");
                            // Update submission period if it exceeds new duration or if it's a predefined duration
                            if (
                              currentSubmissionHours > durationInHours ||
                              Object.keys(
                                DURATION_TO_DEFAULT_SUBMISSION
                              ).includes(duration.toString())
                            ) {
                              form.setValue(
                                "submissionPeriod",
                                defaultSubmissionHours
                              );
                            }
                          }}
                          max={90}
                          min={1}
                          step={1}
                        />
                      </div>

                      {/* Submission Period Section */}
                      <div className="flex flex-col gap-2 w-1/3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">
                            Submission Period
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {form.watch("submissionPeriod") || 1}{" "}
                            {form.watch("submissionPeriod") || 1 === 1
                              ? "hour"
                              : "hours"}
                          </span>
                        </div>
                        <Slider
                          value={[form.watch("submissionPeriod") || 1]}
                          onValueChange={([submissionHours]) => {
                            // Ensure submission period doesn't exceed duration in hours
                            const maxHours = field.value * 24;
                            form.setValue(
                              "submissionPeriod",
                              Math.min(maxHours, submissionHours)
                            );
                          }}
                          max={field.value * 24} // Max hours based on selected days
                          min={1}
                          step={1}
                        />
                      </div>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full h-0.5 bg-retro-green/25" />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center gap-4">
                    <FormLabel className="font-astronaut text-2xl">
                      Registration Type
                    </FormLabel>
                    <div className="flex flex-row gap-2">
                      <FormDescription className="text-wrap">
                        Select the registration type for the tournament:
                      </FormDescription>
                      <button
                        type="button"
                        onClick={() => setShowTypeDetails(!showTypeDetails)}
                        className="text-neutral-500 font-bold"
                      >
                        {showTypeDetails ? "See Less" : "See More"}
                      </button>
                    </div>
                    {showTypeDetails && (
                      <div className="text-wrap">
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                          <li className="text-muted-foreground">
                            Fixed: An event with a registration period for
                            capped number of entries
                          </li>
                          <li className="text-muted-foreground">
                            Open: An event where entries can be made throughout
                            the tournament period
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <FormControl>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          field.value === "fixed" ? "default" : "outline"
                        }
                        onClick={() => field.onChange("fixed")}
                      >
                        Fixed
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "open" ? "default" : "outline"}
                        onClick={() => field.onChange("open")}
                      >
                        Open
                      </Button>
                    </div>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <div className="w-full h-0.5 bg-retro-green/25" />
          <TournamentTimeline
            type={form.watch("type")}
            createdTime={Math.floor(new Date().getTime() / 1000)} // Convert to Unix timestamp
            startTime={Math.floor(form.watch("startTime").getTime() / 1000)} // Convert to Unix timestamp
            duration={form.watch("duration") * 24 * 60 * 60} // Convert days to seconds
            submissionPeriod={form.watch("submissionPeriod") * 60 * 60} // Convert hours to seconds
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
