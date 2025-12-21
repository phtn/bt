"use client";

import { useState, useTransition } from "react";

type EventType = "concert" | "party" | "show";

export function EventHosting() {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<EventType>("concert");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState(500);
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      // Form submission will be implemented here
      console.log("Submitting event:", {
        eventName,
        eventType,
        date,
        time,
        venue,
        capacity,
        description,
      });
    });
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="p-8 md:p-12 relative z-10">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">
            Creator Studio
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Event Hosting Configurator
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Ready to bring the crowd? Configure your event details below to get started with hosting on LiveTix.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="event-name" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Event Name
              </label>
              <input
                id="event-name"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                placeholder="e.g. Summer Vibes Festival"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Event Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEventType("concert")}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    eventType === "concert"
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  Concert
                </button>
                <button
                  type="button"
                  onClick={() => setEventType("party")}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    eventType === "party"
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  Party
                </button>
                <button
                  type="button"
                  onClick={() => setEventType("show")}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    eventType === "show"
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  Show
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Date
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">
                    calendar_today
                  </span>
                  <input
                    id="date"
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                    placeholder="Select Date"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Time
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">schedule</span>
                  <input
                    id="time"
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                    placeholder="Start Time"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="venue" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Venue / Location
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">location_on</span>
                <input
                  id="venue"
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                  placeholder="Search for a venue"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="capacity"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Expected Capacity
                </label>
                <span className="text-primary font-bold text-sm">{capacity}+</span>
              </div>
              <input
                id="capacity"
                type="range"
                min={1}
                max={10000}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Small (50)</span>
                <span>Massive (10k+)</span>
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2"
              >
                Event Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 resize-none font-medium"
                placeholder="Tell people what to expect..."
              />
            </div>
          </div>
        </form>
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/10 text-green-500">
              <span className="material-symbols-outlined text-xl">verified_user</span>
            </div>
            <div className="text-sm">
              <p className="text-slate-900 dark:text-white font-bold">Instant Approval</p>
              <p className="text-slate-500 dark:text-slate-400">For verified hosts</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full md:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(238,43,238,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Launch Event
            <span className="material-symbols-outlined">rocket_launch</span>
          </button>
        </div>
      </div>
    </div>
  );
}

