"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Phone,
  User,
  Clock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@supabase/supabase-js";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isToday,
} from "date-fns";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Event = {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  is_all_day: boolean;
  color: string;
  contact_name: string | null;
  phone_number: string | null;
  call_notes: string | null;
  call_type: string | null;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_date: format(new Date(), "yyyy-MM-dd"),
    end_time: "10:00",
    location: "",
    is_all_day: false,
    color: "#25D366",
    contact_name: "",
    phone_number: "",
    call_notes: "",
    call_type: "phone_call",
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("start_time", startDate.toISOString())
      .lte("start_time", endDate.toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleAddEvent = async () => {
    const startDateTime = `${newEvent.start_date}T${newEvent.start_time}:00`;
    const endDateTime = `${newEvent.end_date}T${newEvent.end_time}:00`;

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title: newEvent.title,
          description: newEvent.description || null,
          start_time: startDateTime,
          end_time: endDateTime,
          location: newEvent.location || null,
          is_all_day: newEvent.is_all_day,
          color: newEvent.color,
          contact_name: newEvent.contact_name || null,
          phone_number: newEvent.phone_number || null,
          call_notes: newEvent.call_notes || null,
          call_type: newEvent.call_type || "phone_call",
        },
      ])
      .select();

    if (error) {
      console.error("Error adding event:", error);
    } else {
      setIsAddEventOpen(false);
      setNewEvent({
        title: "",
        description: "",
        start_date: format(new Date(), "yyyy-MM-dd"),
        start_time: "09:00",
        end_date: format(new Date(), "yyyy-MM-dd"),
        end_time: "10:00",
        location: "",
        is_all_day: false,
        color: "#25D366",
        contact_name: "",
        phone_number: "",
        call_notes: "",
        call_type: "phone_call",
      });
      fetchEvents();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("Error deleting event:", error);
    } else {
      setSelectedEvent(null);
      fetchEvents();
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.start_time);
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Phone className="h-6 w-6 text-whatsapp-darkgreen" />
          <h2 className="text-xl font-semibold text-whatsapp-text">
            Phone Call Schedule
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="ml-4 bg-whatsapp-darkgreen hover:bg-whatsapp-green">
                <Plus className="h-4 w-4 mr-2" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Phone Call</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Call Purpose</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="Purpose of the call"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input
                    id="contact_name"
                    value={newEvent.contact_name}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, contact_name: e.target.value })
                    }
                    placeholder="Contact name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={newEvent.phone_number}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, phone_number: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="call_notes">Call Notes</Label>
                  <Textarea
                    id="call_notes"
                    value={newEvent.call_notes}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, call_notes: e.target.value })
                    }
                    placeholder="Notes about the call"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newEvent.start_date}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={newEvent.start_time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, start_time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newEvent.end_date}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, end_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={newEvent.end_time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, end_time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={newEvent.color}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, color: e.target.value })
                    }
                    className="w-12 h-8 p-1"
                  />
                </div>
                <Button
                  onClick={handleAddEvent}
                  className="bg-whatsapp-darkgreen hover:bg-whatsapp-green"
                >
                  Schedule Call
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] p-1 border border-gray-100 ${isSameMonth(day, currentDate) ? "" : "opacity-40"} ${isToday(day) ? "bg-blue-50" : ""}`}
            >
              <div className="text-right text-sm p-1">{format(day, "d")}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <TooltipProvider key={event.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog
                          open={selectedEvent?.id === event.id}
                          onOpenChange={(open) => {
                            if (!open) setSelectedEvent(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <div
                              className="text-xs p-1 rounded truncate cursor-pointer text-white flex items-center gap-1"
                              style={{ backgroundColor: event.color }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <Phone className="h-3 w-3" />
                              <span>{event.title}</span>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-whatsapp-darkgreen" />
                                {event.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              {event.contact_name && (
                                <div className="flex items-start gap-2">
                                  <User className="h-4 w-4 mt-1 text-whatsapp-darkgreen" />
                                  <div>
                                    <h4 className="text-sm font-medium">
                                      Contact
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {event.contact_name}
                                      {event.phone_number && (
                                        <span className="block">
                                          {event.phone_number}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 mt-1 text-whatsapp-darkgreen" />
                                <div>
                                  <h4 className="text-sm font-medium">
                                    Scheduled Time
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {format(parseISO(event.start_time), "PPp")}
                                    {event.end_time &&
                                      ` - ${format(parseISO(event.end_time), "PPp")}`}
                                  </p>
                                </div>
                              </div>
                              {event.call_notes && (
                                <div className="flex items-start gap-2">
                                  <FileText className="h-4 w-4 mt-1 text-whatsapp-darkgreen" />
                                  <div>
                                    <h4 className="text-sm font-medium">
                                      Call Notes
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {event.call_notes}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="w-full"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Cancel Call
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent className="p-2 max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          {event.contact_name && (
                            <p className="text-xs flex items-center gap-1">
                              <User className="h-3 w-3" /> {event.contact_name}
                            </p>
                          )}
                          {event.phone_number && (
                            <p className="text-xs flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {event.phone_number}
                            </p>
                          )}
                          <p className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />{" "}
                            {format(parseISO(event.start_time), "p")}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-gray-500">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
