const dollarValues = {};  // Store dollar values to prevent reset on update

function generateGeometricProgression(n, r) {
    if (r === 1) {
        return Array.from({ length: n }, () => 1 / n);
    } else {
        const a = (r - 1) / (Math.pow(r, n) - 1);
        return Array.from({ length: n }, (_, i) => a * Math.pow(r, i));
    }
}

function updateGraph() {
    const n = parseInt(document.getElementById('n').value);
    const r = parseFloat(document.getElementById('r').value);
    document.getElementById('r-value').textContent = r.toFixed(2);

    const y = generateGeometricProgression(n, r);  // Generate progression values

    // Ensure x is an array of indices from 1 to n
    const x = Array.from({length: n}, (_, i) => i + 1);

    const df = {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {color: 'blue'}
    };

    const layout = {
        title: 'Geometric Progression',
        xaxis: {title: 'Number of Prices'},
        yaxis: {title: 'Value'}
    };

    Plotly.newPlot('graph', [df], layout);
    updateDollarInputs(x);  // Pass the array x correctly
    updateProbabilitiesList(y);
    calculateExpectedValue();
}


function updateDollarInputs(x) {
    
    const container = document.getElementById('dollarValues');
    container.innerHTML = '';
    x.forEach(index => {
        const label = document.createElement('label');
        label.textContent = `Price ${index} Value: $`;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `dollarValue${index}`;
        input.value = dollarValues[index] || '';
        input.oninput = () => {
            dollarValues[index] = input.value;
            calculateExpectedValue();
        };
        container.appendChild(label);
        container.appendChild(input);
    });
}



function updateProbabilitiesList(y) {
    const list = document.getElementById('probabilitiesList');
    list.innerHTML = '';
    const total = y.reduce((sum, current) => sum + current, 0);
    y.forEach((value, index) => {
        const li = document.createElement('li');
        li.textContent = `Probability for Price ${index + 1}: ${(value / total).toFixed(8)}`;
        list.appendChild(li);
    });
}

function calculateExpectedValue() {
    var n = parseInt(document.getElementById('n').value);
    var probabilities = Array.from(document.getElementById('probabilitiesList').children, li => parseFloat(li.textContent.split(':')[1]));
    var values = Array.from({length: n}, (_, i) => parseFloat(dollarValues[i + 1] || 0));
    var expectedValue = values.reduce((acc, cur, idx) => acc + cur * probabilities[idx], 0);

    document.getElementById('expectedValue').textContent = `Expected Value: $${expectedValue.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    updateGraph();  // Initial graph display
});
