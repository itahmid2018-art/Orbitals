import React, { useState, useEffect } from 'react';
import { LabNoteEntry, LabNoteSnapshot } from '../types/notebook';
import {
  ChemicalProperties,
  RenderStyle,
  OrbitalVisualizationMode,
  VibrationalMode,
  MeasurementSelection,
} from '../types/chemistry';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Camera,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Tag,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';

interface Props {
  properties: ChemicalProperties | null;
  renderStyle: RenderStyle;
  orbitalMode: OrbitalVisualizationMode;
  temperatureK: number;
  activeVibrationalMode: VibrationalMode | null;
  measurement: MeasurementSelection;
  onRestoreSnapshot: (snapshot: LabNoteSnapshot, formula: string) => void;
}

const STORAGE_KEY = 'orbitalis_lab_notebook_notes';

export const LabNotebook: React.FC<Props> = ({
  properties,
  renderStyle,
  orbitalMode,
  temperatureK,
  activeVibrationalMode,
  measurement,
  onRestoreSnapshot,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState<LabNoteEntry[]>([]);
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [tagInput, setTagInput] = useState<LabNoteEntry['tag']>('Observation');
  const [filterCurrentOnly, setFilterCurrentOnly] = useState(true);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load lab notes from localStorage:', e);
    }
  }, []);

  // Save to localStorage when notes change
  const saveNotes = (updated: LabNoteEntry[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save lab notes to localStorage:', e);
    }
  };

  const handleCaptureAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!properties) return;

    const snapshot: LabNoteSnapshot = {
      renderStyle,
      orbitalMode,
      temperatureK,
      activeVibrationalModeName: activeVibrationalMode?.name,
      vibrationalFrequencyCm1: activeVibrationalMode?.frequencyCm1,
      measurementDistance: measurement.distance,
      measurementAngle: measurement.angle,
      dipoleDebye: properties.estimatedDipoleDebye,
    };

    const newEntry: LabNoteEntry = {
      id: `note-${Date.now()}`,
      moleculeFormula: properties.formula,
      moleculeName: properties.name,
      timestamp: Date.now(),
      title: titleInput.trim() || `${properties.name} (${properties.formula}) Observation`,
      content: contentInput.trim() || `Recorded state with ${orbitalMode} orbitals at ${temperatureK}K.`,
      tag: tagInput,
      snapshot,
    };

    const updated = [newEntry, ...notes];
    saveNotes(updated);

    // Reset inputs
    setTitleInput('');
    setContentInput('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const handleCopyNote = (note: LabNoteEntry) => {
    const text = `## Lab Observation: ${note.title}\nMolecule: ${note.moleculeName} (${note.moleculeFormula})\nDate: ${new Date(note.timestamp).toLocaleString()}\nCategory: ${note.tag}\n\nState Snapshot:\n- Orbital Mode: ${note.snapshot.orbitalMode}\n- Style: ${note.snapshot.renderStyle}\n- Temperature: ${note.snapshot.temperatureK} K\n${note.snapshot.activeVibrationalModeName ? `- Vibration: ${note.snapshot.activeVibrationalModeName} (${note.snapshot.vibrationalFrequencyCm1} cm⁻¹)\n` : ''}${note.snapshot.measurementDistance ? `- Measured Distance: ${note.snapshot.measurementDistance.toFixed(3)} Å\n` : ''}${note.snapshot.measurementAngle ? `- Measured Angle: ${note.snapshot.measurementAngle.toFixed(1)}°\n` : ''}\nObservations:\n${note.content}`;

    navigator.clipboard.writeText(text);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 1800);
  };

  const handleExportMarkdown = () => {
    if (notes.length === 0) return;

    let md = `# Orbitalis Chemistry Lab Notebook\nGenerated on: ${new Date().toLocaleString()}\nTotal Observations: ${notes.length}\n\n---\n\n`;

    notes.forEach((note, idx) => {
      md += `### ${idx + 1}. ${note.title}\n`;
      md += `- **Molecule**: ${note.moleculeName} (\`${note.moleculeFormula}\`)\n`;
      md += `- **Timestamp**: ${new Date(note.timestamp).toLocaleString()}\n`;
      md += `- **Tag**: \`${note.tag}\`\n`;
      md += `- **Orbital Mode**: ${note.snapshot.orbitalMode}\n`;
      md += `- **Render Style**: ${note.snapshot.renderStyle}\n`;
      md += `- **Temperature**: ${note.snapshot.temperatureK} K\n`;
      if (note.snapshot.activeVibrationalModeName) {
        md += `- **Vibration**: ${note.snapshot.activeVibrationalModeName} (${note.snapshot.vibrationalFrequencyCm1} cm⁻¹)\n`;
      }
      if (note.snapshot.measurementDistance) {
        md += `- **Measured Distance**: ${note.snapshot.measurementDistance.toFixed(3)} Å\n`;
      }
      if (note.snapshot.measurementAngle) {
        md += `- **Measured Angle**: ${note.snapshot.measurementAngle.toFixed(1)}°\n`;
      }
      md += `\n**Observations & Analysis**:\n${note.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orbitalis-lab-notebook-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentFormula = properties?.formula || '';
  const displayedNotes = filterCurrentOnly
    ? notes.filter((n) => n.moleculeFormula.toUpperCase() === currentFormula.toUpperCase())
    : notes;

  return (
    <div className="rounded-xl border border-amber-200/80 bg-gradient-to-b from-amber-50/50 to-white shadow-xs transition-all overflow-hidden">
      {/* Collapsed / Shrunk Header bar with small notebook icon */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Small Notebook Icon that triggers expand/shrink */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Shrink Notebook' : 'Expand Lab Notebook'}
            className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800">Lab Notebook</h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Save observations & 3D state snapshots
            </p>
          </div>
        </div>

        {/* Expand / Shrink Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Shrink' : 'Expand'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expanded Notebook Drawer Section */}
      {isExpanded && (
        <div className="p-4 pt-1 border-t border-amber-100/80 space-y-4 text-xs animate-in fade-in duration-150">
          {/* Capture New Observation Form */}
          <form
            onSubmit={handleCaptureAndSave}
            className="p-3.5 rounded-xl bg-white border border-amber-200/90 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>Capture New State Snapshot</span>
              </div>
              {properties && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {properties.formula}
                </span>
              )}
            </div>

            {/* Live State Snapshot Tags Preview */}
            <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                Mode: {orbitalMode}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                Temp: {temperatureK} K
              </span>
              {activeVibrationalMode && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  {activeVibrationalMode.frequencyCm1} cm⁻¹
                </span>
              )}
              {measurement.distance !== undefined && (
                <span className="px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
                  Dist: {measurement.distance.toFixed(2)} Å
                </span>
              )}
              {measurement.angle !== undefined && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  Angle: {measurement.angle.toFixed(1)}°
                </span>
              )}
            </div>

            {/* Title & Tag Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={`Observation title (e.g., Lone pair repulsion)...`}
                className="sm:col-span-2 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <select
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-700"
              >
                <option value="Observation">Observation</option>
                <option value="VSEPR Analysis">VSEPR (Valence Shell Electron Pair Repulsion) Analysis</option>
                <option value="Spectroscopy">Spectroscopy</option>
                <option value="Reaction Mechanism">Reaction Mechanism</option>
                <option value="Lab Report">Lab Report</option>
              </select>
            </div>

            {/* Observations Content Textarea */}
            <textarea
              rows={2}
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Record your scientific observations, measured bond angles, or quantum reasoning..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white resize-none"
            />

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">
                Snapshots freeze current 3D angles & vibrations
              </span>
              <button
                type="submit"
                disabled={!properties}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Notebook</span>
              </button>
            </div>
          </form>

          {/* Filter Bar & Export Actions */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium text-[11px]">View:</span>
              <button
                onClick={() => setFilterCurrentOnly(true)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  filterCurrentOnly
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {currentFormula || 'Active'} Only
              </button>
              <button
                onClick={() => setFilterCurrentOnly(false)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  !filterCurrentOnly
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({notes.length})
              </button>
            </div>

            {notes.length > 0 && (
              <button
                onClick={handleExportMarkdown}
                title="Export all observations as a Markdown file"
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.md)</span>
              </button>
            )}
          </div>

          {/* List of Saved Notes */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">
                          {note.title}
                        </span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {note.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                        <span>{note.moleculeFormula}</span>
                        <span>·</span>
                        <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onRestoreSnapshot(note.snapshot, note.moleculeFormula)}
                        title="Restore 3D Scene to this Snapshot State"
                        className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyNote(note)}
                        title="Copy note text"
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        {copiedNoteId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        title="Delete note"
                        className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Note Content */}
                  <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                    {note.content}
                  </p>

                  {/* Snapshot Parameters Pills */}
                  <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono text-slate-500 pt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                      Orbital: {note.snapshot.orbitalMode}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                      {note.snapshot.temperatureK} K
                    </span>
                    {note.snapshot.vibrationalFrequencyCm1 && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {note.snapshot.vibrationalFrequencyCm1} cm⁻¹
                      </span>
                    )}
                    {note.snapshot.measurementDistance && (
                      <span className="px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {note.snapshot.measurementDistance.toFixed(2)} Å
                      </span>
                    )}
                    {note.snapshot.measurementAngle && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {note.snapshot.measurementAngle.toFixed(1)}°
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-slate-400 space-y-1">
                <FileText className="w-5 h-5 mx-auto text-slate-300" />
                <p className="text-xs">No observations saved for this view yet.</p>
                <p className="text-[10px] text-slate-400">
                  Click "Save to Notebook" above to capture observations and 3D states.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
