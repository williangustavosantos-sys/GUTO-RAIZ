# UI Kit · GUTO Coach Panel (dark / ops surface)

This UI kit is a thin wrapper over the implemented `coach-panel/` artifact at the project root. The Coach Panel **is** the UI kit for GUTO's dark/ops surface — its components, atoms, icons, and screens are already cleanly factored across four files and exported on `window.*` for reuse.

## Files (live in `coach-panel/` at the project root)

| File | Exports |
|---|---|
| `panel-data.jsx` | `MOCK_STUDENTS`, `MOCK_COACHES`, `MOCK_TEAMS`, `MOCK_LOGS`, `MOCK_RANKINGS`, helpers `calcRisk` / `relativeTime` / `coachName` / `subLabel` / `avatarLabel` / `formatDate` |
| `panel-shell.jsx` | Tokens (`T`), atoms (`Plate`, `Kicker`, `Label`, `Pill`, `Btn`, `SearchBox`, `DataRow`, `SectionTitle`), icon factory (`SI`) + 21 stroked Lucide-style icons, `Sidebar`, `Header` |
| `panel-screens.jsx` | `HojeScreen`, `AlunosScreen`, `QueueScreen`, `ArenaScreen`, `CoachesScreen`, `TimesScreen`, `LogsScreen`, `TweaksScreen`, `ActiveScreen` router, `RiskPill`, `SubPill` |
| `panel-student.jsx` | `StudentPanel` overlay (slide-in detail with tabs) |
| `Coach Panel.html` | App shell, mounts everything, owns the React Context + Tweaks state |

## How to use a piece

Open `coach-panel/Coach Panel.html`. Atoms and icons are global on `window` once the scripts load — drop them straight into a new `<script type="text/babel">`:

```jsx
const { Plate, Kicker, Pill, Btn, T, IPlus } = window;

<Plate glow style={{ padding: 18 }}>
  <Kicker cyan>RANKING SEMANAL</Kicker>
  <Btn cyan onClick={…}><IPlus size={12}/>+ Aluno</Btn>
  <Pill tone="ok">EM DIA</Pill>
</Plate>
```

Tokens live on `window.T` — reach for `T.cyan`, `T.cyanSoft`, `T.cyanLine`, `T.fg`, `T.fg2…fg4`, `T.panel`, `T.border`, `T.borderHi`, `T.ok / okS / warn / warnS / bad / badS`, `T.mono`.

## Screens implemented (interactive in `Coach Panel.html`)

1. **Hoje** — daily ops dashboard: 4 stat cards (Ativos / Treinos hoje / Atenção / Críticos) + priority list of at-risk students + quick actions
2. **Alunos** — full student table with search, status filter, coach filter, risk pill, XP, last validation, subscription pill, avatar stage
3. **Treinos** — workout queue, sorted by risk, click-through to student detail's `treino` tab
4. **Dietas** — same pattern, `dieta` tab
5. **Arena** — three-column ranking (semanal / mensal / geral) with `<Name> & GUTO` pair cards
6. **Coaches** — one plate per coach, activate/pause/delete actions
7. **Times** — selectable team plates; `glow` highlights the selected team
8. **Logs** — system audit trail
9. **Tweaks** — settings/calibration screen with segmented controls, sliders, and color swatches (the prototype's own tweak panel)

## Plus an overlay

**Student detail panel** — slides in from the right (`220ms cubic-bezier(0.16,1,0.3,1)`), tabbed (Resumo / Treino / Dieta / Acesso / Logs).

## Where to start a new screen

If you're adding a new screen, follow the established pattern:

```jsx
function MyScreen() {
  const ctx = React.useContext(window.PanelCtx);
  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 28 }}>
      <SectionTitle>SEÇÃO</SectionTitle>
      <Plate style={{ padding: 18 }}>…</Plate>
    </div>
  );
}
```

Then add it to the `NAV` array in `panel-shell.jsx` and the `switch` in `ActiveScreen` (`panel-screens.jsx`).

## Design tokens

The dark-mode token vocabulary is duplicated literally in `panel-shell.jsx` (`T = {…}`) for direct access without CSS-var indirection. The light-mode tokens live in the project-root `colors_and_type.css` (`--guto-*`). Both share the same scale and naming pattern — pick the surface, then pull from the matching layer.

## Live preview

Open `coach-panel/Coach Panel.html` in the preview pane. Click the sidebar items to walk through every screen. The Tweaks tab persists all changes back to disk via the editor protocol.
