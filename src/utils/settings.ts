import { Cookies } from 'quasar';

const APP_COOKIE_NAME = '_settings';

export type Settings = {
  intro_shown: boolean;
  experiments_view: string;
};

export function getSettings(): Settings {
  let settings: Settings = {
    intro_shown: false,
    experiments_view: 'grid',
  };
  const settingsSaved = Cookies.get(APP_COOKIE_NAME);
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
  Cookies.set(APP_COOKIE_NAME, JSON.stringify(settings), { expires: 365 });
}
