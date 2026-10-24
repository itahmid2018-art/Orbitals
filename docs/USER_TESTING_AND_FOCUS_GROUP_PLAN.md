# Orbitalis — User Testing & Focus Group Strategy Plan

**Document Title:** Comprehensive Usability Study & Diverse Focus Group Research Protocol  
**Research Lead:** Staff UX Researcher & Product Manager (Google UXR Framework)  
**Study Type:** Mixed-Methods (Moderated Cognitive Walkthroughs + Unmoderated Benchmark Usability)  
**Target Participant Size:** $N = 60$ Participants across 4 Stratified Cohorts  
**Status:** Ready for Execution (Sprint 12)  

---

## 1. Research Objectives & Core Hypotheses

### 1.1 Objectives
1. **Validate Time-to-Value & Onboarding:** Determine if first-time chemistry students reach their "Aha!" moment within **≤ 45 seconds** of arriving at the default landing page.
2. **Evaluate Feature Learnability & Ergonomics:**
   - Can students discover and use the **'Snap-to-Orbit'** toggle to comprehend idealized symmetry vs real-world lone-pair angle distortions?
   - Can students intuitively measure interatomic distances and 3-atom bond angles without explicit instructions?
   - Is the isolated mouse-wheel canvas zooming clear and preventing unwanted page scrolling?
3. **Assess 2D vs 3D Cognitive Value:** Gauge whether switching between 3D Studio PBR and 2D Planar ChemView clarifies resonance and stereochemical orientation.
4. **Benchmark Accessibility & Visual Inclusivity:** Validate color-contrast, quantum energy color schemes for colorblind users, and mobile/touch ergonomics.

### 1.2 Core Hypotheses to Test
- **$H_1$ (Spatial Intuition):** Students interacting with the 3D bond angle caliper and Snap-to-Orbit will answer VSEPR angle distortion questions with **≥ 35% higher accuracy** than students consulting static textbook tables.
- **$H_2$ (Frictionless Onboarding):** The interactive website walkthrough will yield a **Task Completion Rate (TCR) of ≥ 90%** for first-time molecule search and measurement tasks.
- **$H_3$ (Low-End Hardware Usability):** Students using low-spec Chromebooks and mobile devices will achieve **≥ 30 FPS rendering** and report satisfaction scores comparable to high-end desktop users.

---

## 2. Participant Recruitment Matrix: Age Groups, Audiences & Diversity

