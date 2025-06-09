const DEFAULT_CONFIG = {
  "1rm_formula_k": 30,
  "toBenchFactors": {
    "bench_press": 1.0,
    "incline_bench": 0.75,
    "decline_bench": 1.05,
    "dumbbell_bench_press": 0.85,
    "incline_dumbbell_bench_press": 0.80,
    "dumbbell_fly": 0.50,
    "overhead_press": 0.65,
    "dumbbell_overhead_press": 0.60,
    "decline_dumbbell_overhead_press": 0.60,
    "pushup": 0.64
  },
  "toSquatFactors": {
    "squat": 1.0,
    "front_squat": 0.80,
    "bulgarian_squat": 0.60,
    "leg_press": 1.75,
    "step_up": 0.45,
    "deadlift": 1.0,
    "stiff_legged_deadlift": 0.80,
    "sumo_deadlift": 1.08,
    "hex_bar_deadlift": 1.08,
    "lunge": 0.65
  }
};

let config = { ...DEFAULT_CONFIG };

const upperBodyExercises = Object.keys(DEFAULT_CONFIG.toBenchFactors);
const lowerBodyExercises = Object.keys(DEFAULT_CONFIG.toSquatFactors);
const allExercises = [...upperBodyExercises, ...lowerBodyExercises];

function formatExerciseName(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function populateDropdowns() {
  const refSel = document.getElementById('refExercise');
  const targetSel = document.getElementById('targetExercise');
  refSel.innerHTML = '';
  targetSel.innerHTML = '';
  allExercises.forEach(ex => {
    const opt1 = document.createElement('option');
    opt1.value = ex;
    opt1.textContent = formatExerciseName(ex);
    refSel.appendChild(opt1);
    const opt2 = document.createElement('option');
    opt2.value = ex;
    opt2.textContent = formatExerciseName(ex);
    targetSel.appendChild(opt2);
  });
  refSel.value = '';
  targetSel.value = '';
}

function getFactor(ex, type) {
  if (type === 'bench') return config.toBenchFactors[ex];
  if (type === 'squat') return config.toSquatFactors[ex];
  return undefined;
}

function isUpperBody(ex) {
  return upperBodyExercises.includes(ex);
}

function isLowerBody(ex) {
  return lowerBodyExercises.includes(ex);
}

function calculate1RM(weight, reps, k) {
  return weight * (1 + reps / k);
}

function calculateTargetWeight(target1RM, targetReps, k) {
  return target1RM / (1 + targetReps / k);
}

function convert({ refExercise, refWeight, refReps, targetExercise, targetReps }) {
  const k = config["1rm_formula_k"] || 30;
  let ref1RM = calculate1RM(refWeight, refReps, k);
  let base1RM, baseType, refFactor, targetFactor;

  if (isUpperBody(refExercise)) {
    base1RM = ref1RM;
    baseType = 'bench';
    refFactor = getFactor(refExercise, 'bench');
    targetFactor = getFactor(targetExercise, 'bench');
    if (refExercise !== 'bench_press') base1RM = ref1RM / refFactor;
    if (targetExercise !== 'bench_press') base1RM = base1RM * targetFactor;
  } else if (isLowerBody(refExercise)) {
    base1RM = ref1RM;
    baseType = 'squat';
    refFactor = getFactor(refExercise, 'squat');
    targetFactor = getFactor(targetExercise, 'squat');
    if (refExercise !== 'squat') base1RM = ref1RM / refFactor;
    if (targetExercise !== 'squat') base1RM = base1RM * targetFactor;
  } else {
    throw new Error('Unknown exercise type');
  }

  const targetWeight = calculateTargetWeight(base1RM, targetReps, k);
  return {
    ref1RM: ref1RM,
    target1RM: base1RM,
    targetWeight: targetWeight
  };
}

function showResult(result, ref, target) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <div><strong>Reference 1RM:</strong> ${result.ref1RM.toFixed(1)} lbs</div>
    <div><strong>Target 1RM:</strong> ${result.target1RM.toFixed(1)} lbs</div>
    <div style="font-size:1.3em;margin-top:10px;"><strong>Recommended Weight for ${target.targetReps} reps of ${formatExerciseName(target.targetExercise)}:</strong><br><span style="color:#007bff;font-weight:bold;">${result.targetWeight.toFixed(1)} lbs</span></div>
  `;
}

function showError(msg) {
  // Show error in the result box, styled like a result
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<div style="color:#d32f2f;font-weight:bold;">${msg}</div>`;
  // Also clear the small error-message area
  document.getElementById('error-message').textContent = '';
}

