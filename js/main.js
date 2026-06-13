/**
 * main.js
 * Application entry point. Wires modules together.
 */
import { createSurface, calculateTotalArea } from './geometry.js';
import { PAINT_PRESETS, calculateGallonsNeeded, calculateCans, getCoverageForPreset } from './coverage.js';
import { calculatePaintCost, calculateLaborCost, getTotalProjectCost } from './cost.js';
import { estimatePrepAndPaintTime, formatTime } from './time.js';
import { Project } from './project.js';
import { updateSummary, renderSurfaces } from './ui.js';
import { saveProject, getProjects, deleteProject } from './storage.js';

const project = new Project('My Painting Project');
let surfaces = [];

const elements = {
  // Inputs
  length: document.getElementById('length'),
  width: document.getElementById('width'),
  height: document.getElementById('height'),
  doors: document.getElementById('doors'),
  windows: document.getElementById('windows'),
  surfaceType: document.getElementById('surface-type'),
  coats: document.getElementById('coats'),
  waste: document.getElementById('waste'),
  paintType: document.getElementById('paint-type'),
  hourlyRate: document.getElementById('hourly-rate'),
  
  // Buttons
  addBtn: document.getElementById('add-surface'),
  clearBtn: document.getElementById('clear-project'),
  
  // Display
  surfacesList: document.getElementById('surfaces-list'),
  totalArea: document.getElementById('total-area'),
  gallons: document.getElementById('gallons'),
  cans: document.getElementById('cans'),
  paintCost: document.getElementById('paint-cost'),
  laborCost: document.getElementById('labor-cost'),
  totalCost: document.getElementById('total-cost'),
  hours: document.getElementById('hours'),
  
  // Info
  tipsList: document.getElementById('tips-list')
};

function recalculate() {
  const totals = project.getTotals ? project.getTotals() : calculateCurrentTotals();
  
  // Update paint cost based on current selection
  const preset = elements.paintType.value;
  const price = PAINT_PRESETS[preset]?.pricePerGallon || 50;
  const area = calculateTotalArea(surfaces);
  
  const gallons = calculateGallonsNeeded(area, +elements.coats.value, undefined, +elements.waste.value);
  const paintCost = calculatePaintCost(gallons, price);
  const laborCost = calculateLaborCost(area, +elements.hourlyRate.value);
  const totalCost = getTotalProjectCost(paintCost, laborCost);
  const hours = estimatePrepAndPaintTime(area, +elements.coats.value);
  
  const finalTotals = {
    area: Math.round(area),
    gallons,
    cans: calculateCans(gallons),
    paintCost,
    laborCost,
    totalCost,
    hours
  };
  
  updateSummary(finalTotals, elements);
}

function calculateCurrentTotals() {
  const area = calculateTotalArea(surfaces);
  return {
    area: Math.round(area),
    gallons: 0, cans: 0, paintCost: 0, laborCost: 0, totalCost: 0, hours: 0
  };
}

function addCurrentSurface() {
  const type = elements.surfaceType.value;
  const length = parseFloat(elements.length.value) || 0;
  const width = parseFloat(elements.width.value) || 0;
  const height = parseFloat(elements.height.value) || 8;
  const doors = parseInt(elements.doors.value) || 0;
  const windows = parseInt(elements.windows.value) || 0;
  
  if ((type === 'wall' && (length === 0 || width === 0)) || 
      (type === 'ceiling' && (length === 0 || width === 0))) {
    alert('Please enter valid dimensions');
    return;
  }
  
  const surface = createSurface(type, length, width, height, doors, windows);
  surfaces.push(surface);
  
  renderSurfaces(surfaces, elements.surfacesList, removeSurface);
  recalculate();
  
  // Reset some fields for quick successive adds
  elements.doors.value = 0;
  elements.windows.value = 0;
}

function removeSurface(id) {
  surfaces = surfaces.filter(s => s.id !== id);
  renderSurfaces(surfaces, elements.surfacesList, removeSurface);
  recalculate();
}

function clearProject() {
  surfaces = [];
  renderSurfaces(surfaces, elements.surfacesList, removeSurface);
  recalculate();
}

function updatePaintType() {
  // Could auto-adjust coverage here if desired
  recalculate();
}

function initPresets() {
  const select = elements.paintType;
  Object.keys(PAINT_PRESETS).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = PAINT_PRESETS[key].name;
    select.appendChild(opt);
  });
  select.value = 'interior-flat';
}

function initEventListeners() {
  elements.addBtn.addEventListener('click', addCurrentSurface);
  elements.clearBtn.addEventListener('click', clearProject);
  
  // Live recalc on input changes
  ['length','width','height','doors','windows','coats','waste','hourlyRate','paintType','surfaceType']
    .forEach(id => {
      const el = elements[id];
      if (el) el.addEventListener('input', recalculate);
    });
  
  elements.paintType.addEventListener('change', updatePaintType);
  
  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
      addCurrentSurface();
    }
  });
}

function initTips() {
  // From time module would be imported, but for simplicity we hardcode nice tips here
  const tips = [
    "Work from the top down — ceiling first, then walls, then trim.",
    "Cut in edges completely before rolling to avoid visible lap marks.",
    "A 5-gallon bucket with screen is much faster than a roller tray for large areas."
  ];
  
  elements.tipsList.innerHTML = tips.map(tip => 
    `<li class="flex gap-x-2"><span class="text-emerald-600">→</span> ${tip}</li>`
  ).join('');
}

function init() {
  initPresets();
  initEventListeners();
  initTips();
  
  // Seed with one example surface
  const example = createSurface('wall', 14, 12, 8, 1, 2);
  surfaces = [example];
  renderSurfaces(surfaces, elements.surfacesList, removeSurface);
  
  recalculate();
  
  console.log('%c[PaintCalc] Modular painting productivity tools ready. All calculations run through clean ES modules.', 'color:#64748b');
}

init();
