import { ProjectIdea, DetailedProject, WasteAnalysis } from '../types';

export function analyzeWaste(description: string, images: string[]): WasteAnalysis {
  const lowerDesc = description.toLowerCase();

  const materials: string[] = [];
  if (lowerDesc.includes('plastic') || lowerDesc.includes('bottle')) materials.push('plastic');
  if (lowerDesc.includes('metal') || lowerDesc.includes('can')) materials.push('metal');
  if (lowerDesc.includes('wood') || lowerDesc.includes('pallet')) materials.push('wood');
  if (lowerDesc.includes('textile') || lowerDesc.includes('fabric') || lowerDesc.includes('cloth')) materials.push('textile');
  if (lowerDesc.includes('glass') || lowerDesc.includes('jar')) materials.push('glass');
  if (lowerDesc.includes('paper') || lowerDesc.includes('cardboard')) materials.push('paper');

  if (materials.length === 0) materials.push('mixed materials');

  const usability = lowerDesc.includes('broken') ? 'broken' :
                   lowerDesc.includes('damaged') ? 'partially_usable' :
                   'fully_usable';

  return {
    materials,
    usability,
    estimatedWeight: '0.5 kg',
    description: description
  };
}

export function generateProjectIdeas(
  analysis: WasteAnalysis,
  includeExtra: boolean
): ProjectIdea[] {
  const material = analysis.materials[0];
  const ideas: ProjectIdea[] = [];

  if (material === 'plastic') {
    ideas.push({
      id: '1',
      title: 'Eco Bottle Lamp',
      visualDescription: 'A plastic bottle transformed into a glowing desk lamp with LED string lights',
      materials: ['1 plastic bottle', 'LED string lights', 'Wire', 'Hot glue gun'],
      extraMaterials: includeExtra ? ['On/off switch', 'AA batteries', 'Battery holder'] : undefined,
      estimatedTime: '45 mins',
      estimatedCost: '$5',
      skillLevel: 'Beginner',
      videoUrl: 'https://youtu.be/example1',
      sustainabilityScore: {
        co2Saved: 0.3,
        wasteDiverted: 0.5,
        waterSaved: 0,
        friendlyNote: 'By reusing this bottle, you prevent 0.5 kg of plastic from going to landfill and reduce your carbon footprint.'
      }
    });

    ideas.push({
      id: '2',
      title: 'Vertical Garden Planter',
      visualDescription: 'Stack of plastic bottles cut in half, creating a hanging vertical garden for herbs',
      materials: ['3-5 plastic bottles', 'Rope or chain', 'Scissors', 'Soil', 'Small plants'],
      extraMaterials: includeExtra ? ['Drainage pebbles', 'Paint for decoration'] : undefined,
      estimatedTime: '1 hour',
      estimatedCost: '$8',
      skillLevel: 'Beginner',
      videoUrl: 'https://youtu.be/example2',
      sustainabilityScore: {
        co2Saved: 1.2,
        wasteDiverted: 2.0,
        waterSaved: 0,
        friendlyNote: 'Reusing 4 bottles saves the equivalent of 3 car miles in CO₂ emissions!'
      }
    });

    ideas.push({
      id: '3',
      title: 'Organizer Caddy',
      visualDescription: 'Cut plastic bottles arranged as desk organizers for pens, scissors, and supplies',
      materials: ['2-3 plastic bottles', 'Scissors', 'Cardboard base', 'Glue'],
      extraMaterials: includeExtra ? ['Acrylic paint', 'Decorative paper', 'Washi tape'] : undefined,
      estimatedTime: '30 mins',
      estimatedCost: '$3',
      skillLevel: 'Beginner',
      sustainabilityScore: {
        co2Saved: 0.6,
        wasteDiverted: 1.0,
        waterSaved: 0,
        friendlyNote: 'A simple project that saves 1 kg of plastic from landfills!'
      }
    });
  } else if (material === 'wood') {
    ideas.push({
      id: '4',
      title: 'Rustic Coffee Table',
      visualDescription: 'A beautiful low coffee table made from reclaimed pallet wood with metal hairpin legs',
      materials: ['1 wooden pallet', 'Sandpaper', 'Wood stain', 'Metal legs'],
      extraMaterials: includeExtra ? ['Wood screws', 'Clear varnish', 'Wood filler'] : undefined,
      estimatedTime: '3 hours',
      estimatedCost: '$25',
      skillLevel: 'Intermediate',
      videoUrl: 'https://youtu.be/example3',
      sustainabilityScore: {
        co2Saved: 15.0,
        wasteDiverted: 20.0,
        waterSaved: 0,
        friendlyNote: 'Reusing wood saves significant CO₂ - equal to removing a car from the road for 2 days!'
      }
    });

    ideas.push({
      id: '5',
      title: 'Wall-Mounted Bookshelf',
      visualDescription: 'Deconstructed pallet boards mounted as floating shelves with industrial brackets',
      materials: ['Pallet wood planks', 'Metal brackets', 'Sandpaper', 'Wood stain'],
      extraMaterials: includeExtra ? ['Wall anchors', 'Screws', 'Level tool'] : undefined,
      estimatedTime: '2 hours',
      estimatedCost: '$15',
      skillLevel: 'Intermediate',
      sustainabilityScore: {
        co2Saved: 8.0,
        wasteDiverted: 10.0,
        waterSaved: 0,
        friendlyNote: 'Upcycling wood prevents deforestation and saves energy from manufacturing new furniture.'
      }
    });
  } else if (material === 'textile') {
    ideas.push({
      id: '6',
      title: 'Braided Rag Rug',
      visualDescription: 'A colorful, circular rug made from braided strips of old t-shirts and fabrics',
      materials: ['Old t-shirts/fabric scraps', 'Scissors', 'Needle and thread'],
      extraMaterials: includeExtra ? ['Non-slip rug pad', 'Fabric glue'] : undefined,
      estimatedTime: '4 hours',
      estimatedCost: '$2',
      skillLevel: 'Intermediate',
      videoUrl: 'https://youtu.be/example4',
      sustainabilityScore: {
        co2Saved: 5.0,
        wasteDiverted: 2.0,
        waterSaved: 2700,
        friendlyNote: 'Textile reuse saves massive amounts of water - you just saved 2,700 liters!'
      }
    });

    ideas.push({
      id: '7',
      title: 'Fabric Tote Bag',
      visualDescription: 'A sturdy reusable shopping bag made from old jeans or canvas fabric',
      materials: ['Old jeans or fabric', 'Scissors', 'Sewing machine or needle', 'Thread'],
      extraMaterials: includeExtra ? ['Fabric straps', 'Decorative buttons', 'Iron-on patches'] : undefined,
      estimatedTime: '1.5 hours',
      estimatedCost: '$0',
      skillLevel: 'Beginner',
      sustainabilityScore: {
        co2Saved: 2.0,
        wasteDiverted: 0.5,
        waterSaved: 900,
        friendlyNote: 'Each reusable bag replaces hundreds of plastic bags and saves 900 liters of water!'
      }
    });
  } else {
    ideas.push({
      id: '8',
      title: 'Creative Storage Container',
      visualDescription: 'Transform your waste item into a decorative storage solution',
      materials: ['Your waste item', 'Paint or fabric', 'Glue', 'Scissors'],
      extraMaterials: includeExtra ? ['Decorative elements', 'Varnish', 'Labels'] : undefined,
      estimatedTime: '1 hour',
      estimatedCost: '$5',
      skillLevel: 'Beginner',
      sustainabilityScore: {
        co2Saved: 1.0,
        wasteDiverted: 1.0,
        waterSaved: 0,
        friendlyNote: 'Every item you upcycle keeps waste out of landfills and reduces pollution!'
      }
    });
  }

  return ideas.slice(0, 5);
}

