import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, ExternalLink, Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import { DetailedProject } from '../types';
import SustainabilityBadge from './SustainabilityBadge';

interface ProjectInstructionsProps {
  project: DetailedProject;
  onBack: () => void;
  onFeedback?: (rating: 'up' | 'down') => void;
}

export default function ProjectInstructions({ project, onBack, onFeedback }: ProjectInstructionsProps) {
  const [userRating, setUserRating] = useState<'up' | 'down' | null>(null);
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);

  const handleFeedback = (rating: 'up' | 'down') => {
    setUserRating(rating);
    setShowFeedbackMessage(true);
    onFeedback?.(rating);

    setTimeout(() => {
      setShowFeedbackMessage(false);
    }, 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Ideas
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-8 text-white">
          <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
          <p className="text-green-50 text-lg">{project.visualDescription}</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Project Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Required:</span>
                  <span className="font-semibold text-gray-900">{project.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Cost:</span>
                  <span className="font-semibold text-gray-900">{project.estimatedCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skill Level:</span>
                  <span className="font-semibold text-gray-900">{project.skillLevel}</span>
                </div>
              </div>

              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch Tutorial Video
                </a>
              )}
            </div>

            <SustainabilityBadge score={project.sustainabilityScore} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Required Materials</h3>
              <ul className="space-y-2">
                {project.materials.map((material, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </div>

            {project.extraMaterials && project.extraMaterials.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Optional Extras</h3>
                <ul className="space-y-2 mb-4">
                  {project.extraMaterials.map((material, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
                {project.extraMaterialsSources && (
                  <p className="text-sm text-gray-600">{project.extraMaterialsSources}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Instructions</h3>
            <div className="space-y-6">
              {project.steps.map((step) => (
                <div key={step.stepNumber} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border-l-4 border-green-500">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {step.instruction}
                      </p>

                      {step.tips && (
                        <div className="flex gap-2 bg-blue-50 rounded-lg p-3">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900">Tip:</p>
                            <p className="text-sm text-blue-700">{step.tips}</p>
                          </div>
                        </div>
                      )}

                      {step.safetyNotes && (
                        <div className="flex gap-2 bg-orange-50 rounded-lg p-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-orange-900">Safety Note:</p>
                            <p className="text-sm text-orange-700">{step.safetyNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Congratulations!</h3>
            <p className="text-green-50 leading-relaxed mb-4">
              You've just completed an amazing upcycling project! By transforming waste into something
              useful and beautiful, you've saved {project.sustainabilityScore.co2Saved}kg of CO₂ and
              diverted {project.sustainabilityScore.wasteDiverted}kg of waste from landfills.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                <Download className="w-5 h-5" />
                Download Instructions (PDF)
              </button>
            </div>
          </div>

          {onFeedback && (
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                Were these instructions helpful?
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Your feedback helps us create better project guides
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleFeedback('up')}
                  disabled={userRating !== null}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    userRating === 'up'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500 hover:text-green-600'
                  } disabled:opacity-50`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  Helpful
                </button>
                <button
                  onClick={() => handleFeedback('down')}
                  disabled={userRating !== null}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    userRating === 'down'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500 hover:text-red-600'
                  } disabled:opacity-50`}
                >
                  <ThumbsDown className="w-5 h-5" />
                  Not Helpful
                </button>
              </div>
              {showFeedbackMessage && (
                <div className="mt-4 text-center text-green-600 font-medium">
                  Thank you! Your feedback helps us improve future instructions.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
