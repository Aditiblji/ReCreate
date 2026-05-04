import { supabase } from '../lib/supabase';

export interface UserPreference {
  preference_type: string;
  preference_value: string;
  positive_count: number;
  total_count: number;
  confidence_score: number;
}

export interface PreferenceSummary {
  preferredSkillLevels: string[];
  preferredTimeCommitments: string[];
  preferredCostRanges: string[];
  preferredMaterials: string[];
  hasPreferences: boolean;
}

const CONFIDENCE_THRESHOLD = 0.6;
const MIN_SAMPLES = 3;

export async function getUserPreferences(): Promise<PreferenceSummary> {
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .gte('confidence_score', CONFIDENCE_THRESHOLD)
    .gte('total_count', MIN_SAMPLES)
    .order('confidence_score', { ascending: false });

  if (!preferences || preferences.length === 0) {
    return {
      preferredSkillLevels: [],
      preferredTimeCommitments: [],
      preferredCostRanges: [],
      preferredMaterials: [],
      hasPreferences: false,
    };
  }

  const summary: PreferenceSummary = {
    preferredSkillLevels: [],
    preferredTimeCommitments: [],
    preferredCostRanges: [],
    preferredMaterials: [],
    hasPreferences: true,
  };

  preferences.forEach((pref) => {
    switch (pref.preference_type) {
      case 'skill_level':
        summary.preferredSkillLevels.push(pref.preference_value);
        break;
      case 'time_commitment':
        summary.preferredTimeCommitments.push(pref.preference_value);
        break;
      case 'cost_range':
        summary.preferredCostRanges.push(pref.preference_value);
        break;
      case 'material_preference':
        summary.preferredMaterials.push(pref.preference_value);
        break;
    }
  });

  return summary;
}

export function buildPreferencePromptAddition(preferences: PreferenceSummary): string {
  if (!preferences.hasPreferences) {
    return '';
  }

  const additions: string[] = [];

  if (preferences.preferredSkillLevels.length > 0) {
    additions.push(
      `Based on user preferences, prioritize projects with these skill levels: ${preferences.preferredSkillLevels.slice(0, 2).join(', ')}.`
    );
  }

  if (preferences.preferredTimeCommitments.length > 0) {
    additions.push(
      `Users have shown preference for projects with these time commitments: ${preferences.preferredTimeCommitments.slice(0, 2).join(', ')}.`
    );
  }

  if (preferences.preferredCostRanges.length > 0) {
    additions.push(
      `Cost ranges that users prefer: ${preferences.preferredCostRanges.slice(0, 2).join(', ')}.`
    );
  }

  if (preferences.preferredMaterials.length > 0) {
    additions.push(
      `Materials that have been well-received: ${preferences.preferredMaterials.slice(0, 3).join(', ')}.`
    );
  }

  if (additions.length === 0) {
    return '';
  }

  return `\n\nUser Preference Insights:\n${additions.join('\n')}`;
}

export async function getTopPreferredMaterials(limit: number = 5): Promise<string[]> {
  const { data } = await supabase
    .from('user_preferences')
    .select('preference_value')
    .eq('preference_type', 'material_preference')
    .gte('confidence_score', CONFIDENCE_THRESHOLD)
    .order('confidence_score', { ascending: false })
    .limit(limit);

  return data?.map(p => p.preference_value) || [];
}

export async function getTopPreferredSkillLevel(): Promise<string | null> {
  const { data } = await supabase
    .from('user_preferences')
    .select('preference_value')
    .eq('preference_type', 'skill_level')
    .gte('confidence_score', CONFIDENCE_THRESHOLD)
    .order('confidence_score', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.preference_value || null;
}
