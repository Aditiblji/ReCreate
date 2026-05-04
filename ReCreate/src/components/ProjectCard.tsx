import { useState } from 'react';
import { Clock, DollarSign, Wrench, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ProjectIdea } from '../types';
import SustainabilityBadge from './SustainabilityBadge';

interface ProjectCardProps {
  project: ProjectIdea;
  onSelect: () => void;
  onFeedback?: (rating: 'up' | 'down') => void;
}

export default function ProjectCard({ project, onSelect, onFeedback }: ProjectCardProps) {
  const [userRating, setUserRating] = useState<'up' | 'down' | null>(null);
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);

  const skillColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Expert: 'bg-red-100 text-red-700'
  };

  const handleFeedback = (rating: 'up' | 'down') => {
    setUserRating(rating);
    setShowFeedbackMessage(true);
    onFeedback?.(rating);

    setTimeout(() => {
      setShowFeedbackMessage(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 h-48 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="text-center z-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600">{project.visualDescription}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <SustainabilityBadge score={project.sustainabilityScore} compact />

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{project.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{project.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-gray-500" />
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${skillColors[project.skillLevel]}`}>
              {project.skillLevel}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Materials Needed:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {project.materials.slice(0, 3).map((material, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {material}
              </li>
            ))}
            {project.materials.length > 3 && (
              <li className="text-gray-400 italic">+ {project.materials.length - 3} more</li>
            )}
          </ul>
          {project.extraMaterials && project.extraMaterials.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              + Optional extras available
            </p>
          )}
        </div>

        {project.videoUrl && (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            Watch tutorial video
          </a>
        )}

        <div className="flex items-center gap-2">
          {onFeedback && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFeedback('up')}
                disabled={userRating !== null}
                className={`p-2 rounded-lg transition-all ${
                  userRating === 'up'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                } disabled:opacity-50`}
                title="I like this idea"
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                disabled={userRating !== null}
                className={`p-2 rounded-lg transition-all ${
                  userRating === 'down'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                } disabled:opacity-50`}
                title="Not interested"
              >
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>
          )}
          <button
            onClick={onSelect}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            View Instructions
          </button>
        </div>

        {showFeedbackMessage && (
          <div className="text-center text-sm text-green-600 font-medium animate-fade-in">
            Thanks for your feedback!
          </div>
        )}
      </div>
    </div>
  );
}
