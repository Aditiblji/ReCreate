import { ArrowLeft, Sparkles } from 'lucide-react';
import { ProjectIdea } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectIdeasProps {
  ideas: ProjectIdea[];
  onSelectIdea: (idea: ProjectIdea) => void;
  onBack: () => void;
  onProjectFeedback?: (idea: ProjectIdea, rating: 'up' | 'down') => void;
}

export default function ProjectIdeas({ ideas, onSelectIdea, onBack, onProjectFeedback }: ProjectIdeasProps) {
  const totalCO2 = ideas.reduce((sum, idea) => sum + idea.sustainabilityScore.co2Saved, 0);
  const totalWaste = ideas.reduce((sum, idea) => sum + idea.sustainabilityScore.wasteDiverted, 0);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Start Over
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Your Creative Ideas
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Choose a project to get detailed step-by-step instructions
        </p>
        <div className="inline-flex items-center gap-6 bg-green-50 px-6 py-3 rounded-full border border-green-200">
          <span className="text-sm font-semibold text-green-700">
            Combined Impact: {totalCO2.toFixed(1)}kg CO₂ saved
          </span>
          <span className="text-sm font-semibold text-green-700">
            {totalWaste.toFixed(1)}kg waste diverted
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <ProjectCard
            key={idea.id}
            project={idea}
            onSelect={() => onSelectIdea(idea)}
            onFeedback={onProjectFeedback ? (rating) => onProjectFeedback(idea, rating) : undefined}
          />
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Make a Real Impact
        </h3>
        <p className="text-gray-700 leading-relaxed">
          By choosing any of these projects, you're taking a meaningful step toward sustainability.
          Each item you upcycle reduces landfill waste, conserves resources, and lowers carbon emissions.
          You're not just creating something beautiful - you're helping create a healthier planet.
        </p>
      </div>
    </div>
  );
}
