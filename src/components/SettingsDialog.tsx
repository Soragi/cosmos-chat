import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Check, X, Trash2 } from 'lucide-react';
import { ChatSettings, DEFAULT_SETTINGS } from '@/types/chat';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getSettings: () => ChatSettings;
  saveSettings: (settings: Partial<ChatSettings>) => ChatSettings;
  testConnection: (url?: string) => Promise<boolean>;
  onClearHistory: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  getSettings,
  saveSettings,
  testConnection,
  onClearHistory,
}: SettingsDialogProps) {
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  useEffect(() => {
    if (open) {
      setSettings(getSettings());
      setTestResult(null);
    }
  }, [open, getSettings]);

  const handleSave = () => {
    saveSettings(settings);
    onOpenChange(false);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testConnection(settings.backendUrl);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      onClearHistory();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your AIQ Research Assistant connection and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Backend URL */}
          <div className="space-y-3">
            <Label htmlFor="backend-url" className="text-foreground">
              Backend URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="backend-url"
                value={settings.backendUrl}
                onChange={(e) => setSettings({ ...settings, backendUrl: e.target.value })}
                placeholder="http://localhost:8000"
                className="bg-secondary border-border"
              />
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="border-border"
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : testResult === true ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : testResult === false ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : (
                  'Test'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The URL of your running AIQ Research Assistant backend.
            </p>
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations" className="text-foreground">
                Animations
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable cosmic background and agent visualizations.
              </p>
            </div>
            <Switch
              id="animations"
              checked={settings.animationsEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, animationsEnabled: checked })
              }
            />
          </div>

          {/* Clear History */}
          <div className="pt-4 border-t border-border">
            <Button
              variant="destructive"
              onClick={handleClearHistory}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Conversations
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
