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
      <Card className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/[0.08] border-gold/30">
        <CardContent className="p-6 text-center">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Käytettävissä</p>
          <PointsBadge points={gameState.currentPoints} size="lg" className="justify-center" />
          <p className="text-[10px] text-muted-foreground mt-2">
            Taso {levelInfo.level}: {levelInfo.name} · Yhteensä {gameState.lifetimePoints}p
          </p>
        </CardContent>
      </Card>

      {/* Unlocked milestones */}
      {unlockedMilestones.length > 0 && (
        <Card className="mb-4 border-gold/40 animate-pulse-glow rounded-2xl">
          <CardContent className="p-4">
            <h3 className="font-display text-base font-bold mb-2">Uusia saavutuksia!</h3>
            {unlockedMilestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-[13px] font-medium">{m.name}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleClaim(m)}
                  className="bg-gold hover:bg-gold/90 text-gold-foreground text-xs font-bold rounded-xl"
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
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={() => setAddSheetOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Lisää palkinto
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(true)} className="rounded-xl">
          <History className="w-5 h-5" />
        </Button>
      </div>

      {/* Regular rewards */}
      <div className="space-y-3.5 mb-6">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Palkinnot</h2>
        {regularRewards.map((reward, index) => (
          <div key={reward.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <RewardCard
              reward={reward}
              currentPoints={gameState.currentPoints}
              lifetimePoints={gameState.lifetimePoints}
              isClaimed={false}
              onClaim={() => handleClaim(reward)}
              onRemove={() => removeReward(reward.id)}
            />
          </div>
        ))}
      </div>

      {/* Milestones */}
      {milestoneRewards.length > 0 && (
        <div className="space-y-3.5 mb-6">
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Saavutukset</h2>
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
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Nimi</Label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="esim. Leffa-ilta" className="rounded-xl" />
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Emoji</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  className={`text-2xl p-1 rounded-lg ${newEmoji === e ? "ring-2 ring-gold" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Hinta (pistettä)</Label>
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {QUICK_COSTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewCost(String(c))}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    newCost === String(c)
                      ? "border-gold/40 bg-gold/[0.08] text-gold"
                      : "border-border bg-transparent text-muted-foreground"
                  }`}
                >
                  {c}p
                </button>
              ))}
            </div>
            <Input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} min="10" step="10" className="rounded-xl" />
          </div>
          <Button
            onClick={handleAddReward}
            disabled={!newName.trim()}
            className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-bold rounded-xl py-3.5 disabled:bg-muted disabled:text-muted-foreground"
          >
            Lisää palkinto
          </Button>
        </div>
      </BottomSheet>

      {/* History sheet */}
      <BottomSheet open={historyOpen} onOpenChange={setHistoryOpen} title="Lunastetut palkinnot">
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {gameState.claimedRewards.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">Et ole vielä lunastanut palkintoja.</p>
          ) : (
            [...gameState.claimedRewards].reverse().map((cr, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-muted border border-border">
                <span className="text-xl">{cr.emoji}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium">{cr.rewardName}</p>
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
