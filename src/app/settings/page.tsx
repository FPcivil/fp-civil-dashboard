"use client";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/FormField";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="Configure your dashboard preferences"
      />

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Account Settings
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 font-medium">Email</p>
              <p className="text-slate-900 mt-1">user@example.com</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Role</p>
              <p className="text-slate-900 mt-1">Project Manager</p>
            </div>
            <Button variant="secondary" className="mt-4">
              Change Password
            </Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Notification Settings
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-slate-700">Email notifications for new tasks</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-slate-700">Notify on overdue tasks</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-slate-700">Daily digest emails</span>
            </label>
          </div>
          <Button variant="secondary" className="mt-4">
            Save Preferences
          </Button>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Display Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Theme</label>
              <select className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Date Format</label>
              <select className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <Button variant="secondary" className="mt-4">
            Save Settings
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-red-700 mb-4">
            These actions cannot be undone. Please be careful.
          </p>
          <Button variant="danger">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
