export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

let currentLevel: LogLevel = LogLevel.WARN;
let verbose = false;

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

export function setVerbose(isVerbose: boolean): void {
  verbose = isVerbose;

  if (isVerbose) {
    currentLevel = LogLevel.DEBUG;
  }
}

export function isVerbose(): boolean {
  return verbose;
}

type LogSubDir = 'scraping' | 'db-population';

const errorEntries: Map<LogSubDir, Map<string, Map<string, string[]>>> = new Map();
const warningEntries: Map<LogSubDir, Map<string, Map<string, string[]>>> = new Map();

function ensureLogEntries(subDir: LogSubDir): void {
  if (!errorEntries.has(subDir)) {
    errorEntries.set(subDir, new Map());
  }

  if (!warningEntries.has(subDir)) {
    warningEntries.set(subDir, new Map());
  }
}

export function logError(
  subDir: LogSubDir,
  country: string,
  category: string,
  url: string,
  message: string
): void {
  ensureLogEntries(subDir);

  const subDirMap = errorEntries.get(subDir)!;
  const categoryKey = `${category}`;

  if (!subDirMap.has(country)) {
    subDirMap.set(country, new Map());
  }

  const countryMap = subDirMap.get(country)!;

  if (!countryMap.has(categoryKey)) {
    countryMap.set(categoryKey, []);
  }

  countryMap.get(categoryKey)!.push(`${url}\n  ${message}`);

  console.error(`[ERROR] ${subDir}/${country}/${category}: ${url} - ${message}`);
}

export function logWarning(
  subDir: LogSubDir,
  country: string,
  category: string,
  vehicleName: string,
  message: string
): void {
  ensureLogEntries(subDir);

  const subDirMap = warningEntries.get(subDir)!;
  const categoryKey = `${category}`;

  if (!subDirMap.has(country)) {
    subDirMap.set(country, new Map());
  }

  const countryMap = subDirMap.get(country)!;

  if (!countryMap.has(categoryKey)) {
    countryMap.set(categoryKey, []);
  }

  countryMap.get(categoryKey)!.push(`${vehicleName}: ${message}`);

  if (currentLevel >= LogLevel.WARN) {
    console.warn(`[WARN] ${subDir}/${country}/${category}: ${vehicleName} - ${message}`);
  }
}

export function logInfo(message: string): void {
  if (currentLevel >= LogLevel.INFO) {
    console.log(`[INFO] ${message}`);
  }
}

export function logDebug(message: string): void {
  if (currentLevel >= LogLevel.DEBUG) {
    console.log(`[DEBUG] ${message}`);
  }
}

export async function writeLogs(): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const logsDir = path.join(process.cwd(), 'logs');

  for (const [subDir, subDirMap] of errorEntries) {
    const subDirPath = path.join(logsDir, subDir);

    await fs.mkdir(subDirPath, { recursive: true });

    let errorContent = '';

    for (const [country, categories] of subDirMap) {
      errorContent += `=== ${country.toUpperCase()} ===\n`;

      for (const [category, messages] of categories) {
        errorContent += `${category}:\n`;

        for (const msg of messages) {
          errorContent += `  - ${msg}\n`;
        }
      }

      errorContent += '\n';
    }

    if (errorContent.trim()) {
      await fs.writeFile(path.join(subDirPath, 'errors.txt'), errorContent);

      logDebug(`Wrote ${subDir}/errors.txt`);
    }
  }

  for (const [subDir, subDirMap] of warningEntries) {
    const subDirPath = path.join(logsDir, subDir);

    await fs.mkdir(subDirPath, { recursive: true });

    let warningContent = '';

    for (const [country, categories] of subDirMap) {
      warningContent += `=== ${country.toUpperCase()} ===\n`;

      for (const [category, messages] of categories) {
        warningContent += `${category}:\n`;

        for (const msg of messages) {
          warningContent += `  - ${msg}\n`;
        }
      }

      warningContent += '\n';
    }

    if (warningContent.trim()) {
      await fs.writeFile(path.join(subDirPath, 'warnings.txt'), warningContent);

      logDebug(`Wrote ${subDir}/warnings.txt`);
    }
  }
}

export function getErrors(): Map<LogSubDir, Map<string, Map<string, string[]>>> {
  return errorEntries;
}

export function getWarnings(): Map<LogSubDir, Map<string, Map<string, string[]>>> {
  return warningEntries;
}