function clearError() {
  // Clear both result and error-message areas
  document.getElementById('result').innerHTML = '';
  document.getElementById('error-message').textContent = '';
}

function handleFormSubmit(e) {
  e.preventDefault();
  clearError();
  try {
    const refExercise = document.getElementById('refExercise').value;
    const refWeight = parseFloat(document.getElementById('refWeight').value);
    const refReps = parseInt(document.getElementById('refReps').value, 10);
    const targetExercise = document.getElementById('targetExercise').value;
    const targetReps = parseInt(document.getElementById('targetReps').value, 10);
    if (!refExercise || !targetExercise || isNaN(refWeight) || isNaN(refReps) || isNaN(targetReps) || refWeight <= 0 || refReps <= 0 || targetReps <= 0) {
      showError('Please enter valid numbers for all fields.');
      return;
    }
    if ((isUpperBody(refExercise) && !isUpperBody(targetExercise)) || (isLowerBody(refExercise) && !isLowerBody(targetExercise))) {
      showError('Cannot convert between upper and lower body exercises.');
      return;
    }
    const result = convert({ refExercise, refWeight, refReps, targetExercise, targetReps });
    showResult(result, { refExercise, refWeight, refReps }, { targetExercise, targetReps });
  } catch (err) {
    showError(err.message);
  }
}

document.getElementById('converter-form').addEventListener('submit', handleFormSubmit);
document.getElementById('importConfig').addEventListener('click', () => {
  document.getElementById('configFileInput').click();
});
document.getElementById('configFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const userConfig = JSON.parse(ev.target.result);
      // Save config to IndexedDB for persistence
      if (window.indexedDB) {
        const request = indexedDB.open('ExerciseConverterDB', 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('config')) {
            db.createObjectStore('config', { keyPath: 'key' });
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['config'], 'readwrite');
          const store = transaction.objectStore('config');
          store.clear().onsuccess = () => {
            for (const [key, value] of Object.entries(userConfig)) {
              store.put({ key, value });
            }
            // Update in-memory config as well
            config = { ...DEFAULT_CONFIG, ...userConfig };
            populateDropdowns();
            showError('Config loaded!');
          };
        };
        request.onerror = () => {
          showError('Could not save config to IndexedDB.');
        };
      } else {
        // Fallback: just update in-memory config
        config = { ...DEFAULT_CONFIG, ...userConfig };
        populateDropdowns();
        showError('Config loaded!');
      }
    } catch (err) {
      showError('Invalid config file.');
    }
  };
  reader.readAsText(file);
});

// On load, try to load config from IndexedDB if available
window.addEventListener('DOMContentLoaded', () => {
  populateDropdowns();
  checkOffline();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
  if (window.indexedDB) {
    const request = indexedDB.open('ExerciseConverterDB', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config', { keyPath: 'key' });
      }
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['config'], 'readonly');
      const store = transaction.objectStore('config');
      const getAll = store.getAll();
      getAll.onsuccess = (ev) => {
        const configs = ev.target.result;
        if (configs && configs.length > 0) {
          const loadedConfig = {};
          configs.forEach(({ key, value }) => {
            loadedConfig[key] = value;
          });
          config = { ...DEFAULT_CONFIG, ...loadedConfig };
          populateDropdowns();
        }
      };
    };
  }
});
