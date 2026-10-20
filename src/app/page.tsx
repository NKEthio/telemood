"use client";

import React, { useState } from "react";
import showsData from "@/data/shows.json";
import { useDPadNavigation } from "@/hooks/useDPadNavigation";

export interface Show {
  id: string;
  title: string;
  broadcastTime: string;
  category: string;
  urgencyIndex: string;
  description: string;
  suitableMoods: string[];
}

const MOODS = [
  "Procrastinating",
  "Numb & Glaring at Ceiling",
  "Hyper-Focused",
  "Existential Crisis",
  "Adrenaline Rush",
  "Snack Deprived",
];

export default function TeleMoodApp() {
  const [shows] = useState<Show[]>(showsData);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<{
    mood: string;
    items: Show[];
  } | null>(null);

  const handleSelectGridItem = (index: number) => {
    if (shows[index]) {
      setSelectedShow(shows[index]);
      setFocusArea("SHOW_MODAL");
    }
  };

  const handleSelectMood = (moodIndex: number) => {
    const selectedMood = MOODS[moodIndex];
    // Filter or pick top shows matching mood + random fill to make a dramatic 3-stage itinerary
    const matching = shows.filter((s) => s.suitableMoods.includes(selectedMood));
    const otherShows = shows.filter((s) => !s.suitableMoods.includes(selectedMood));
    const itineraryList = [...matching, ...otherShows].slice(0, 3);

    setGeneratedItinerary({
      mood: selectedMood,
      items: itineraryList,
    });
  };

  const handleOpenMoodModal = () => {
    setIsMoodModalOpen(true);
    setGeneratedItinerary(null);
  };

  const handleCloseModals = () => {
    setIsMoodModalOpen(false);
    setSelectedShow(null);
    setGeneratedItinerary(null);
  };

  const { navState, setFocusArea } = useDPadNavigation(
    shows.length,
    MOODS.length,
    3, // 3 columns for 10-foot UI
    handleSelectGridItem,
    handleSelectMood,
    handleOpenMoodModal,
    handleCloseModals
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header / TV Nav Bar */}
      <header className="mb-8 flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-amber-400 font-bold tracking-widest text-lg uppercase">
              LIVE BROADCAST • FIRE OS TV
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mt-1 text-white">
            Tele<span className="text-amber-400">Mood</span>
          </h1>
          <p className="text-slate-400 text-xl mt-1">
            Satirical 10-Foot Program Guide for Modern Existential Viewing
          </p>
        </div>

        {/* D-Pad Focusable Trigger Button */}
        <div>
          <button
            onClick={handleOpenMoodModal}
            className={`px-8 py-5 rounded-2xl font-black text-2xl transition-all duration-200 transform flex items-center space-x-3 ${
              navState.focusArea === "NAV_BAR"
                ? "bg-amber-400 text-slate-950 ring-8 ring-amber-300 scale-110 shadow-2xl shadow-amber-500/50"
                : "bg-gradient-to-r from-red-600 to-amber-600 text-white hover:brightness-110"
            }`}
          >
            <span>🚨 EMERGENCY MOOD GUIDE</span>
          </button>
        </div>
      </header>

      {/* Main Grid View - 3 Columns TV Optimized */}
      <main className="flex-1">
        <div className="mb-4 flex items-center justify-between text-slate-400 text-lg">
          <span>
            Use <kbd className="px-2 py-1 bg-slate-800 rounded text-amber-400 font-mono">▲ ▼ ◄ ►</kbd> to Navigation | <kbd className="px-2 py-1 bg-slate-800 rounded text-amber-400 font-mono">ENTER</kbd> Select | <kbd className="px-2 py-1 bg-slate-800 rounded text-amber-400 font-mono">ESC</kbd> Back
          </span>
          <span className="text-amber-400 font-semibold">
            {shows.length} CHANNELS LIVE
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {shows.map((show, index) => {
            const isFocused =
              navState.focusArea === "SHOW_GRID" && navState.gridIndex === index;

            return (
              <div
                key={show.id}
                onClick={() => handleSelectGridItem(index)}
                className={`relative p-6 rounded-2xl bg-slate-900 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between h-72 ${
                  isFocused
                    ? "border-amber-400 ring-8 ring-amber-400/60 scale-105 z-10 shadow-2xl shadow-amber-500/30 bg-slate-850"
                    : "border-slate-800 hover:border-slate-700 opacity-90"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="px-3 py-1 rounded-md bg-amber-950 text-amber-300 text-sm font-bold tracking-wide uppercase border border-amber-800/50">
                      {show.category}
                    </span>
                    <span className="text-amber-400 font-mono font-bold text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {show.broadcastTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold leading-tight text-white line-clamp-2 mb-2">
                    {show.title}
                  </h2>

                  <p className="text-slate-300 text-base line-clamp-3 leading-relaxed">
                    {show.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider truncate max-w-[70%]">
                    {show.urgencyIndex}
                  </span>
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    PRESS [ENTER]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Instructions for Fire OS Simulator */}
      <footer className="mt-8 pt-4 border-t border-slate-800 text-center text-slate-500 text-base">
        TeleMood Fire OS Webview Environment • D-Pad Controller Mapping Active
      </footer>

      {/* MODAL 1: Mood Itinerary Generator Modal */}
      {isMoodModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 z-50">
          <div className="bg-slate-900 border-4 border-amber-400/80 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {!generatedItinerary ? (
              <div>
                <div className="text-center mb-8">
                  <span className="text-red-500 font-black tracking-widest text-xl uppercase">
                    🚨 EMERGENCY ITINERARY ENGINE
                  </span>
                  <h2 className="text-4xl font-extrabold text-white mt-1">
                    Select Your Current Mental State
                  </h2>
                  <p className="text-slate-400 text-lg mt-2">
                    Use <kbd className="text-amber-400 font-mono">▲ ▼</kbd> keys to choose your mood & press <kbd className="text-amber-400 font-mono">ENTER</kbd>
                  </p>
                </div>

                <div className="space-y-4">
                  {MOODS.map((mood, idx) => {
                    const isFocused =
                      navState.focusArea === "MODAL_MOODS" &&
                      navState.modalMoodIndex === idx;

                    return (
                      <button
                        key={mood}
                        onClick={() => handleSelectMood(idx)}
                        className={`w-full text-left p-5 rounded-xl text-2xl font-bold transition-all duration-150 flex items-center justify-between border-2 ${
                          isFocused
                            ? "bg-amber-400 text-slate-950 border-white ring-8 ring-amber-300 scale-102 shadow-lg"
                            : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750"
                        }`}
                      >
                        <span>{mood}</span>
                        {isFocused && (
                          <span className="text-slate-950 font-black text-xl bg-amber-300 px-3 py-1 rounded">
                            SELECT ►
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <span className="text-amber-400 font-mono uppercase font-bold text-sm tracking-widest bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-800">
                    MATCHED MOOD: {generatedItinerary.mood}
                  </span>
                  <h2 className="text-4xl font-black text-white mt-3">
                    Your Tailored Emergency Schedule
                  </h2>
                  <p className="text-slate-400 text-lg mt-1">
                    Press <kbd className="text-amber-400 font-mono">ENTER</kbd> or <kbd className="text-amber-400 font-mono">ESC</kbd> to return to grid
                  </p>
                </div>

                <div className="space-y-4 my-6">
                  {generatedItinerary.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 font-mono font-bold text-base">
                            #{index + 1} • {item.broadcastTime}
                          </span>
                          <span className="text-xs bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded">
                            {item.urgencyIndex}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {item.title}
                        </h3>
                        <p className="text-slate-300 text-base mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={handleCloseModals}
                    className="px-8 py-4 bg-amber-400 text-slate-950 font-black text-2xl rounded-2xl ring-4 ring-amber-300 scale-105 shadow-xl hover:bg-amber-300"
                  >
                    RETURN TO CHANNEL GUIDE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Show Detail View Modal */}
      {selectedShow && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 z-50">
          <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-8 max-w-3xl w-full shadow-2xl text-left">
            <div className="flex justify-between items-start gap-4 mb-4">
              <span className="px-4 py-1.5 rounded-lg bg-amber-950 text-amber-300 text-base font-bold tracking-wide uppercase border border-amber-800">
                {selectedShow.category}
              </span>
              <span className="text-amber-400 font-mono font-bold text-lg bg-slate-950 px-3 py-1 rounded border border-slate-800">
                {selectedShow.broadcastTime}
              </span>
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-4">
              {selectedShow.title}
            </h2>

            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 mb-6">
              <span className="text-red-400 font-mono font-bold text-base">
                URGENCY STATUS: {selectedShow.urgencyIndex}
              </span>
            </div>

            <p className="text-slate-200 text-2xl leading-relaxed mb-8">
              {selectedShow.description}
            </p>

            <div className="flex justify-end">
              <button
                onClick={handleCloseModals}
                className="px-8 py-4 bg-amber-400 text-slate-950 font-black text-2xl rounded-2xl ring-4 ring-amber-300 scale-105 shadow-xl hover:bg-amber-300"
              >
                CLOSE [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
