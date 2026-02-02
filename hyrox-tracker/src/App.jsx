import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const TRAINING_PLAN = [
  // Phase 1: Foundation (Weeks 1-8)
  {
    week: 1, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "20 min", description: "Conversational pace. Walk if needed. Goal is time on feet, not speed.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "4 × 1km / 0.62mi", description: "2 min walk rest between. Choppy conversation pace. Note your times for baseline.", targetRPE: "5-6" },
      { day: 5, title: "Fatigue Sim", duration: "3 rounds", description: "Circuit: 15 goblet squats, 10 burpees, 200m row. Then 800m/0.5mi run. 3 min rest. Repeat 2×.", targetRPE: "7-8" }
    ]
  },
  {
    week: 2, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "25 min", description: "Still conversational pace.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "5 × 1km / 0.62mi", description: "90 sec walk rest. Same pace as Week 1. Focus on consistency.", targetRPE: "5-6" },
      { day: 5, title: "Fatigue Sim", duration: "3 rounds", description: "Functional circuit → 1km/0.62mi run immediately. 3 min rest between rounds.", targetRPE: "7-8" }
    ]
  },
  {
    week: 3, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "30 min", description: "Building duration. Keep it conversational.", targetRPE: "3-4" },
      { day: 3, title: "1km + Pace Push", duration: "4 × 1km / 0.62mi", description: "90 sec rest. First 3 comfortable, PUSH the 4th.", targetRPE: "5-8" },
      { day: 5, title: "Extended Sim", duration: "4 rounds", description: "Functional station + 1km run. Only 2 min rest. Mini-Hyrox rehearsal.", targetRPE: "7-8" }
    ]
  },
  {
    week: 4, phase: 1, phaseName: "Foundation", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "25 min", description: "Relaxed. Tapering slightly this week.", targetRPE: "3" },
      { day: 3, title: "Confidence 1kms", duration: "3 × 1km / 0.62mi", description: "Target Hyrox pace. Full 3 min recovery. Should feel controlled.", targetRPE: "6" },
      { day: 5, title: "Benchmark Test", duration: "4-5 stations", description: "4-5 stations with 1km between each. TIME THE WHOLE THING. First benchmark.", targetRPE: "8", isBenchmark: true }
    ]
  },
  {
    week: 5, phase: 1, phaseName: "Foundation", type: "Volume Push",
    workouts: [
      { day: 1, title: "Easy Run", duration: "35 min", description: "Full conversation pace.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "6 × 1km / 0.62mi", description: "75 sec walk rest. Keep all six within 10 seconds of each other.", targetRPE: "5-6" },
      { day: 5, title: "5-Station Sim", duration: "Full sequence", description: "1km → ski → 1km → sled push → 1km → sled pull → 1km → BBJ → 1km → row", targetRPE: "7-8" }
    ]
  },
  {
    week: 6, phase: 1, phaseName: "Foundation", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Building that aerobic base.", targetRPE: "3-4" },
      { day: 3, title: "Pace Bands", duration: "5 × 1km / 0.62mi", description: "60 sec rest. Reps 1,3,5 comfortable. Reps 2,4 at GOAL RACE PACE.", targetRPE: "5-7" },
      { day: 5, title: "6-Station Sim", duration: "Full sequence", description: "Add farmers carry + 100 wall balls to Week 5 sim. Time everything.", targetRPE: "7-8" }
    ]
  },
  {
    week: 7, phase: 1, phaseName: "Foundation", type: "Peak Week",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Longest easy run of phase. Embrace the boredom.", targetRPE: "3-4" },
      { day: 3, title: "Race Pace 1kms", duration: "5 × 1km / 0.62mi", description: "60 sec rest. ALL at goal race pace. Hard but manageable.", targetRPE: "6-7" },
      { day: 5, title: "FULL 8-Station", duration: "Race simulation", description: "All 8 stations, race order, competition weights. TIME EVERYTHING.", targetRPE: "8-9", isBenchmark: true }
    ]
  },
  {
    week: 8, phase: 1, phaseName: "Foundation", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "30 min", description: "Shorter and relaxed. Recovering from Week 7.", targetRPE: "3" },
      { day: 3, title: "Sharpening", duration: "3 × 1km / 0.62mi", description: "Race pace with FULL 3 min recovery. Should feel smooth.", targetRPE: "6" },
      { day: 5, title: "Light Sim", duration: "3 weakest stations", description: "Your 3 weakest stations + 1km runs. 80% effort.", targetRPE: "6-7" }
    ]
  },
  // Phase 2: Aerobic Development (Weeks 9-16)
  {
    week: 9, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Conversational.", targetRPE: "3-4" },
      { day: 2, title: "Easy/Cross", duration: "25-30 min", description: "Easy run OR low intensity bike/swim. NEW 4th day.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "6 × 1km / 0.62mi", description: "60 sec rest. Steady, sustainable pace.", targetRPE: "5-6" },
      { day: 6, title: "Tempo Intervals", duration: "3 × 2km / 1.24mi", description: "Faster than comfortable. 2 min rest. Hold pace.", targetRPE: "6-7" }
    ]
  },
  {
    week: 10, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Building endurance.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Recovery pace.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "7 × 1km / 0.62mi", description: "60 sec rest. Volume building.", targetRPE: "5-6" },
      { day: 6, title: "5-Station Sim", duration: "Full effort", description: "Compare times to Week 5. Should see improvement.", targetRPE: "7-8", isBenchmark: true }
    ]
  },
  {
    week: 11, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "50 min", description: "Building duration.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Easy pace.", targetRPE: "3" },
      { day: 4, title: "Descending Rest", duration: "6 × 1km / 0.62mi", description: "Rest: 75s, 60s, 50s, 50s, 50s. Teaches pacing as fatigue builds.", targetRPE: "5-7" },
      { day: 6, title: "Long Tempo", duration: "20 min + 15 min", description: "20 min tempo, 3 min walk, 15 min tempo.", targetRPE: "6-7" }
    ]
  },
  {
    week: 12, phase: 2, phaseName: "Aerobic Dev", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "35 min", description: "Absorbing training.", targetRPE: "3" },
      { day: 3, title: "1km Repeats", duration: "4 × 1km / 0.62mi", description: "90 sec rest. Keep controlled.", targetRPE: "5" },
      { day: 5, title: "Light Sim", duration: "3 stations @ 80%", description: "Feel good, don't chase times.", targetRPE: "6" }
    ]
  },
  {
    week: 13, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "50 min", description: "Steady state.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Easy pace.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "8 × 1km / 0.62mi", description: "50 sec rest. HIGHEST REPEAT VOLUME of program.", targetRPE: "5-6" },
      { day: 6, title: "Tempo Intervals", duration: "4 × 1.5km / 0.93mi", description: "90 sec rest. Tempo pace.", targetRPE: "6-7" }
    ]
  },
  {
    week: 14, phase: 2, phaseName: "Aerobic Dev", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "55 min", description: "Long easy effort.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "30 min", description: "Recovery.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "6 × 1km / 0.62mi", description: "50 sec rest. Goal race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL 8-Station", duration: "Race simulation", description: "Compare to Week 7. Should see SIGNIFICANT improvement.", targetRPE: "8-9", isBenchmark: true }
    ]
  },
  {
    week: 15, phase: 2, phaseName: "Aerobic Dev", type: "Peak Volume",
    workouts: [
      { day: 1, title: "Easy Run", duration: "60 min", description: "LONGEST RUN of the program.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "35 min", description: "Steady.", targetRPE: "3" },
      { day: 4, title: "1km Repeats", duration: "8 × 1km / 0.62mi", description: "45 sec rest. Tight rest, high volume — HARDEST interval session.", targetRPE: "6-7" },
      { day: 6, title: "Extended Tempo", duration: "25 min continuous", description: "No walking. Build mental toughness.", targetRPE: "6-7" }
    ]
  },
  {
    week: 16, phase: 2, phaseName: "Aerobic Dev", type: "Transition",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Moderate effort.", targetRPE: "3-4" },
      { day: 3, title: "1km Repeats", duration: "5 × 1km / 0.62mi", description: "60 sec rest. Race pace. Should feel manageable.", targetRPE: "6" },
      { day: 5, title: "Light Sim", duration: "4 stations @ 85%", description: "Preparing for race-specific phase.", targetRPE: "6-7" }
    ]
  },
  // Phase 3: Race-Specific (Weeks 17-24)
  {
    week: 17, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Steady state.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Recovery.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "6 × 1km / 0.62mi", description: "45 sec rest. All at goal race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL 8-Station", duration: "Practice execution", description: "Competition weights. Practice transitions and pacing.", targetRPE: "8-9", isBenchmark: true }
    ]
  },
  {
    week: 18, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Steady.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Easy.", targetRPE: "3" },
      { day: 4, title: "Negative Splits", duration: "5 × 1km / 0.62mi", description: "50 sec rest. Start 5 sec slow, finish 5 sec fast.", targetRPE: "5-7" },
      { day: 6, title: "Weakness Sim", duration: "4 weakest stations", description: "Extra volume on problem areas. 1km runs between.", targetRPE: "7-8" }
    ]
  },
  {
    week: 19, phase: 3, phaseName: "Race-Specific", type: "Key Benchmark",
    workouts: [
      { day: 1, title: "Easy Run", duration: "50 min", description: "Steady state.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Recovery.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "7 × 1km / 0.62mi", description: "40 sec rest. Race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL TIME TRIAL", duration: "RACE EFFORT", description: "Complete simulation at RACE EFFORT. KEY BENCHMARK before taper.", targetRPE: "9-10", isBenchmark: true }
    ]
  },
  {
    week: 20, phase: 3, phaseName: "Race-Specific", type: "Recovery",
    workouts: [
      { day: 1, title: "Easy Run", duration: "35 min", description: "Absorb the training.", targetRPE: "3" },
      { day: 3, title: "Light Repeats", duration: "4 × 1km / 0.62mi", description: "90 sec rest. Comfortable pace.", targetRPE: "5" },
      { day: 5, title: "Light Sim", duration: "3 stations @ 75%", description: "Recovery week. Absorb training.", targetRPE: "5-6" }
    ]
  },
  {
    week: 21, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "45 min", description: "Steady.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Easy.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "6 × 1km / 0.62mi", description: "45 sec rest. Race pace.", targetRPE: "6-7" },
      { day: 6, title: "FULL 8-Station", duration: "Consistent pacing", description: "Focus on CONSISTENT pacing across all 8 runs.", targetRPE: "8-9", isBenchmark: true }
    ]
  },
  {
    week: 22, phase: 3, phaseName: "Race-Specific", type: "",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Moderate.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "25 min", description: "Easy.", targetRPE: "3" },
      { day: 4, title: "Fast Finish", duration: "5 × 1km / 0.62mi", description: "45 sec rest. Reps 1-4 race pace. Rep 5 AS FAST AS POSSIBLE.", targetRPE: "6-9" },
      { day: 6, title: "Back Half Sim", duration: "Stations 5-8 only", description: "Row → Farmers → Lunges → Wall Balls with 1km runs. Finish strong.", targetRPE: "7-8" }
    ]
  },
  {
    week: 23, phase: 3, phaseName: "Race-Specific", type: "Final Build",
    workouts: [
      { day: 1, title: "Easy Run", duration: "40 min", description: "Steady.", targetRPE: "3-4" },
      { day: 2, title: "Easy Run", duration: "20 min", description: "Short and easy.", targetRPE: "3" },
      { day: 4, title: "Race Pace 1kms", duration: "5 × 1km / 0.62mi", description: "50 sec rest. Should feel CONTROLLED.", targetRPE: "6" },
      { day: 6, title: "FINAL Full Sim", duration: "Execute race plan", description: "Last complete simulation. EXECUTE YOUR RACE PLAN.", targetRPE: "8-9", isBenchmark: true }
    ]
  },
  {
    week: 24, phase: 3, phaseName: "Race-Specific", type: "Taper",
    workouts: [
      { day: 1, title: "Easy Run", duration: "30 min", description: "Light effort.", targetRPE: "3" },
      { day: 3, title: "Sharpening", duration: "3 × 1km / 0.62mi", description: "FULL 3 min recovery. Race pace. Feel sharp.", targetRPE: "6" },
      { day: 5, title: "Mini Sim", duration: "2 stations + 3×1km", description: "Light effort. Stay loose.", targetRPE: "5" }
    ]
  }
];

