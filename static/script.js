document.getElementById('uploadForm').addEventListener('submit', function() {
    document.getElementById('loading').style.display = 'block';
});

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const img = document.getElementById('uploadedImage');
        img.src = reader.result;
        img.classList.remove('hidden');
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

window.onload = function() {
    const outputText = document.querySelector('.output-container p');
    if (outputText) {
        let text = outputText.innerHTML;
        text = text.replace(/\*\*(.*?)\*\*/g, '$1');
        outputText.innerHTML = text;
        displayNutrientTables(text);
    }
};

function displayNutrientTables(text) {
    const macroNutrients = extractMacroNutrients(text);
    const microNutrients = extractMicroNutrients(text);
    const nutrientTablesDiv = document.getElementById('nutrientTables');

    if (macroNutrients) {
        nutrientTablesDiv.innerHTML += '<h3>Macronutrients</h3>' + createTable(macroNutrients);
    }
    if (microNutrients) {
        nutrientTablesDiv.innerHTML += '<h3>Micronutrients</h3>' + createTable(microNutrients);
    }
}

function extractMacroNutrients(text) {
    const nutrients = {};
    const carbsMatch = text.match(/Carbohydrates:\s*([\d.]+)-([\d.]+)\s*grams/);
    const sugarMatch = text.match(/Sugars:\s*([\d.]+)-([\d.]+)\s*grams/);
    const fatMatch = text.match(/Fat:\s*([\d.]+)-([\d.]+)\s*grams/);
    const proteinMatch = text.match(/Protein:\s*([\d.]+)-([\d.]+)\s*grams/);

    if (carbsMatch) nutrients['Carbohydrates'] = `${carbsMatch[1]}-${carbsMatch[2]} grams`;
    if (sugarMatch) nutrients['Sugars'] = `${sugarMatch[1]}-${sugarMatch[2]} grams`;
    if (fatMatch) nutrients['Fat'] = `${fatMatch[1]}-${fatMatch[2]} grams`;
    if (proteinMatch) nutrients['Protein'] = `${proteinMatch[1]}-${proteinMatch[2]} grams`;

    return nutrients;
}

function extractMicroNutrients(text) {
    const micronutrientsMatch = text.match(/Micronutrients:\s*(.*?)(?=(Macronutrients:|Calorie Count:|Sustainability Score:|$))/s);

    if (micronutrientsMatch) {
        const micronutrientsText = micronutrientsMatch[1].trim();
        const micronutrientsArray = micronutrientsText.split('\n').filter(line => line.trim() !== '');
        const micronutrients = {};
        micronutrientsArray.forEach(nutrient => {
            const trimmedNutrient = nutrient.replace(/^\s*\*\s*/, '').trim();
            if (trimmedNutrient) {
                micronutrients[trimmedNutrient] = 'Detected';
            }
        });
        return micronutrients;
    }
    return null;
}

function createTable(data) {
    let table = '<table border="1"><tr><th>Nutrient</th><th>Value</th></tr>';
    for (const key in data) {
        table += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
    }
    table += '</table>';
    return table;
}