To ensure representative, unbiased feedback, the study recruits **$N = 60$ participants** stratified across 4 distinct user cohorts with strict demographic, socioeconomic, and accessibility quotas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PARTICIPANT SAMPLING MATRIX (N = 60)                     │
├──────────┬─────────────────────────────┬──────┬─────────────────────────────┤
│ Cohort   │ Segment                     │ Size │ Age Range & Key Background  │
├──────────┼─────────────────────────────┼──────┼─────────────────────────────┤
│ Cohort A │ High School AP/IB Chemistry │ 18   │ Ages 15–18 (Title I & Reg)  │
│ Cohort B │ Undergrad College Chemistry │ 20   │ Ages 18–22 (Gen Chem/O-Chem)│
│ Cohort C │ Chemistry Teachers & TAs    │ 12   │ Ages 24–62 (Educators)      │
│ Cohort D │ Graduate & Industry Labs    │ 10   │ Ages 23–40 (Research/Biotech│
└──────────┴─────────────────────────────┴──────┴─────────────────────────────┘
```

### 2.1 Demographic Diversity Quotas
- **Gender Balance:** 50% Female / Non-Binary, 50% Male (actively supporting women and underrepresented groups in STEM).
- **Socio-Economic & School Type Diversity:**
  - 40% from public Title I high schools and regional state community colleges.
  - 40% from accredited public/private 4-year research universities.
  - 20% international students (ESL / English as a Second Language learners).
- **Device & Operating System Distribution:**
  - 30% Google ChromeOS / School-issued Chromebooks (Intel Celeron / 4GB RAM).
  - 30% Windows 10/11 Laptops (Mid-tier).
  - 25% Apple macOS (MacBook Air / Pro).
  - 15% Mobile & Tablet (iOS Safari on iPad/iPhone, Android Chrome).
- **Accessibility & Neurodiversity Inclusivity:**
  - Minimum **6 participants with color-vision deficiencies** (Deuteranopia, Protanopia, Tritanopia) to evaluate the Quantum Numbers $(n, l, m)$ color palettes and ESP rainbow gradients.
  - Minimum **6 participants with ADHD or neurodiverse learning profiles** to assess UI visual clutter and attention flow.

---

## 3. Step-by-Step Usability Testing Strategy & Execution Protocol

The testing strategy follows a **4-Phase Mixed-Methods Protocol**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Screening, Intake & Baseline Pre-Test (10 mins)               │
│ Screener survey, demographic logging, prior chemistry tool exposure.   │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Unmoderated Usability Tasks with Think-Aloud (30 mins)        │
│ 5 standardized hands-on tasks recorded via screen + audio capture.    │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Moderated Qualitative Cognitive Walkthrough (15 mins)         │
│ Deep-dive 1:1 interview exploring pain points, confusion, & "aha!"s.   │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Post-Study Psychometrics & Debrief (10 mins)                  │
│ SUS survey, UMUX-Lite, CSAT, Feature Request ranking, incentive.      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Pre-Test Screener & Baseline Assessment
1. **Consent & Ethics:** Verify parental consent for minor participants (Ages 15–17); provide digital IRB/consent disclosure.
2. **Baseline Knowledge Check:** 3 quick multiple-choice questions assessing chemistry familiarity (e.g., "What is the bond angle of water?", "What does $sp^3$ mean?").
3. **Hardware & Environment Check:** Record browser type, screen resolution, connection speed, and input device (mouse, trackpad, touchscreen).

---

### Phase 2: Core Usability Tasks (Hands-On Scenarios)

Participants are presented with **5 standardized scenarios** using the Think-Aloud protocol (encouraging users to verbalize their thoughts, expectations, and hesitations).

#### Task 1: First Impression & Molecular Ingestion
- **Prompt:** *"You have just arrived at Orbitalis. Look around the landing page, enter the 3D Molecular Workbench, and display the 3D structure of Methane ($CH_4$)."*
- **Success Criteria:** User clicks "Launch 3D Workbench" from the landing page or uses the search bar/quick chips to render $CH_4$ within **≤ 35 seconds**.
- **Metrics Logged:** Time on Task (ToT), First Click Choice, Hesitation Duration, Navigation Pathway.

#### Task 2: 3D Point-and-Click Bond Angle Caliper
- **Prompt:** *"Measure the bond angle between the Hydrogen-Oxygen-Hydrogen atoms in Water ($H_2O$) to determine its exact bent geometry."*
- **Success Criteria:** User clicks 3 atoms sequentially; system highlights central vertex atom and renders the 3D angle badge ($104.5^\circ$).
- **Metrics Logged:** Number of misclicks, time to identify 3D arc, user verbal reaction to VSEPR comparison badge.

#### Task 3: 'Snap-to-Orbit' Standardized Symmetry Analysis
- **Prompt:** *"Using the orbital controls, visualize the hybrid orbitals for Water ($H_2O$). Then, activate 'Snap-to-Orbit' to compare its actual shape with the ideal parent geometry."*
- **Success Criteria:** User locates either the on-canvas HUD button, bottom dock toggle, or Orbitals inspector tab; activates Snap-to-Orbit; notices alignment to standard tetrahedral axes ($109.5^\circ$).
- **Metrics Logged:** Discoverability rate of Snap-to-Orbit switch, comprehension of dashed symmetry guide rays.

#### Task 4: 2D Planar ChemView & Periodic Table Inspection
- **Prompt:** *"Switch the molecule into 2D Planar ChemView. After viewing, navigate to the Periodic Table and find the electronegativity of Fluorine (F)."*
- **Success Criteria:** User toggles the 2D button on the left floating sidebar; then opens the Periodic Table and locates Fluorine ($EN = 3.98$).
- **Metrics Logged:** Sidebar discoverability, heatmap mode interaction, time to return to 3D canvas.

#### Task 5: Lab Notebook Observation & Report Capture
- **Prompt:** *"Capture the current molecular state into your Lab Notebook, add a brief observation note ('Water bent geometry with standard axes snapped'), and export your report."*
- **Success Criteria:** User opens Lab Notebook tab, clicks "Capture 3D State Snapshot", types note, and clicks "Export Markdown".
- **Metrics Logged:** Form completion rate, perception of snapshot thumbnail, export satisfaction.

---

### Phase 3: Moderated Qualitative Interview & Cognitive Debrief

Conducted by the UX researcher immediately following the tasks:
1. **The "Aha!" Discovery:** *"At what specific moment during the session did the molecule's shape make the most sense to you?"*
2. **Visual Hierarchy & Clutter:** *"Was there any point where you felt overwhelmed by buttons or data? What would you remove?"*
3. **Comparison to Prior Tools:** *"How does this experience compare to your textbook diagrams, plastic model kits, or other chemistry software you've used?"*
4. **Color & Quantum Visualization:** *"When looking at the orbital clouds, what did the color differences mean to you? Was the distinction between phase (+/−) and energy level clear?"*

---

### Phase 4: Standardized Psychometrics & Quantitative Surveys

Every participant completes a standardized survey measuring usability, cognitive load, and visual appeal:

1. **System Usability Scale (SUS):** 10-item industry-standard Likert scale (Score 0–100, targeting **≥ 82** for Top 10% benchmark).
2. **Single Ease Question (SEQ):** 7-point scale asked immediately after each task (*"Overall, how easy or difficult was this task to complete?"*).
3. **NASA-TLX (Task Load Index - Simplified):** Measures mental demand, effort, and frustration.
4. **Net Promoter Score (NPS):** *"How likely are you to recommend Orbitalis to a classmate, student, or fellow researcher?"* (Scale 0–10).

---

## 4. Quantitative Metrics, Targets & Evaluation Framework

| Metric Category | Specific KPI | Benchmark / Target | Action Threshold (Requires Fix) |
|---|---|---|---|
| **Effectiveness** | Task Completion Rate (TCR) across all 5 tasks | **≥ 90%** overall completion | $< 75\%$ on any single task |
| **Efficiency** | Time-on-Task (ToT): Task 1 (Search & Render) | **≤ 30 seconds** | $> 60$ seconds |
| **Efficiency** | Time-on-Task (ToT): Task 2 (Angle Measurement)| **≤ 40 seconds** | $> 90$ seconds |
| **Usability** | System Usability Scale (SUS) Score | **≥ 82 / 100** (Grade A) | $< 72 / 100$ |
| **Learnability** | Interactive Walkthrough Completion Rate | **≥ 85%** of those who start | $< 65\%$ completion |
| **Satisfaction** | Single Ease Question (SEQ) Mean | **≥ 5.8 / 7.0** | $< 4.5 / 7.0$ |
| **Hardware Health**| Minimum Frame Rate on Chromebooks / Tablets | **≥ 35 FPS** | $< 24$ FPS (Jank/Stutter) |
| **Accessibility** | Colorblind Cohort Accuracy on Orbital Color Identification | **≥ 88%** accuracy | $< 70\%$ accuracy |

---

## 5. Post-Study Feedback Triaging & Engineering Handoff

Following Google’s UXR bug triaging standards, all usability findings are categorized into a **Severity Matrix**:

```
┌───────────┬────────────────────────────────────────────────────────┬─────────────┐
│ Severity  │ Definition                                             │ SLA for Fix │
├───────────┼────────────────────────────────────────────────────────┼─────────────┤
│ P0: Blocker│ User cannot complete task; app crashes or locks up.   │ 48 Hours    │
│ P1: Major │ User struggles significantly, experiences high mental  │ 1 Sprint    │
│           │ frustration, or misinterprets key chemical scientific  │             │
│           │ data (e.g. inverted bond angles).                     │             │
│ P2: Minor │ Cosmetic misalignment, minor lag, ambiguous tooltip.   │ 2 Sprints   │
│ P3: Trivial│ Subjective aesthetic preference or non-critical enhancement│ Backlog │
└───────────┴────────────────────────────────────────────────────────┴─────────────┘
```

### Deliverables Produced from the Study:
1. **Executive Usability Brief:** 2-page slide deck summarizing SUS, task success rates, and the 3 highest-priority design recommendations for engineering.
2. **Rainbow Spreadsheet:** Comprehensive participant-by-task matrix recording all observed behavioral slips, hesitation pauses, and participant quotes.
3. **Video Highlight Reel (3 mins):** Edited compilation showcasing participants experiencing the "Aha!" moment on Snap-to-Orbit and the 3D bond angle caliper to align team stakeholders.
