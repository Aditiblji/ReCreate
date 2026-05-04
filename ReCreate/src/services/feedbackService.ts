import { supabase } from '../lib/supabase';
import { ProjectIdea } from '../types';

export interface ProjectFeedback {
  id?: string;
  project_title: string;
  rating: 'up' | 'down';
  waste_description: string;
  materials: string[];
  skill_level: 'Beginner' | 'Intermediate' | 'Expert';
  estimated_time: string;
  estimated_cost: string;
  created_at?: string;
}

export interface InstructionFeedback {
  id?: string;
  project_title: string;
  rating: 'up' | 'down';
  created_at?: string;
}

export async function saveProjectFeedback(
  idea: ProjectIdea,
  rating: 'up' | 'down',
  wasteDescription: string
): Promise<void> {
  const feedback: ProjectFeedback = {
    project_title: idea.title,
    rating,
    waste_description: wasteDescription,
    materials: idea.materials,
    skill_level: idea.skillLevel,
    estimated_time: idea.estimatedTime,
    estimated_cost: idea.estimatedCost,
  };

  const { error } = await supabase
    .from('project_feedback')
    .insert(feedback);

  if (error) {
    console.error('Error saving project feedback:', error);
    throw error;
  }

  await updateUserPreferences(feedback);
}

export async function saveInstructionFeedback(
  projectTitle: string,
  rating: 'up' | 'down'
): Promise<void> {
  const feedback: InstructionFeedback = {
    project_title: projectTitle,
    rating,
  };

  const { error } = await supabase
    .from('instruction_feedback')
    .insert(feedback);

  if (error) {
    console.error('Error saving instruction feedback:', error);
    throw error;
  }
}

async function updateUserPreferences(feedback: ProjectFeedback): Promise<void> {
  const preferences = [
    { type: 'skill_level', value: feedback.skill_level },
    { type: 'time_commitment', value: feedback.estimated_time },
    { type: 'cost_range', value: feedback.estimated_cost },
  ];

  feedback.materials.forEach((material) => {
    preferences.push({ type: 'material_preference', value: material });
  });

  for (const pref of preferences) {
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('preference_type', pref.type)
      .eq('preference_value', pref.value)
      .maybeSingle();

    const isPositive = feedback.rating === 'up';

    if (existing) {
      const newPositiveCount = existing.positive_count + (isPositive ? 1 : 0);
      const newTotalCount = existing.total_count + 1;
      const newConfidenceScore = newPositiveCount / newTotalCount;

      await supabase
        .from('user_preferences')
        .update({
          positive_count: newPositiveCount,
          total_count: newTotalCount,
          confidence_score: newConfidenceScore,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('user_preferences')
        .insert({
          preference_type: pref.type,
          preference_value: pref.value,
          positive_count: isPositive ? 1 : 0,
          total_count: 1,
          confidence_score: isPositive ? 1.0 : 0.0,
        });
    }
  }
}

export async function getRecentFeedbackStats() {
  const { data: projectFeedback } = await supabase
    .from('project_feedback')
    .select('rating')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const { data: instructionFeedback } = await supabase
    .from('instruction_feedback')
    .select('rating')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const projectUp = projectFeedback?.filter(f => f.rating === 'up').length || 0;
  const projectDown = projectFeedback?.filter(f => f.rating === 'down').length || 0;
  const instructionUp = instructionFeedback?.filter(f => f.rating === 'up').length || 0;
  const instructionDown = instructionFeedback?.filter(f => f.rating === 'down').length || 0;

  return {
    project: { up: projectUp, down: projectDown },
    instruction: { up: instructionUp, down: instructionDown },
  };
}
