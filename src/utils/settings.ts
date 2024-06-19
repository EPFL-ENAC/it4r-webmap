import { LocalStorage } from 'quasar';

const APP_COOKIE_NAME = '_settings';

export type Settings = {
  intro_shown: boolean;
  theme?: string;
};

export function getSettings(): Settings {
  let settings: Settings = {
    intro_shown: false,
    theme: 'light',
  };
  const settingsSaved = LocalStorage.getItem(APP_COOKIE_NAME);
  // cookies.get() declares to return a string but apparently it automatically parses the JSON string to an object
  if (settingsSaved !== null) {
    if (typeof settingsSaved === 'string') {
      settings = JSON.parse(settingsSaved);
    } else if (typeof settingsSaved === 'object') {
      settings = settingsSaved as Settings;
    }
  }
  return settings;
}

export function saveSettings(settings: Settings) {
  LocalStorage.set(APP_COOKIE_NAME, JSON.stringify(settings));
}
