import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MobileNavigation from "@/components/MobileNavigation";
import { ArrowLeft, Save } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Moon } from "lucide-react";

const SETTINGS_KEY = "appSettings";
interface AppSettings {
  displayName: string;
  liveOnLoad: boolean;
  refreshSeconds: number;
}

const DEFAULTS: AppSettings = {
  displayName: "",
  liveOnLoad: true,
  refreshSeconds: 3,
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      const name = localStorage.getItem("userName") || "";
      setSettings(
        stored
          ? { ...DEFAULTS, ...JSON.parse(stored) }
          : { ...DEFAULTS, displayName: name },
      );
    } catch {
      setSettings(DEFAULTS);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      if (settings.displayName) {
        localStorage.setItem("userName", settings.displayName);
      }
      setMessage("Settings saved.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Could not save settings.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <MobileNavigation />
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <div className="p-4 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/afl-dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Dashboard preferences</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark mode
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Applies immediately and is remembered on this device.
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>
              <div>
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  className="mt-1"
                  value={settings.displayName}
                  onChange={(e) =>
                    setSettings({ ...settings, displayName: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="liveOnLoad">Start in live mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Begin streaming updates when a page opens.
                  </p>
                </div>
                <Switch
                  id="liveOnLoad"
                  checked={settings.liveOnLoad}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, liveOnLoad: checked })
                  }
                />
              </div>

              <div>
                <Label htmlFor="refreshSeconds">Refresh interval (seconds)</Label>
                <Input
                  id="refreshSeconds"
                  type="number"
                  min={1}
                  max={60}
                  className="mt-1 w-32"
                  value={settings.refreshSeconds}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      refreshSeconds: Number(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                {message && (
                  <span className="text-sm text-green-700" role="status">
                    {message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}