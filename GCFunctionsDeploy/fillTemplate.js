const fs = require('fs');

/**
 * Fill template with data.
 *
 * @param {object} data - Data for the template.
 * @param {string} template - Template to be filled.
 * @param {string[]} templateVariables - The placeholders in the template.
 * @returns {string} - Filled template.
 */
function fillTemplate(data, template, templateVariables) {
    console.log('Attempting to fill template with data');

    let filledTemplate = template;

    for (const variableIdx in templateVariables) {
        let variable = templateVariables[variableIdx];
        let varData = data[templateVariables[variableIdx]];

        // If var data is null 
        if (varData == null) {
            varData = 'Error getting (' + variable + ')';
        }

        // If the data is not an array and not null, assume it's non-tabular
        if (!Array.isArray(varData)) {
            filledTemplate = filledTemplate.replace('{' + variable + '}', '{' + varData + '}');
        }

        // If the field in the data is an array, then assume it's tabular data (e.g., products)
        else if (Array.isArray(varData)) {
            const dynamicContent = varData.map(data => `${data.description} & ${data.quantity} & ${data.unitPrice} & ${data.tax} & ${data.cost} \\\\ `).join('\\midrule\n');
            filledTemplate = filledTemplate.replace('{' + variable + '}', '{' + dynamicContent + '}');
        }
    }

    return filledTemplate;
}

/**
 * Gets the variables within the template.
 *
 * @param {string} template - Template containing variables.
 * @param {RegExp} regexToFindVariables - Regular expression pattern to extract variables from the template.
 * @returns {string[]} - Array of variable names.
 */
function getVariableNames(template, regexToFindVariables) {
    console.log('Getting variables from template');

    // Define a regex pattern to extract variables from the template
    const variablePattern = regexToFindVariables;
    const variableNames = [];

    let match;
    while ((match = variablePattern.exec(template)) !== null) {
        variableNames.push(match[2]);
        console.log('Variable Found: ' + match[2]);
    }

    return variableNames;
}

// Export the fillTemplate and getVariableNames functions
module.exports = {
    fillTemplate,
    getVariableNames
};