const PHASE_COLORS = {
  1: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', bgLight: 'bg-orange-500/20' },
  2: { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', bgLight: 'bg-cyan-500/20' },
  3: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', bgLight: 'bg-green-500/20' }
};

const BENCHMARK_WEEKS = [4, 7, 10, 14, 17, 19, 21, 23];

function App() {
  const [activeRunner, setActiveRunner] = useState('simon');
  const [activeTab, setActiveTab] = useState('plan');
  const [workouts, setWorkouts] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [saving, setSaving] = useState(false);

  // Load data from Supabase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [workoutsRes, benchmarksRes] = await Promise.all([
        supabase.from('workouts').select('*'),
        supabase.from('benchmarks').select('*')
      ]);
      
      if (workoutsRes.data) setWorkouts(workoutsRes.data);
      if (benchmarksRes.data) setBenchmarks(benchmarksRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get workout data for a specific runner/week/day
  const getWorkoutData = (runner, week, day) => {
    return workouts.find(w => w.runner === runner && w.week === week && w.day === day) || {
      completed: false, time: '', rpe: null, notes: ''
    };
  };

  // Update workout
  const updateWorkout = async (week, day, field, value) => {
    setSaving(true);
    const existing = workouts.find(w => w.runner === activeRunner && w.week === week && w.day === day);
    
    const newData = {
      runner: activeRunner,
      week,
      day,
      completed: field === 'completed' ? value : (existing?.completed || false),
      time: field === 'time' ? value : (existing?.time || ''),
      rpe: field === 'rpe' ? (value ? parseInt(value) : null) : (existing?.rpe || null),
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
    } catch (error) {
      console.error('Error saving workout:', error);
    }
    setSaving(false);
  };

  // Get benchmark data
  const getBenchmarkData = (runner, week) => {
    return benchmarks.find(b => b.runner === runner && b.week === week) || {
      total_time: '', avg_split: '', splits: Array(8).fill(''), notes: ''
    };
  };

  // Update benchmark
  const updateBenchmark = async (week, field, value) => {
    setSaving(true);
    const existing = benchmarks.find(b => b.runner === activeRunner && b.week === week);
    
    const newData = {
      runner: activeRunner,
      week,
      total_time: field === 'total_time' ? value : (existing?.total_time || ''),
      avg_split: field === 'avg_split' ? value : (existing?.avg_split || ''),
      splits: field === 'splits' ? value : (existing?.splits || Array(8).fill('')),
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
    } catch (error) {
      console.error('Error saving benchmark:', error);
    }
    setSaving(false);
  };

  // Update single split
  const updateBenchmarkSplit = async (week, index, value) => {
    const existing = getBenchmarkData(activeRunner, week);
    const newSplits = [...(existing.splits || Array(8).fill(''))];
    newSplits[index] = value;
    await updateBenchmark(week, 'splits', newSplits);
  };

  // Get completion stats
  const getCompletionStats = (runner) => {
    let completed = 0;
    let total = 0;
    TRAINING_PLAN.forEach(week => {
      week.workouts.forEach(workout => {
        total++;
        const data = workouts.find(w => w.runner === runner && w.week === week.week && w.day === workout.day);
        if (data?.completed) completed++;
      });
    });
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-cyan-400 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  const simonStats = getCompletionStats('simon');
  const julianStats = getCompletionStats('julian');

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-orange-500">HYROX</h1>
              <p className="text-xs text-gray-400">24-Week Running Program</p>
            </div>
            
            {/* Saving indicator */}
            {saving && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-500"></div>
                Saving...
              </div>
            )}
            
            {/* Runner Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveRunner('simon')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeRunner === 'simon'
                    ? 'bg-orange-500 text-slate-900'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Simon
                <span className="ml-2 text-xs opacity-75">{simonStats.percentage}%</span>
              </button>
              <button
                onClick={() => setActiveRunner('julian')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeRunner === 'julian'
                    ? 'bg-cyan-500 text-slate-900'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Julian
                <span className="ml-2 text-xs opacity-75">{julianStats.percentage}%</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mt-4">
            {['plan', 'benchmarks', 'compare'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm rounded capitalize ${
                  activeTab === tab ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'plan' ? 'Training Plan' : tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Training Plan Tab */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Overall Progress</span>
                <span className={activeRunner === 'simon' ? 'text-orange-500' : 'text-cyan-500'}>
                  {getCompletionStats(activeRunner).completed} / {getCompletionStats(activeRunner).total} workouts
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    activeRunner === 'simon' ? 'bg-orange-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${getCompletionStats(activeRunner).percentage}%` }}
                />
              </div>
            </div>

            {/* Weeks */}
            {TRAINING_PLAN.map((weekData) => {
              const phaseColor = PHASE_COLORS[weekData.phase];
              const isExpanded = expandedWeek === weekData.week;
              const weekWorkouts = weekData.workouts;
              const completedInWeek = weekWorkouts.filter(w => 
                getWorkoutData(activeRunner, weekData.week, w.day).completed
              ).length;

              return (
                <div key={weekData.week} className="bg-slate-800 rounded-lg overflow-hidden">
                  {/* Week Header */}
                  <button
                    onClick={() => setExpandedWeek(isExpanded ? null : weekData.week)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${phaseColor.text}`}>
                        W{weekData.week}
                      </span>
                      <span className="text-gray-300 font-medium">{weekData.phaseName}</span>
                      {weekData.type && (
                        <span className={`text-xs px-2 py-0.5 rounded ${phaseColor.bg} text-slate-900`}>
                          {weekData.type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {weekWorkouts.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              getWorkoutData(activeRunner, weekData.week, weekWorkouts[i].day).completed
                                ? 'bg-green-500'
                                : 'bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        {completedInWeek}/{weekWorkouts.length}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Workouts */}
                  {isExpanded && (
                    <div className="border-t border-slate-700">
                      {weekWorkouts.map((workout) => {
                        const workoutData = getWorkoutData(activeRunner, weekData.week, workout.day);
                        
                        return (
                          <div
                            key={workout.day}
                            className={`p-4 border-b border-slate-700 last:border-b-0 ${
                              workoutData.completed ? 'bg-green-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Checkbox */}
                              <button
                                onClick={() => updateWorkout(weekData.week, workout.day, 'completed', !workoutData.completed)}
                                className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                  workoutData.completed
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-500 hover:border-gray-400'
                                }`}
                              >
                                {workoutData.completed && (
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>

                              {/* Workout Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className={`text-sm font-medium ${phaseColor.text}`}>D{workout.day}</span>
                                  <span className="font-semibold text-white">{workout.title}</span>
                                  {workout.isBenchmark && (
                                    <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                                      BENCHMARK
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-cyan-400 mb-1">{workout.duration}</p>
                                <p className="text-sm text-gray-400">{workout.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Target RPE: {workout.targetRPE}</p>

                                {/* Tracking Fields */}
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-500 block mb-1">Time</label>
                                    <input
                                      type="text"
                                      value={workoutData.time || ''}
                                      onChange={(e) => updateWorkout(weekData.week, workout.day, 'time', e.target.value)}
                                      placeholder="00:00"
                                      className="w-full px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 block mb-1">RPE (1-10)</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="10"
                                      value={workoutData.rpe || ''}
                                      onChange={(e) => updateWorkout(weekData.week, workout.day, 'rpe', e.target.value)}
                                      className="w-full px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-xs text-gray-500 block mb-1">Notes</label>
                                    <input
                                      type="text"
                                      value={workoutData.notes || ''}
                                      onChange={(e) => updateWorkout(weekData.week, workout.day, 'notes', e.target.value)}
                                      placeholder="How did it feel?"
                                      className="w-full px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500"
                                    />
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

        {/* Benchmarks Tab */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-bold text-orange-500 mb-2">Benchmark Tracker</h2>
              <p className="text-sm text-gray-400">Track your full simulation times to measure progress</p>
            </div>

            {BENCHMARK_WEEKS.map((week) => {
              const benchmarkData = getBenchmarkData(activeRunner, week);
              const weekInfo = TRAINING_PLAN.find(w => w.week === week);
              
              return (
                <div key={week} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-cyan-500">Week {week}</span>
                      <span className="text-gray-400 ml-2">{weekInfo?.type || weekInfo?.phaseName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Total Time</label>
                      <input
                        type="text"
                        value={benchmarkData.total_time || ''}
                        onChange={(e) => updateBenchmark(week, 'total_time', e.target.value)}
                        placeholder="1:30:00"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Avg 1km Split</label>
                      <input
                        type="text"
                        value={benchmarkData.avg_split || ''}
                        onChange={(e) => updateBenchmark(week, 'avg_split', e.target.value)}
                        placeholder="5:30"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-2">1km Splits (8 runs)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i}>
                          <span className="text-xs text-gray-500">R{i + 1}</span>
                          <input
                            type="text"
                            value={(benchmarkData.splits || [])[i] || ''}
                            onChange={(e) => updateBenchmarkSplit(week, i, e.target.value)}
                            placeholder="0:00"
                            className="w-full px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text-gray-500 block mb-1">Notes</label>
                    <textarea
                      value={benchmarkData.notes || ''}
                      onChange={(e) => updateBenchmark(week, 'notes', e.target.value)}
                      placeholder="How did it go? Which stations were tough?"
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-bold text-orange-500 mb-4">Simon vs Julian</h2>
              
              {/* Progress Comparison */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-orange-500 font-medium">Simon</span>
                    <span className="text-gray-400">{simonStats.completed}/{simonStats.total} ({simonStats.percentage}%)</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-500"
                      style={{ width: `${simonStats.percentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-500 font-medium">Julian</span>
                    <span className="text-gray-400">{julianStats.completed}/{julianStats.total} ({julianStats.percentage}%)</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${julianStats.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-md font-bold text-cyan-400 mb-4">Benchmark Times</h3>
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
                    {BENCHMARK_WEEKS.map((week) => {
                      const simonBench = getBenchmarkData('simon', week);
                      const julianBench = getBenchmarkData('julian', week);
                      return (
                        <tr key={week} className="border-b border-slate-700/50">
                          <td className="py-3 text-gray-300">Week {week}</td>
                          <td className="py-3 text-center font-mono">
                            {simonBench.total_time || <span className="text-gray-600">—</span>}
                          </td>
                          <td className="py-3 text-center font-mono">
                            {julianBench.total_time || <span className="text-gray-600">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Week-by-Week Comparison */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-md font-bold text-cyan-400 mb-4">Weekly Progress</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {TRAINING_PLAN.map((weekData) => {
                  const simonWeek = weekData.workouts.filter(w => 
                    getWorkoutData('simon', weekData.week, w.day).completed
                  ).length;
                  const julianWeek = weekData.workouts.filter(w => 
                    getWorkoutData('julian', weekData.week, w.day).completed
                  ).length;
                  const total = weekData.workouts.length;

                  return (
                    <div key={weekData.week} className="flex items-center gap-3 py-2 border-b border-slate-700/30">
                      <span className="text-gray-400 w-12 text-sm">W{weekData.week}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500" 
                            style={{ width: `${(simonWeek / total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-orange-500 w-8">{simonWeek}/{total}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500" 
                            style={{ width: `${(julianWeek / total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-cyan-500 w-8">{julianWeek}/{total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Conversion Reference Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-3 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs text-gray-500 text-center">
            1km = 0.62mi • 800m = 0.5mi • 1.5km = 0.93mi • 2km = 1.24mi • 50m = 55yd
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
