export interface TimeRemaining {
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ChecklistItem {
  [key: string]: boolean;
}

export interface CategoryData {
  items: ChecklistItem;
  expanded: boolean;
}

export interface Checklist {
  [category: string]: CategoryData;
}
