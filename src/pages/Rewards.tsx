import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, History } from "lucide-react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import PageContainer from "@/components/PageContainer";
import PointsBadge from "@/components/PointsBadge";
import RewardCard from "@/components/RewardCard";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import BottomSheet from "@/components/BottomSheet";
import { useGame } from "@/contexts/GameContext";
import type { Reward } from "@/lib/types";

const EMOJI_OPTIONS = ["🎬", "🍕", "☕", "📱", "🧖", "🎮", "🎵", "📚", "🍰", "🛍️", "🏖️", "🎨"];
const QUICK_COSTS = [50, 100, 250, 500, 1000, 2000];

const Rewards = () => {
  const { gameState, levelInfo, claimReward, addReward, removeReward, unlockedMilestones } = useGame();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationReward, setCelebrationReward] = useState<Reward | null>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // New reward form
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎬");
  const [newCost, setNewCost] = useState("100");

  const regularRewards = gameState.rewards.filter((r) => !r.isMilestone);
  const milestoneRewards = gameState.rewards.filter((r) => r.isMilestone);
  const claimedIds = gameState.claimedRewards.map((r) => r.rewardId);

  const handleClaim = (reward: Reward) => {
    const success = claimReward(reward);
    if (success) {
      setCelebrationReward(reward);
      setShowCelebration(true);
    }
  };

  const handleAddReward = () => {
    if (!newName.trim() || !newCost) return;
    const reward: Reward = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      emoji: newEmoji,
      pointCost: parseInt(newCost, 10),
      isMilestone: false,
    };
    addReward(reward);
    setNewName("");
    setNewCost("100");
    setAddSheetOpen(false);
  };

  return (
    <PageContainer>
      <Helmet>
        <title>Palkinnot – CEO Planner Pro</title>
      </Helmet>

      {/* Points hero */}
      <Card className="mb-5 overflow-hidden bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-gold/30">
        <CardContent className="p-6 text-center">
          <p className="text-xs text-muted-foreground mb-1">Käytettävissä</p>
          <PointsBadge points={gameState.currentPoints} size="lg" className="justify-center" />
          <p className="text-xs text-muted-foreground mt-2">
            Taso {levelInfo.level}: {levelInfo.name} · Yhteensä {gameState.lifetimePoints}p
          </p>
        </CardContent>
      </Card>

      {/* Unlocked milestones */}
      {unlockedMilestones.length > 0 && (
        <Card className="mb-4 border-gold/40 animate-pulse-glow">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-2">Uusia saavutuksia!</h3>
            {unlockedMilestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-sm font-medium">{m.name}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleClaim(m)}
                  className="bg-gold hover:bg-gold/90 text-gold-foreground text-xs"
                >
                  Vastaanota
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" className="flex-1" onClick={() => setAddSheetOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Lisää palkinto
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(true)}>
          <History className="w-5 h-5" />
        </Button>
      </div>

      {/* Regular rewards */}
      <div className="space-y-3 mb-6">
        <h2 className="font-semibold text-sm px-1">Palkinnot</h2>
        {regularRewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            currentPoints={gameState.currentPoints}
            lifetimePoints={gameState.lifetimePoints}
            isClaimed={false}
            onClaim={() => handleClaim(reward)}
            onRemove={() => removeReward(reward.id)}
          />
        ))}
      </div>

      {/* Milestones */}
      {milestoneRewards.length > 0 && (
        <div className="space-y-3 mb-6">
          <h2 className="font-semibold text-sm px-1">Saavutukset</h2>
          {milestoneRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              currentPoints={gameState.currentPoints}
              lifetimePoints={gameState.lifetimePoints}
              isClaimed={claimedIds.includes(reward.id)}
              onClaim={() => handleClaim(reward)}
            />
          ))}
        </div>
      )}

      {/* Add reward sheet */}
      <BottomSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} title="Uusi palkinto">
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Nimi</Label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="esim. Leffa-ilta" />
          </div>
          <div>
            <Label className="text-xs">Emoji</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  className={`text-2xl p-1 rounded-lg ${newEmoji === e ? "ring-2 ring-[hsl(var(--brand))]" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs">Hinta (pistettä)</Label>
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {QUICK_COSTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewCost(String(c))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    newCost === String(c)
                      ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand)/0.08)]"
                      : "border-transparent bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {c}p
                </button>
              ))}
            </div>
            <Input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} min="10" step="10" />
          </div>
          <Button onClick={handleAddReward} className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white">
            Lisää palkinto
          </Button>
        </div>
      </BottomSheet>

      {/* History sheet */}
      <BottomSheet open={historyOpen} onOpenChange={setHistoryOpen} title="Lunastetut palkinnot">
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {gameState.claimedRewards.length === 0 ? (
            <p className="text-sm text-muted-foreground">Et ole vielä lunastanut palkintoja.</p>
          ) : (
            [...gameState.claimedRewards].reverse().map((cr, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <span className="text-xl">{cr.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{cr.rewardName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {cr.pointCost}p · {format(new Date(cr.claimedAt), "d.M.yyyy", { locale: fi })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </BottomSheet>

      <CelebrationOverlay
        show={showCelebration}
        message={`${celebrationReward?.name} lunastettu!`}
        emoji={celebrationReward?.emoji ?? "🎉"}
        onDone={() => setShowCelebration(false)}
      />
    </PageContainer>
  );
};

export default Rewards;
