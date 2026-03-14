import { getGlobalSettings } from "@/actions/settings"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const settings = await getGlobalSettings()
  // Assuming English text since I don't know the full translations,
  // but let's provide basic structure

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your global site configuration and preferences.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
