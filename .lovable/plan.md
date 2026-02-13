
# CEO Planner Pro – Kokonaisuudistus

Tama on laaja uudistus, joka muuttaa sovelluksen 5-pilarin CEO-suunnittelujaarjestelmaksi. Toteutus etenee 12 vaiheessa.

## Yhteenveto muutoksista

Sovellus muuttuu nykyisesta 4-sivuisesta tehtavalistasta 3-sivuiseksi CEO-suunnittelualustaksi, jossa on:
- **5 pilaria** (Myynti, Automaatio, Strategia, Sammakot, Arki) kategorioiden tilalle
- **MIT-tehtavat** (3 tarkeinta paivassa) korvaa vanhan "top 3" -logiikan
- **Paivittaiset tavat** (habits) uutena ominaisuutena
- **Energiatason valinta** (korkea/normaali/matala)
- **Bottom sheet -kayttolittyma** dialogien tilalle
- **Dashboard-sivu** joka yhdistaa vanhan etusivun ja paivasuunnitelman
- **Uusittu pisteyjarjestelma** (MIT 25p, sammakko 20p, tavat, bonukset)
- **Animaatiot** (sammakko-bounce, check-pop, pistepop jne.)

## Vaiheet

### Vaihe 1: Tietomalli ja pilarit
- Luodaan `src/lib/pillars.ts` – 5 pilarin konfiguraatio (sales, automation, strategy, frog, life)
- Paivitetaan `src/lib/types.ts` – DailyTask saa `pillar`, `isMIT`, `goalId` -kentat; WeekGoal-tyyppi; Habit-tyyppi; HabitCompletionData
- Paivitetaan `src/lib/storage.ts` – migraatiologiikka vanhasta datasta, habit-funktiot, DEFAULT_HABITS

### Vaihe 2: Pisteyjarjestelma
- Paivitetaan `src/lib/gamification.ts` – uusi pistekaava: MIT 25p, frog 20p, normaali 10p, habit-pisteet, bonukset, streak-kerroin

### Vaihe 3: Custom hookit
- Paivitetaan `useWeekPlan.ts` – WeekGoal[]-tuki, addGoal/removeGoal, autosave
- Paivitetaan `useDailyPlan.ts` – pillar-pohjainen, MIT-suodatus, energy-tila
- Luodaan `useHabits.ts` – tapojen hallinta ja pisteytys
- Paivitetaan `useGameState.ts` – habit-tuki, addHabit/removeHabit

### Vaihe 4: Navigaatio ja reititys
- Paivitetaan `App.tsx` – 3 reittia: /, /viikko, /palkinnot
- Paivitetaan `BottomNav.tsx` – 3 valilehtea (Tanaan, Viikko, Palkinnot)
- Poistetaan DailyPlan.tsx ja Index.tsx (korvataan DashboardPage:lla)

### Vaihe 5: Yhteiset UI-komponentit
- `PillarBadge.tsx` – pilarin emoji+nimi varitaustalla
- `ProgressRing.tsx` – SVG-ympyra progressille
- `EnergySelector.tsx` – 3 energiatasoa vinkkiteksteilla
- `TaskRow.tsx` – tehtavarivi MIT/frog-tuella ja animaatioilla
- `BottomSheet.tsx` – yleinen pohjaruutu-wrapper

### Vaihe 6: Tapa- ja tehtavakomponentit
- `HabitStrip.tsx` – horisontaalinen emoji-ympyrarivi
- `MITCard.tsx` – "Paivan 3 tarkeinta" kortti ProgressRingilla
- `TabbedTaskList.tsx` – pilari-valilehtinen tehtavalista
- `WeekIntention.tsx` – viikkotavoite-overlay

### Vaihe 7: Bottom sheet -komponentit
- `AddTaskSheet.tsx` – tehtavan lisays pilarivalinnalla, MIT-toggle, tavoitelinkitys
- `AddHabitSheet.tsx` – tavan lisays (emoji, paivat, pisteet)
- `AddGoalSheet.tsx` – viikkotavoitteen lisays pilarivalinnalla

### Vaihe 8: Dashboard-sivu
- `DashboardPage.tsx` – paasivu: header + energy + habits + MIT-kortti + tabbed lista + FAB + WeekIntention overlay

### Vaihe 9: Viikkosivu
- Uusittu `WeekPlan.tsx` – pilarilaskurit, viikkotavoitteet GoalSheetilla, linkitetyt tehtavat, progress-palkit

### Vaihe 10: Palkinnot-sivun paivitys
- Poistetaan category-kentta, dialogit -> BottomSheet, pistehinnan pikavalintanapit

### Vaihe 11: Animaatiot
- Tailwind keyframes: check-pop, frog-bounce, frog-eat, points-pop, habit-pop, sheet-up, streak-flame

### Vaihe 12: Siivous ja viimeistely
- Migraatiologiikan varmistus (vanha data -> uusi)
- Kayttamattomien tiedostojen poisto (TaskInput, TaskItem, PageContainer, ThemeToggle)
- Importtien tarkistus, mobile-optimointi

## Tekniset yksityiskohdat

### Uudet tiedostot (11 kpl)
- `src/lib/pillars.ts`
- `src/hooks/useHabits.ts`
- `src/components/PillarBadge.tsx`
- `src/components/ProgressRing.tsx`
- `src/components/EnergySelector.tsx`
- `src/components/TaskRow.tsx`
- `src/components/BottomSheet.tsx`
- `src/components/HabitStrip.tsx`
- `src/components/MITCard.tsx`
- `src/components/TabbedTaskList.tsx`
- `src/components/WeekIntention.tsx`
- `src/components/AddTaskSheet.tsx`
- `src/components/AddHabitSheet.tsx`
- `src/components/AddGoalSheet.tsx`
- `src/pages/DashboardPage.tsx`

### Paivitettavat tiedostot (9 kpl)
- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/lib/gamification.ts`
- `src/hooks/useWeekPlan.ts`
- `src/hooks/useDailyPlan.ts`
- `src/hooks/useGameState.ts`
- `src/contexts/GameContext.tsx`
- `src/App.tsx`
- `src/components/BottomNav.tsx`
- `src/pages/WeekPlan.tsx`
- `src/pages/Rewards.tsx`
- `tailwind.config.ts`

### Poistettavat tiedostot (6 kpl)
- `src/pages/DailyPlan.tsx`
- `src/pages/Index.tsx`
- `src/components/TaskInput.tsx`
- `src/components/TaskItem.tsx`
- `src/components/PageContainer.tsx`
- `src/components/ThemeToggle.tsx`

### Datan migraatio
- Vanha `category: "project"` -> `pillar: "sales"`, `"work"` -> `"automation"`, `"personal"` -> `"life"`
- Vanha `goals: string[]` -> `goals: WeekGoal[]` oletuspilarilla "sales"
- GameState saa `habits: DEFAULT_HABITS` jos puuttuu
