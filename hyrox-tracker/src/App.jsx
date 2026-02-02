import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const TRAINING_PLAN = [
  // Phase 1: Foundation (Weeks 1-8)
  {
    week: 1, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "20 min", description: "Conversational pace. Walk if needed. Goal is time on feet, not speed.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "4 × 1km / 0.62mi", description: "2 min walk rest between. Choppy conversation pace. Note your times for baseline.", targetRPE: "5-6" },
      { day: 5, title: "Fatigue Sim", duration: "3 rounds", description: "Circuit then run. 3 min rest between rounds.", targetRPE: "7-8", isSimulation: true,
        simDetails: [
          { station: "Goblet Squats", reps: "15 reps", weight: "20kg / 45lb", notes: "Deep squat, chest up" },
          { station: "Burpees", reps: "10 reps", weight: "Bodyweight", notes: "Chest to floor" },
          { station: "Row", reps: "200m", weight: "Damper 5-7", notes: "Steady pace" },
          { station: "Run", reps: "800m / 0.5mi", weight: "-", notes: "Immediately after circuit" }
        ]
      }
    ]
  },
  {
    week: 2, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "25 min", description: "Still conversational pace.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "5 × 1km / 0.62mi", description: "90 sec walk rest. Same pace as Week 1. Focus on consistency.", targetRPE: "5-6" },
      { day: 5, title: "Fatigue Sim", duration: "3 rounds", description: "Functional circuit → 1km run immediately. 3 min rest between rounds.", targetRPE: "7-8", isSimulation: true,
        simDetails: [
          { station: "Kettlebell Swings", reps: "20 reps", weight: "16kg / 35lb", notes: "Hip hinge, explosive" },
          { station: "Box Jumps", reps: "15 reps", weight: "50cm / 20in", notes: "Step down to save legs" },
          { station: "Wall Balls", reps: "20 reps", weight: "6kg / 14lb", notes: "Target 3m / 10ft" },
          { station: "Run", reps: "1km / 0.62mi", weight: "-", notes: "Start within 10 sec" }
        ]
      }
    ]
  },
  {
    week: 3, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "30 min", description: "Building duration. Keep it conversational.", targetRPE: "3-4" },
      { day: 3, title: "1km + Pace Push", duration: "4 × 1km / 0.62mi", description: "90 sec rest. First 3 comfortable, PUSH the 4th.", targetRPE: "5-8" },
      { day: 5, title: "Extended Sim", duration: "4 rounds", description: "Mini-Hyrox rehearsal. Only 2 min rest.", targetRPE: "7-8", isSimulation: true,
        simDetails: [
          { station: "Ski Erg", reps: "500m", weight: "Damper 6-8", notes: "Arms and core, save legs" },
          { station: "Run 1", reps: "1km / 0.62mi", weight: "-", notes: "Find your rhythm" },
          { station: "Sled Push", reps: "4 × 12.5m", weight: "125kg / 275lb total", notes: "Low position, drive through legs" },
          { station: "Run 2", reps: "1km / 0.62mi", weight: "-", notes: "Legs will be heavy" },
          { station: "Farmers Carry", reps: "2 × 100m", weight: "2×24kg / 2×53lb", notes: "Grip tight, short steps" },
          { station: "Run 3", reps: "1km / 0.62mi", weight: "-", notes: "Shake out arms" },
          { station: "Wall Balls", reps: "50 reps", weight: "6kg / 14lb", notes: "Break into sets of 10-15" },
          { station: "Run 4", reps: "1km / 0.62mi", weight: "-", notes: "Empty the tank" }
        ]
      }
    ]
  },
  {
    week: 4, phase: 1, phaseName: "Foundation", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "25 min", description: "Relaxed. Tapering slightly this week.", targetRPE: "3" },
      { day: 3, title: "Confidence 1kms", duration: "3 × 1km / 0.62mi", description: "Target Hyrox pace. Full 3 min recovery. Should feel controlled.", targetRPE: "6" },
      { day: 5, title: "Benchmark Test", duration: "5 stations", description: "FIRST BENCHMARK. Time everything!", targetRPE: "8", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "Ski Erg", reps: "1000m", weight: "Damper 6-8", notes: "Race pace effort" },
          { station: "Run 1", reps: "1km / 0.62mi", weight: "-", notes: "Record split time" },
          { station: "Sled Push", reps: "4 × 12.5m (50m)", weight: "152kg/335lb (M) 102kg/225lb (W)", notes: "Competition weight" },
          { station: "Run 2", reps: "1km / 0.62mi", weight: "-", notes: "Record split time" },
          { station: "Sled Pull", reps: "4 × 12.5m (50m)", weight: "103kg/227lb (M) 78kg/172lb (W)", notes: "Hand over hand" },
          { station: "Run 3", reps: "1km / 0.62mi", weight: "-", notes: "Record split time" },
          { station: "Burpee Broad Jumps", reps: "80m total", weight: "Bodyweight", notes: "~25 jumps" },
          { station: "Run 4", reps: "1km / 0.62mi", weight: "-", notes: "Record split time" },
          { station: "Row", reps: "1000m", weight: "Damper 5-7", notes: "Finish strong" },
          { station: "Run 5", reps: "1km / 0.62mi", weight: "-", notes: "RECORD TOTAL TIME" }
        ]
      }
    ]
  },
  {
    week: 5, phase: 1, phaseName: "Foundation", type: "Volume Push",
    workouts: [
      { day: 1, title: "Easy Run", duration: "35 min", description: "Full conversation pace.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "6 × 1km / 0.62mi", description: "75 sec walk rest. Keep all six within 10 seconds of each other.", targetRPE: "5-6" },
      { day: 5, title: "5-Station Sim", duration: "Full sequence", description: "Half Hyrox simulation with competition weights.", targetRPE: "7-8", isSimulation: true,
        simDetails: [
          { station: "Ski Erg", reps: "1000m", weight: "Damper 6-8", notes: "Pace: 2:00-2:15/500m" },
          { station: "Run 1", reps: "1km / 0.62mi", weight: "-", notes: "Controlled start" },
          { station: "Sled Push", reps: "50m (4×12.5m)", weight: "152kg/335lb (M) 102kg/225lb (W)", notes: "Low and steady" },
          { station: "Run 2", reps: "1km / 0.62mi", weight: "-", notes: "Legs heavy - expected" },
          { station: "Sled Pull", reps: "50m (4×12.5m)", weight: "103kg/227lb (M) 78kg/172lb (W)", notes: "Sit back, use legs" },
          { station: "Run 3", reps: "1km / 0.62mi", weight: "-", notes: "Arms tired - focus on legs" },
          { station: "Burpee Broad Jumps", reps: "80m total", weight: "Bodyweight", notes: "~25-30 burpees" },
          { station: "Run 4", reps: "1km / 0.62mi", weight: "-", notes: "Halfway done mentally" },
          { station: "Row", reps: "1000m", weight: "Damper 5-7", notes: "Pace: 1:50-2:00/500m" },
          { station: "Run 5", reps: "1km / 0.62mi", weight: "-", notes: "Strong finish" }
        ]
      }
    ]
  },
  {
    week: 6, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Building that aerobic base.", targetRPE: "3-4" },
      { day: 3, title: "Pace Bands", duration: "5 × 1km / 0.62mi", description: "60 sec rest. Reps 1,3,5 comfortable. Reps 2,4 at GOAL RACE PACE.", targetRPE: "5-7" },
      { day: 5, title: "6-Station Sim", duration: "Full sequence", description: "Add farmers carry + wall balls.", targetRPE: "7-8", isSimulation: true,
        simDetails: [
          { station: "Ski Erg", reps: "1000m", weight: "Damper 6-8", notes: "Start controlled" },
          { station: "Run 1", reps: "1km", weight: "-", notes: "" },
          { station: "Sled Push", reps: "50m", weight: "Competition", notes: "Low and steady" },
          { station: "Run 2", reps: "1km", weight: "-", notes: "" },
          { station: "Sled Pull", reps: "50m", weight: "Competition", notes: "Sit back, pull with legs" },
          { station: "Run 3", reps: "1km", weight: "-", notes: "" },
          { station: "Burpee Broad Jumps", reps: "80m", weight: "Bodyweight", notes: "" },
          { station: "Run 4", reps: "1km", weight: "-", notes: "" },
          { station: "Row", reps: "1000m", weight: "Damper 5-7", notes: "" },
          { station: "Run 5", reps: "1km", weight: "-", notes: "" },
          { station: "Farmers Carry", reps: "200m", weight: "2×24kg/53lb (M) 2×16kg/35lb (W)", notes: "Don't drop!" },
          { station: "Run 6", reps: "1km", weight: "-", notes: "" },
          { station: "Wall Balls", reps: "100 reps", weight: "9kg/20lb (M) 6kg/14lb (W)", notes: "Break into 20s" },
          { station: "Run 7", reps: "1km", weight: "-", notes: "FINISH" }
        ]
      }
    ]
  },
  {
    week: 7, phase: 1, phaseName: "Foundation", type: "Peak Week",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Longest easy run of phase.", targetRPE: "3-4" },
      { day: 3, title: "Race Pace 1kms", duration: "5 × 1km / 0.62mi", description: "60 sec rest. ALL at goal race pace.", targetRPE: "6-7" },
      { day: 5, title: "FULL 8-Station", duration: "Race simulation", description: "All 8 stations, race order, competition weights. TIME EVERYTHING.", targetRPE: "8-9", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "Run 1", reps: "1km", weight: "-", notes: "Start EASY - don't blow up" },
          { station: "Ski Erg", reps: "1000m", weight: "Damper 6-8", notes: "Arms only, save legs" },
          { station: "Run 2", reps: "1km", weight: "-", notes: "Find rhythm" },
          { station: "Sled Push", reps: "50m", weight: "152kg/335lb (M) 102kg/225lb (W)", notes: "Low, small steps" },
          { station: "Run 3", reps: "1km", weight: "-", notes: "HARDEST RUN - legs destroyed" },
          { station: "Sled Pull", reps: "50m", weight: "103kg/227lb (M) 78kg/172lb (W)", notes: "Sit back, use legs" },
          { station: "Run 4", reps: "1km", weight: "-", notes: "Arms tired" },
          { station: "Burpee Broad Jumps", reps: "80m", weight: "BW", notes: "~25 reps, pace yourself" },
          { station: "Run 5", reps: "1km", weight: "-", notes: "Halfway! Mental strength" },
          { station: "Row", reps: "1000m", weight: "Damper 5-7", notes: "1:55-2:05/500m" },
          { station: "Run 6", reps: "1km", weight: "-", notes: "Getting easier" },
          { station: "Farmers Carry", reps: "200m", weight: "2×24kg (M) 2×16kg (W)", notes: "Grip will fail" },
          { station: "Run 7", reps: "1km", weight: "-", notes: "Two left!" },
          { station: "Sandbag Lunges", reps: "100m", weight: "20kg (M) 10kg (W)", notes: "LEG DESTROYER" },
          { station: "Run 8", reps: "1km", weight: "-", notes: "Survival shuffle OK" },
          { station: "Wall Balls", reps: "100 reps", weight: "9kg (M) 6kg (W)", notes: "LAST - empty tank" }
        ]
      }
    ]
  },
  {
    week: 8, phase: 1, phaseName: "Foundation", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "30 min", description: "Recovering from Week 7.", targetRPE: "3" },
      { day: 3, title: "Sharpening", duration: "3 × 1km / 0.62mi", description: "Race pace with FULL 3 min recovery.", targetRPE: "6" },
      { day: 5, title: "Light Sim", duration: "3 weakest stations", description: "Your 3 weakest stations + 1km runs. 80% effort.", targetRPE: "6-7", isSimulation: true,
        simDetails: [
          { station: "Weakest #1", reps: "Full reps", weight: "Competition", notes: "Focus on technique" },
          { station: "Run", reps: "1km", weight: "-", notes: "Easy" },
          { station: "Weakest #2", reps: "Full reps", weight: "Competition", notes: "Find efficiency" },
          { station: "Run", reps: "1km", weight: "-", notes: "Easy" },
          { station: "Weakest #3", reps: "Full reps", weight: "Competition", notes: "Build confidence" },
          { station: "Run", reps: "1km", weight: "-", notes: "Easy" }
        ]
      }
    ]
  },
  // Phase 2: Aerobic Development (Weeks 9-16)
  {
    week: 9, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Conversational.", targetRPE: "3-4" },
      { day: 2, title: "Easy/Cross", duration: "25-30 min", description: "Easy run OR low intensity bike/swim. NEW 4th day.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "6 × 1km / 0.62mi", description: "60 sec rest. Steady, sustainable pace.", targetRPE: "5-6" },
      { day: 6, title: "Tempo Intervals", duration: "3 × 2km / 1.24mi", description: "Faster than comfortable. 2 min rest.", targetRPE: "6-7" }
    ]
  },
  {
    week: 10, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Building endurance.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Recovery pace.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "7 × 1km / 0.62mi", description: "60 sec rest. Volume building.", targetRPE: "5-6" },
      { day: 6, title: "5-Station Sim", duration: "Benchmark", description: "Compare to Week 5.", targetRPE: "7-8", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "Same as Week 5", reps: "Full", weight: "Competition", notes: "BEAT YOUR WEEK 5 TIME" }
        ]
      }
    ]
  },
  {
    week: 11, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "50 min", description: "Building duration.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Easy pace.", targetRPE: "3" },
      { day: 4, title: "Descending Rest", duration: "6 × 1km", description: "Rest: 75s, 60s, 50s, 50s, 50s. Teaches pacing under fatigue.", targetRPE: "5-7" },
      { day: 6, title: "Long Tempo", duration: "20+15 min", description: "20 min tempo, 3 min walk, 15 min tempo.", targetRPE: "6-7" }
    ]
  },
  {
    week: 12, phase: 2, phaseName: "Aerobic Dev", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "35 min", description: "Absorbing training.", targetRPE: "3" },
      { day: 3, title: "1km Repeats", duration: "4 × 1km", description: "90 sec rest. Controlled.", targetRPE: "5" },
      { day: 5, title: "Light Sim", duration: "3 stations", description: "80% effort. Don't chase times.", targetRPE: "6", isSimulation: true,
        simDetails: [
          { station: "Row", reps: "1000m", weight: "Easy", notes: "80%" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Farmers", reps: "200m", weight: "Competition", notes: "" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Wall Balls", reps: "75 reps", weight: "Competition", notes: "Reduced" }
        ]
      }
    ]
  },
  {
    week: 13, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "50 min", description: "Steady state.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Easy.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "8 × 1km", description: "50 sec rest. HIGHEST VOLUME of program.", targetRPE: "5-6" },
      { day: 6, title: "Tempo Intervals", duration: "4 × 1.5km", description: "90 sec rest. Tempo pace.", targetRPE: "6-7" }
    ]
  },
  {
    week: 14, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "55 min", description: "Long easy effort.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Recovery.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "6 × 1km", description: "50 sec rest. Goal race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL 8-Station", duration: "Benchmark", description: "Compare to Week 7. Should see SIGNIFICANT improvement.", targetRPE: "8-9", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "Full Hyrox", reps: "All 8 stations", weight: "Competition", notes: "BEAT WEEK 7 TIME" }
        ]
      }
    ]
  },
  {
    week: 15, phase: 2, phaseName: "Aerobic Dev", type: "Peak Volume",
    workouts: [
      { day: 1, title: "Easy Run", duration: "60 min", description: "LONGEST RUN of the program.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "35 min", description: "Steady.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "8 × 1km", description: "45 sec rest. HARDEST interval session.", targetRPE: "6-7" },
      { day: 6, title: "Extended Tempo", duration: "25 min", description: "Continuous. No walking. Mental toughness.", targetRPE: "6-7" }
    ]
  },
  {
    week: 16, phase: 2, phaseName: "Aerobic Dev", type: "Transition",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Moderate.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "5 × 1km", description: "60 sec rest. Race pace. Should feel manageable.", targetRPE: "6" },
      { day: 5, title: "Light Sim", duration: "4 stations", description: "85% effort. Prep for race-specific.", targetRPE: "6-7", isSimulation: true,
        simDetails: [
          { station: "Sled Push", reps: "50m", weight: "Competition", notes: "Technique focus" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Sled Pull", reps: "50m", weight: "Competition", notes: "Technique focus" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Lunges", reps: "100m", weight: "Competition", notes: "Your weakness" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Wall Balls", reps: "100 reps", weight: "Competition", notes: "Unbroken 15+" },
          { station: "Run", reps: "1km", weight: "-", notes: "" }
        ]
      }
    ]
  },
  // Phase 3: Race-Specific (Weeks 17-24)
  {
    week: 17, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Steady state.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Recovery.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "6 × 1km", description: "45 sec rest. All at goal race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL 8-Station", duration: "Practice execution", description: "Focus on TRANSITIONS - move within 10 sec.", targetRPE: "8-9", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "Full Hyrox", reps: "All 8", weight: "Competition", notes: "PRACTICE TRANSITIONS" }
        ]
      }
    ]
  },
  {
    week: 18, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Steady.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Easy.", targetRPE: "3" },
      { day: 4, title: "Negative Splits", duration: "5 × 1km", description: "50 sec rest. Start slow, finish fast.", targetRPE: "5-7" },
      { day: 6, title: "Weakness Sim", duration: "4 stations", description: "Extra volume on problem areas.", targetRPE: "7-8", isSimulation: true,
        simDetails: [
          { station: "Your #1 Weakness", reps: "1.5× normal", weight: "Competition", notes: "Build competence" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Your #2 Weakness", reps: "1.5× normal", weight: "Competition", notes: "" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Your #3 Weakness", reps: "1.5× normal", weight: "Competition", notes: "" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Your #4 Weakness", reps: "1.5× normal", weight: "Competition", notes: "" },
          { station: "Run", reps: "1km", weight: "-", notes: "" }
        ]
      }
    ]
  },
  {
    week: 19, phase: 3, phaseName: "Race-Specific", type: "Key Benchmark",
    workouts: [
      { day: 1, title: "Easy Run", duration: "50 min", description: "Steady state.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Recovery.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "7 × 1km", description: "40 sec rest. Race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL TIME TRIAL", duration: "RACE EFFORT", description: "100% EFFORT. This predicts your race time.", targetRPE: "9-10", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "RACE SIMULATION", reps: "100% EFFORT", weight: "Competition", notes: "RECORD EVERYTHING - this is your predicted race time" }
        ]
      }
    ]
  },
  {
    week: 20, phase: 3, phaseName: "Race-Specific", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "35 min", description: "Absorb training.", targetRPE: "3" },
      { day: 3, title: "Light Repeats", duration: "4 × 1km", description: "90 sec rest. Comfortable.", targetRPE: "5" },
      { day: 5, title: "Light Sim", duration: "3 stations", description: "75% effort. Recovery week.", targetRPE: "5-6", isSimulation: true,
        simDetails: [
          { station: "Ski Erg", reps: "750m", weight: "Easy", notes: "75%" },
          { station: "Run", reps: "1km", weight: "-", notes: "Easy" },
          { station: "Row", reps: "750m", weight: "Easy", notes: "75%" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Wall Balls", reps: "50 reps", weight: "Competition", notes: "" }
        ]
      }
    ]
  },
  {
    week: 21, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Steady.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Easy.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "6 × 1km", description: "45 sec rest. Race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL 8-Station", duration: "Consistent pacing", description: "All 8 run splits within 15 sec of each other.", targetRPE: "8-9", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "Full Hyrox", reps: "All 8", weight: "Competition", notes: "CONSISTENT SPLITS - all runs within 15 sec" }
        ]
      }
    ]
  },
  {
    week: 22, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Moderate.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Easy.", targetRPE: "3" },
      { day: 4, title: "Fast Finish", duration: "5 × 1km", description: "45 sec rest. #1-4 race pace. #5 ALL OUT.", targetRPE: "6-9" },
      { day: 6, title: "Back Half Sim", duration: "Stations 5-8", description: "Row → Farmers → Lunges → Wall Balls. Finish strong practice.", targetRPE: "7-8", isSimulation: true,
        simDetails: [
          { station: "Row", reps: "1000m", weight: "Competition", notes: "Start here" },
          { station: "Run", reps: "1km", weight: "-", notes: "" },
          { station: "Farmers Carry", reps: "200m", weight: "2×24kg (M) 2×16kg (W)", notes: "No drops" },
          { station: "Run", reps: "1km", weight: "-", notes: "Shake out grip" },
          { station: "Sandbag Lunges", reps: "100m", weight: "20kg (M) 10kg (W)", notes: "THE LEG DESTROYER" },
          { station: "Run", reps: "1km", weight: "-", notes: "Survive" },
          { station: "Wall Balls", reps: "100 reps", weight: "9kg (M) 6kg (W)", notes: "FINISH STRONG" },
          { station: "Run", reps: "1km", weight: "-", notes: "Victory lap" }
        ]
      }
    ]
  },
  {
    week: 23, phase: 3, phaseName: "Race-Specific", type: "Final Build",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Steady.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "20 min", description: "Short and easy.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "5 × 1km", description: "50 sec rest. Should feel CONTROLLED.", targetRPE: "6" },
      { day: 6, title: "FINAL Full Sim", duration: "Dress rehearsal", description: "EXECUTE YOUR RACE PLAN exactly.", targetRPE: "8-9", isBenchmark: true, isSimulation: true,
        simDetails: [
          { station: "Full Hyrox", reps: "All 8", weight: "Competition", notes: "Same warmup, nutrition, pacing as race day" }
        ]
      }
    ]
  },
  {
    week: 24, phase: 3, phaseName: "Race-Specific", type: "RACE WEEK 🏁",
    workouts: [
      { day: 1, title: "Easy Run", duration: "30 min", description: "Stay loose.", targetRPE: "3" },
      { day: 3, title: "Sharpening", duration: "3 × 1km", description: "FULL 3 min recovery. Feel sharp, not tired.", targetRPE: "6" },
      { day: 5, title: "Mini Sim", duration: "Stay loose", description: "70% effort. Race day soon!", targetRPE: "5", isSimulation: true,
        simDetails: [
          { station: "Wall Balls", reps: "30 reps", weight: "Competition", notes: "Just move" },
          { station: "Run", reps: "1km", weight: "-", notes: "Easy" },
          { station: "Row", reps: "500m", weight: "Easy", notes: "Loosen up" },
          { station: "Run", reps: "1km", weight: "-", notes: "Easy" },
          { station: "Mobility", reps: "5 min", weight: "-", notes: "RACE DAY READY! 🏁" }
        ]
      }
    ]
  }
];

