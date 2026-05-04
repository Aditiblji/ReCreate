import { useState } from 'react';
import { Recycle } from 'lucide-react';
import WasteInput from './components/WasteInput';
import ProjectIdeas from './components/ProjectIdeas';
import ProjectInstructions from './components/ProjectInstructions';
import { ProjectIdea, DetailedProject } from './types';
import { analyzeImageWithCerebras, generateIdeasWithCerebras, generateStepsWithCerebras } from './services/cerebrasService';
import { saveProjectFeedback, saveInstructionFeedback } from './services/feedbackService';

type AppState = 'input' | 'ideas' | 'instructions';

function App() {
  const [state, setState] = useState<AppState>('input');
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [selectedProject, setSelectedProject] = useState<DetailedProject | null>(null);
  const [error, setError] = useState<string>('');
  const [wasteDescription, setWasteDescription] = useState<string>('');

  const handleAnalyze = async (description: string, images: string[], includeExtra: boolean) => {
    try {
      setError('');
      let finalDescription = description;
      setWasteDescription(description);

      if (images.length > 0 && !description.trim()) {
        const imageAnalysis = await analyzeImageWithCerebras(images[0]);
        finalDescription = imageAnalysis;
      } else if (images.length > 0 && description.trim()) {
        const imageAnalysis = await analyzeImageWithCerebras(images[0]);
        finalDescription = `${description}. Additional details from image: ${imageAnalysis}`;
      }

      const generatedIdeas = await generateIdeasWithCerebras(finalDescription, includeExtra);
      setIdeas(generatedIdeas);
      setWasteDescription(finalDescription);
      setState('ideas');
    } catch (err) {
      setError('Failed to generate ideas. Please try again.');
      console.error('Error:', err);
    }
  };

  const handleSelectIdea = async (idea: ProjectIdea) => {
    try {
      setError('');
      const steps = await generateStepsWithCerebras(idea);
      const detailedProject: DetailedProject = {
        ...idea,
        steps,
        extraMaterialsSources: 'Extra materials can be found at local hardware stores, craft shops, or online retailers.'
      };
      setSelectedProject(detailedProject);
      setState('instructions');
    } catch (err) {
      setError('Failed to generate instructions. Please try again.');
      console.error('Error:', err);
    }
  };

  const handleBackToInput = () => {
    setState('input');
    setIdeas([]);
    setSelectedProject(null);
    setWasteDescription('');
  };

  const handleProjectFeedback = async (idea: ProjectIdea, rating: 'up' | 'down') => {
    try {
      await saveProjectFeedback(idea, rating, wasteDescription);
    } catch (err) {
      console.error('Failed to save feedback:', err);
    }
  };

  const handleInstructionFeedback = async (rating: 'up' | 'down') => {
    if (!selectedProject) return;
    try {
      await saveInstructionFeedback(selectedProject.title, rating);
    } catch (err) {
      console.error('Failed to save feedback:', err);
    }
  };

  const handleBackToIdeas = () => {
    setState('ideas');
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Recycle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ReCreate</h1>
              <p className="text-sm text-gray-600">Transform Waste into Wonder</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}
        {state === 'input' && <WasteInput onAnalyze={handleAnalyze} />}
        {state === 'ideas' && (
          <ProjectIdeas
            ideas={ideas}
            onSelectIdea={handleSelectIdea}
            onBack={handleBackToInput}
            onProjectFeedback={handleProjectFeedback}
          />
        )}
        {state === 'instructions' && selectedProject && (
          <ProjectInstructions
            project={selectedProject}
            onBack={handleBackToIdeas}
            onFeedback={handleInstructionFeedback}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            Every item you upcycle makes a difference. Join the movement toward a more sustainable future.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
