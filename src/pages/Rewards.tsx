import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, History } from "lucide-react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import PageContainer from "@/components/PageContainer";
import PointsBadge from "@/components/PointsBadge";
import RewardCard from "@/components/RewardCard";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import { useGame } from "@/contexts/GameContext";
import type { Reward } from "@/lib/types";

const EMOJI_OPTIONS = ["🎬", "🍕", "☕", "📱", "🧖", "🎮", "🎵", "📚", "🍰", "🛍️", "🏖️", "🎨"];

const Rewards = () => {
  const { gameState, levelInfo, claimReward, addReward, removeReward, unlockedMilestones } = useGame();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationReward, setCelebrationReward] = useState<Reward | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // New reward form
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎬");
  const [newCost, setNewCost] = useState("100");
  const [newCategory, setNewCategory] = useState<"pieni" | "keskikokoinen" | "suuri">("pieni");

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
      category: newCategory,
      isMilestone: false,
    };
    addReward(reward);
    setNewName("");
    setNewCost("100");
    setDialogOpen(false);
  };

  return (
    <PageContainer>
      <Helmet>
        <title>Palkinnot – Pelillistetty Suunnittelija</title>
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

      {/* Unlocked milestones notification */}
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Lisää palkinto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uusi palkinto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nimi</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="esim. Leffa-ilta"
                />
              </div>
              <div>
                <Label>Emoji</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setNewEmoji(e)}
                      className={`text-2xl p-1 rounded-lg transition-all ${
                        newEmoji === e
                          ? "bg-gold/20 ring-2 ring-gold"
                          : "hover:bg-muted"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Hinta (pistettä)</Label>
                <Input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  min="10"
                  step="10"
                />
              </div>
              <div>
                <Label>Kategoria</Label>
                <Select
                  value={newCategory}
                  onValueChange={(v) => setNewCategory(v as typeof newCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieni">Pieni (päivittäinen)</SelectItem>
                    <SelectItem value="keskikokoinen">Keskikokoinen (viikottainen)</SelectItem>
                    <SelectItem value="suuri">Suuri (kuukausittainen)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddReward}
                className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white"
              >
                Lisää palkinto
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <History className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lunastetut palkinnot</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {gameState.claimedRewards.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Et ole vielä lunastanut palkintoja.
                </p>
              ) : (
                [...gameState.claimedRewards].reverse().map((cr, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-xl">{cr.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cr.rewardName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {cr.pointCost}p ·{" "}
                        {format(new Date(cr.claimedAt), "d.M.yyyy", {
                          locale: fi,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
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

      {/* Milestone rewards */}
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

      {/* Celebration */}
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