const PHASE_COLORS = {
  1: { bg: 'bg-orange-500', text: 'text-orange-500' },
  2: { bg: 'bg-cyan-500', text: 'text-cyan-500' },
  3: { bg: 'bg-green-500', text: 'text-green-500' }
};

const BENCHMARK_WEEKS = [4, 7, 10, 14, 17, 19, 21, 23];

function App() {
  const [activeRunner, setActiveRunner] = useState('simon');
  const [activeTab, setActiveTab] = useState('plan');
  const [workouts, setWorkouts] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [showSim, setShowSim] = useState({});
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [wRes, bRes] = await Promise.all([
        supabase.from('workouts').select('*'),
        supabase.from('benchmarks').select('*')
      ]);
      if (wRes.data) setWorkouts(wRes.data);
      if (bRes.data) setBenchmarks(bRes.data);
    } catch (e) {
      console.error('Load error:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const getData = (runner, week, day) => {
    return workouts.find(w => w.runner === runner && w.week === week && w.day === day) || 
      { completed: false, time: '', rpe: '', notes: '' };
  };

  const update = async (week, day, field, value) => {
    setSaving(true);
    const existing = workouts.find(w => w.runner === activeRunner && w.week === week && w.day === day);
    const newData = {
      runner: activeRunner, week, day,
      completed: field === 'completed' ? value : (existing?.completed || false),
      time: field === 'time' ? value : (existing?.time || ''),
      rpe: field === 'rpe' ? value : (existing?.rpe || ''),
      notes: field === 'notes' ? value : (existing?.notes || ''),
      updated_at: new Date().toISOString()
    };
    try {
      if (existing?.id) {
        await supabase.from('workouts').update(newData).eq('id', existing.id);
        setWorkouts(prev => prev.map(w => w.id === existing.id ? { ...w, ...newData } : w));
      } else {
        const { data } = await supabase.from('workouts').insert(newData).select().single();
        if (data) setWorkouts(prev => [...prev, data]);
      }
    } catch (e) { console.error('Save error:', e); }
    setSaving(false);
  };

  const getBench = (runner, week) => {
    return benchmarks.find(b => b.runner === runner && b.week === week) || 
      { total_time: '', avg_split: '', splits: ['','','','','','','',''], notes: '' };
  };

  const updateBench = async (week, field, value) => {
    setSaving(true);
    const existing = benchmarks.find(b => b.runner === activeRunner && b.week === week);
    const newData = {
      runner: activeRunner, week,
      total_time: field === 'total_time' ? value : (existing?.total_time || ''),
      avg_split: field === 'avg_split' ? value : (existing?.avg_split || ''),
      splits: field === 'splits' ? value : (existing?.splits || ['','','','','','','','']),
      notes: field === 'notes' ? value : (existing?.notes || ''),
      updated_at: new Date().toISOString()
    };
    try {
      if (existing?.id) {
        await supabase.from('benchmarks').update(newData).eq('id', existing.id);
        setBenchmarks(prev => prev.map(b => b.id === existing.id ? { ...b, ...newData } : b));
      } else {
        const { data } = await supabase.from('benchmarks').insert(newData).select().single();
        if (data) setBenchmarks(prev => [...prev, data]);
      }
    } catch (e) { console.error('Save error:', e); }
    setSaving(false);
  };

  const updateSplit = async (week, index, value) => {
    const b = getBench(activeRunner, week);
    const s = [...(b.splits || ['','','','','','','',''])];
    s[index] = value;
    await updateBench(week, 'splits', s);
  };

  const getStats = (runner) => {
    let done = 0, total = 0;
    TRAINING_PLAN.forEach(wk => wk.workouts.forEach(wo => {
      total++;
      if (getData(runner, wk.week, wo.day).completed) done++;
    }));
    return { done, total, pct: total ? Math.round(done/total*100) : 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-cyan-400">Loading...</div>
        </div>
      </div>
    );
  }

  const simon = getStats('simon'), julian = getStats('julian');

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-orange-500">HYROX</h1>
              <p className="text-xs text-gray-400">24-Week Program</p>
            </div>
            {saving && <div className="text-xs text-gray-500">Saving...</div>}
            <div className="flex gap-2">
              <button onClick={() => setActiveRunner('simon')} className={`px-4 py-2 rounded-lg font-medium ${activeRunner === 'simon' ? 'bg-orange-500 text-slate-900' : 'bg-slate-700 text-gray-300'}`}>
                Simon <span className="text-xs opacity-75">{simon.pct}%</span>
              </button>
              <button onClick={() => setActiveRunner('julian')} className={`px-4 py-2 rounded-lg font-medium ${activeRunner === 'julian' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-gray-300'}`}>
                Julian <span className="text-xs opacity-75">{julian.pct}%</span>
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {['plan', 'benchmarks', 'compare'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1 text-sm rounded ${activeTab === t ? 'bg-slate-700 text-white' : 'text-gray-400'}`}>
                {t === 'plan' ? 'Training' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className={activeRunner === 'simon' ? 'text-orange-500' : 'text-cyan-500'}>
                  {getStats(activeRunner).done}/{getStats(activeRunner).total}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${activeRunner === 'simon' ? 'bg-orange-500' : 'bg-cyan-500'}`} 
                  style={{ width: `${getStats(activeRunner).pct}%` }} />
              </div>
            </div>

            {TRAINING_PLAN.map((wk) => {
              const pc = PHASE_COLORS[wk.phase];
              const exp = expandedWeek === wk.week;
              const done = wk.workouts.filter(w => getData(activeRunner, wk.week, w.day).completed).length;

              return (
                <div key={wk.week} className="bg-slate-800 rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedWeek(exp ? null : wk.week)} 
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${pc.text}`}>W{wk.week}</span>
                      <span className="text-gray-300">{wk.phaseName}</span>
                      {wk.type && <span className={`text-xs px-2 py-0.5 rounded ${pc.bg} text-slate-900`}>{wk.type}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {wk.workouts.map((w,i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${getData(activeRunner, wk.week, w.day).completed ? 'bg-green-500' : 'bg-slate-600'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">{done}/{wk.workouts.length}</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${exp ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {exp && (
                    <div className="border-t border-slate-700">
                      {wk.workouts.map((wo) => {
                        const d = getData(activeRunner, wk.week, wo.day);
                        const sk = `${wk.week}-${wo.day}`;
                        return (
                          <div key={wo.day} className={`p-4 border-b border-slate-700 last:border-0 ${d.completed ? 'bg-green-500/5' : ''}`}>
                            <div className="flex items-start gap-3">
                              <button onClick={() => update(wk.week, wo.day, 'completed', !d.completed)}
                                className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${d.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-gray-400'}`}>
                                {d.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className={`text-sm font-medium ${pc.text}`}>D{wo.day}</span>
                                  <span className="font-semibold text-white">{wo.title}</span>
                                  {wo.isBenchmark && <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">BENCHMARK</span>}
                                  {wo.isSimulation && <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">SIM</span>}
                                </div>
                                <p className="text-sm text-cyan-400 mb-1">{wo.duration}</p>
                                <p className="text-sm text-gray-400">{wo.description}</p>
                                <p className="text-xs text-gray-500 mt-1">RPE: {wo.targetRPE}</p>

                                {wo.simDetails && (
                                  <>
                                    <button onClick={() => setShowSim(p => ({...p, [sk]: !p[sk]}))} 
                                      className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                      {showSim[sk] ? '▼ Hide' : '▶ Show'} workout details
                                    </button>
                                    {showSim[sk] && (
                                      <div className="mt-3 bg-slate-900/50 rounded-lg p-3 border border-slate-700 overflow-x-auto">
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="text-gray-500 border-b border-slate-700">
                                              <th className="text-left py-1 pr-2">Station</th>
                                              <th className="text-left py-1 pr-2">Reps</th>
                                              <th className="text-left py-1 pr-2">Weight</th>
                                              <th className="text-left py-1">Notes</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {wo.simDetails.map((s,i) => (
                                              <tr key={i} className="border-b border-slate-700/50 last:border-0">
                                                <td className="py-1.5 pr-2 text-white font-medium">{s.station}</td>
                                                <td className="py-1.5 pr-2 text-cyan-400">{s.reps}</td>
                                                <td className="py-1.5 pr-2 text-gray-400">{s.weight}</td>
                                                <td className="py-1.5 text-gray-500">{s.notes}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </>
                                )}

                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-500 block mb-1">Time</label>
                                    <input type="text" value={d.time || ''} onChange={e => update(wk.week, wo.day, 'time', e.target.value)}
                                      placeholder="00:00" className="w-full px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 block mb-1">RPE</label>
                                    <input type="number" min="1" max="10" value={d.rpe || ''} onChange={e => update(wk.week, wo.day, 'rpe', e.target.value)}
                                      className="w-full px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500" />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-xs text-gray-500 block mb-1">Notes</label>
                                    <input type="text" value={d.notes || ''} onChange={e => update(wk.week, wo.day, 'notes', e.target.value)}
                                      placeholder="How did it feel?" className="w-full px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-bold text-orange-500 mb-2">Benchmarks</h2>
              <p className="text-sm text-gray-400">Track simulation times to measure progress</p>
            </div>
            {BENCHMARK_WEEKS.map(w => {
              const b = getBench(activeRunner, w);
              const wk = TRAINING_PLAN.find(x => x.week === w);
              return (
                <div key={w} className="bg-slate-800 rounded-lg p-4">
                  <div className="mb-4">
                    <span className="text-lg font-bold text-cyan-500">Week {w}</span>
                    <span className="text-gray-400 ml-2">{wk?.type || wk?.phaseName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Total Time</label>
                      <input type="text" value={b.total_time || ''} onChange={e => updateBench(w, 'total_time', e.target.value)}
                        placeholder="1:30:00" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Avg Split</label>
                      <input type="text" value={b.avg_split || ''} onChange={e => updateBench(w, 'avg_split', e.target.value)}
                        placeholder="5:30" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-2">1km Splits</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0,1,2,3,4,5,6,7].map(i => (
                        <div key={i}>
                          <span className="text-xs text-gray-500">R{i+1}</span>
                          <input type="text" value={(b.splits || [])[i] || ''} onChange={e => updateSplit(w, i, e.target.value)}
                            placeholder="0:00" className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs text-gray-500 block mb-1">Notes</label>
                    <textarea value={b.notes || ''} onChange={e => updateBench(w, 'notes', e.target.value)}
                      placeholder="How did it go?" rows={2} className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500 resize-none" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-bold text-orange-500 mb-4">Simon vs Julian</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-orange-500 font-medium">Simon</span>
                    <span className="text-gray-400">{simon.done}/{simon.total} ({simon.pct}%)</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all" style={{width:`${simon.pct}%`}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-500 font-medium">Julian</span>
                    <span className="text-gray-400">{julian.done}/{julian.total} ({julian.pct}%)</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 transition-all" style={{width:`${julian.pct}%`}} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="font-bold text-cyan-400 mb-4">Benchmark Times</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-gray-400">Week</th>
                      <th className="text-center py-2 text-orange-500">Simon</th>
                      <th className="text-center py-2 text-cyan-500">Julian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BENCHMARK_WEEKS.map(w => (
                      <tr key={w} className="border-b border-slate-700/50">
                        <td className="py-3 text-gray-300">Week {w}</td>
                        <td className="py-3 text-center font-mono">{getBench('simon', w).total_time || '—'}</td>
                        <td className="py-3 text-center font-mono">{getBench('julian', w).total_time || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="font-bold text-cyan-400 mb-4">Weekly Progress</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {TRAINING_PLAN.map(wk => {
                  const sDone = wk.workouts.filter(w => getData('simon', wk.week, w.day).completed).length;
                  const jDone = wk.workouts.filter(w => getData('julian', wk.week, w.day).completed).length;
                  const total = wk.workouts.length;
                  return (
                    <div key={wk.week} className="flex items-center gap-3 py-1">
                      <span className="text-gray-500 w-10 text-xs">W{wk.week}</span>
                      <div className="flex-1 flex items-center gap-1">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500" style={{width:`${(sDone/total)*100}%`}} />
                        </div>
                        <span className="text-xs text-orange-500 w-6">{sDone}/{total}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-1">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{width:`${(jDone/total)*100}%`}} />
                        </div>
                        <span className="text-xs text-cyan-500 w-6">{jDone}/{total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 py-3 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs text-gray-500 text-center">1km = 0.62mi • 800m = 0.5mi • 50m = 55yd</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
