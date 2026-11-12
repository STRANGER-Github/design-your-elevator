import { jsPDF } from 'jspdf';
import { ElevatorConfiguration } from '../types/elevator';
import { WALL_FINISHES, FLOOR_FINISHES, CEILING_OPTIONS, DOOR_OPTIONS } from '../data/materials';
import { MIRROR_OPTIONS, HANDRAIL_OPTIONS, CONTROL_PANEL_OPTIONS, SKIRTING_OPTIONS } from '../data/accessories';
import { STYLE_PRESETS } from '../data/presets';

export const generateConfigurationPDF = (config: ElevatorConfiguration): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 22;

  // Header band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(245, 158, 11); // amber-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ASCENSOR · DESIGN YOUR ELEVATOR', margin, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('HIGHEST QUALITY PERFORMANCE · SPECIFICATION SHEET', margin, 18);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`CONFIG REF: ${config.configId}`, pageWidth - margin - 45, 12);
  doc.text(`GENERATED: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - margin - 45, 18);

  y = 38;

  // Selected Style Family Banner
  const currentPreset = STYLE_PRESETS.find(p => p.id === config.presetId) || STYLE_PRESETS[0];
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Base Style Family: ${currentPreset.name}`, margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(currentPreset.tagline, margin + 6, y + 13);

  y += 26;

  // SECTION 1: CABIN & SHAFT DIMENSIONS
  doc.setFillColor(15, 23, 42);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.text('1. CABIN ENVELOPE & CAPACITY SPECIFICATIONS', margin + 4, y + 5);

  y += 12;

  const dimItems = [
    ['Cabin Width (Internal):', `${config.dimensions.widthMm} mm`],
    ['Cabin Depth (Internal):', `${config.dimensions.depthMm} mm`],
    ['Cabin Clear Height:', `${config.dimensions.heightMm} mm`],
    ['Rated Load Capacity:', `${config.dimensions.capacityKg} kg`],
    ['Passenger Capacity:', `${config.dimensions.persons} Persons`],
    ['Entrance Configuration:', config.dimensions.entranceType.replace('_', ' ').toUpperCase()],
    ['Accessibility Compliance:', config.dimensions.en81_70_compliant ? 'EN 81-70 Wheelchair Compliant' : 'Standard Passenger'],
  ];

  doc.setFontSize(9);
  dimItems.forEach(([label, val]) => {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 4, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(val, margin + 70, y);
    y += 5.5;
  });

  y += 4;

  // SECTION 2: ARCHITECTURAL FINISHES
  doc.setFillColor(15, 23, 42);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.text('2. WALL, FLOOR & CEILING MATERIAL SPECIFICATIONS', margin + 4, y + 5);

  y += 12;

  const leftWall = WALL_FINISHES.find(f => f.id === config.walls.left)?.name || config.walls.left;
  const rearWall = config.walls.allSame ? leftWall : (WALL_FINISHES.find(f => f.id === config.walls.rear)?.name || config.walls.rear);
  const rightWall = config.walls.allSame ? leftWall : (WALL_FINISHES.find(f => f.id === config.walls.right)?.name || config.walls.right);
  const floorName = FLOOR_FINISHES.find(f => f.id === config.floor)?.name || config.floor;
  const ceilingName = CEILING_OPTIONS.find(c => c.id === config.ceiling)?.name || config.ceiling;
  const doorName = DOOR_OPTIONS.find(d => d.id === config.door)?.name || config.door;

  const finishItems = [
    ['Left Wall Finish:', leftWall],
    ['Rear Wall Finish:', rearWall],
    ['Right Wall Finish:', rightWall],
    ['Floor Material:', floorName],
    ['Ceiling & Lighting Design:', ceilingName],
    ['Lighting Temperature:', config.lightingTempMode.replace('_', ' ').toUpperCase()],
    ['Landing / Car Doors:', doorName],
  ];

  finishItems.forEach(([label, val]) => {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 4, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(val, margin + 70, y);
    y += 5.5;
  });

  y += 4;

  // SECTION 3: FITTINGS & FIXTURES
  doc.setFillColor(15, 23, 42);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.text('3. ACCESSORIES, OPERATING CONTROLS & FIXTURES', margin + 4, y + 5);

  y += 12;

  const mirrorName = MIRROR_OPTIONS.find(m => m.id === config.mirror)?.name || config.mirror;
  const handrailName = HANDRAIL_OPTIONS.find(h => h.id === config.handrail)?.name || config.handrail;
  const copName = CONTROL_PANEL_OPTIONS.find(c => c.id === config.controlPanel)?.name || config.controlPanel;
  const skirtingName = SKIRTING_OPTIONS.find(s => s.id === config.skirting)?.name || config.skirting;

  const fittingItems = [
    ['Mirror Fitting:', mirrorName],
    ['Handrail Ergonomics:', handrailName],
    ['Car Operating Panel (COP):', copName],
    ['Skirting / Baseboard Protection:', skirtingName],
  ];

  fittingItems.forEach(([label, val]) => {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 4, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(val, margin + 70, y);
    y += 5.5;
  });

  y += 10;

  // DISCLAIMER BOX
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14); // amber-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('IMPORTANT ENGINEERING & ARCHITECTURAL DISCLAIMER', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const disclaimerText =
    'This specification sheet represents a preliminary architectural and visual concept generated using the Design your Elevator interactive prototype. All physical shaft tolerances, pit depths, overhead clearances, structural anchoring, and electrical supplies must be calculated and certified by an authorized vertical transportation engineer in accordance with local regulations (EN 81-20/50, ASME A17.1). This concept does not constitute a binding price quotation or structural commitment.';
  const splitText = doc.splitTextToSize(disclaimerText, contentWidth - 8);
  doc.text(splitText, margin + 4, y + 11);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('DESIGN YOUR ELEVATOR · PROTOTYPE ARCHITECTURE PLATFORM · NON-PROPRIETARY SPECIFICATION', margin, 287);

  doc.save(`Elevator-Spec-${config.configId}.pdf`);
};
