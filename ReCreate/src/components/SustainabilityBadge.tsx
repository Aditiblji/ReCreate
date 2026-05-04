import { Leaf, Droplets, Trash2 } from 'lucide-react';
import { SustainabilityScore } from '../types';

interface SustainabilityBadgeProps {
  score: SustainabilityScore;
  compact?: boolean;
}

export default function SustainabilityBadge({ score, compact = false }: SustainabilityBadgeProps) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="text-sm font-semibold text-green-700">
          {score.co2Saved}kg CO₂ saved
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <h4 className="font-bold text-gray-900">Environmental Impact</h4>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">CO₂ Saved</span>
          </div>
          <span className="font-bold text-green-700">{score.co2Saved} kg</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Waste Diverted</span>
          </div>
          <span className="font-bold text-green-700">{score.wasteDiverted} kg</span>
        </div>

        {score.waterSaved > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Water Saved</span>
            </div>
            <span className="font-bold text-blue-700">{score.waterSaved} L</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">
        {score.friendlyNote}
      </p>
    </div>
  );
}