export function generateDetailedInstructions(idea: ProjectIdea): DetailedProject {
  const steps = [
    {
      stepNumber: 1,
      instruction: `Gather all materials: ${idea.materials.join(', ')}${idea.extraMaterials ? ` and optional extras: ${idea.extraMaterials.join(', ')}` : ''}.`,
      tips: 'Organize your workspace and lay out all materials before starting.',
      safetyNotes: 'Ensure you have proper ventilation if using glue or paint.'
    },
    {
      stepNumber: 2,
      instruction: 'Clean and prepare your waste material thoroughly.',
      tips: 'Remove any labels, dirt, or residue. Dry completely before proceeding.',
      safetyNotes: 'Use gloves when handling sharp edges or dirty materials.'
    },
    {
      stepNumber: 3,
      instruction: 'Follow the cutting or assembly process as needed for your specific project.',
      tips: 'Measure twice, cut once. Take your time with each step.',
      safetyNotes: 'Always cut away from your body and use appropriate safety equipment.'
    },
    {
      stepNumber: 4,
      instruction: 'Assemble or combine the components using glue, screws, or stitching as appropriate.',
      tips: 'Allow adequate drying time for adhesives before moving to the next step.'
    },
    {
      stepNumber: 5,
      instruction: 'Add finishing touches such as paint, varnish, or decorative elements.',
      tips: 'This is where you can express your creativity and personalize the project!'
    },
    {
      stepNumber: 6,
      instruction: 'Allow the project to fully dry and cure, then test or display your creation.',
      tips: 'Take photos to share your upcycling success and inspire others!'
    }
  ];

  return {
    ...idea,
    steps,
    extraMaterialsSources: 'Extra materials can be found at local hardware stores, craft shops, or online retailers like Amazon.'
  };
}
