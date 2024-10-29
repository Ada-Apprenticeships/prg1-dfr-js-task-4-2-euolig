const fs = require("fs");

function fileExists(filename) {
  return fs.existsSync(filename);
}

function validNumber(value) {
  if (typeof value === 'number'){
    return !isNaN(value);
  } else if (typeof value === 'string'){
    const validNumbers = /^-?\d+(\.\d+)?$/;
    return validNumbers.test(value);
  } else {
    return false;
  }
}

function dataDimensions(dataframe) {
  return !Array.isArray(dataframe)
    ? [-1, -1] // Not an array
    : dataframe.length === 0
    ? [0, 0] // Empty array
    : Array.isArray(dataframe[0])
    ? [dataframe.length, dataframe[0].length] // 2D array
    : [dataframe.length, -1]; // 1D array
}

function findTotal(dataset) {
  if (!Array.isArray(dataset)) {
    return 0;
  }
  const validNumbers = dataset.filter(validNumber);
  return validNumbers.reduce((total, value) => total + Number(value), 0);
}

function calculateMean(dataset) {
  // Check if dataset is an array and not empty
  if (!Array.isArray(dataset)) {
    return 0;
  }
  // Flatten the dataset and filter out valid numbers
  const validNumbers = dataset.filter(validNumber).map(value =>
    typeof value === 'string' ? parseFloat(value) : value
  );
  // Calculate the sum of valid numbers
  let sum = validNumbers.reduce((acc, value) => acc + value, 0);
  return validNumbers.length ? sum / validNumbers.length : 0;
}

function calculateMedian(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    return 0; // Return 0 for invalid input
  }
  // Filter out valid numbers
  const validNumbers = dataset.filter(validNumber).map(value =>
    typeof value === 'string' ? parseFloat(value) : value
  );
  // Sort the valid numbers
  validNumbers.sort((a, b) => a - b);
  const length = validNumbers.length;
  const middle = Math.floor(length / 2);
  // Calculate median based on even or odd length
  return length % 2 === 0 ? (validNumbers[middle - 1] + validNumbers[middle]) / 2 : validNumbers[middle];
}

function convertToNumber(data, col) {
  if (!Array.isArray(data)) {
    return 0;
  } 
  let count = 0; 
  for (let i = 1; i < data.length; i++) {
    const value = data[i][col];
    data [i][col] = (typeof value === 'string' && !isNaN(parseFloat(value))) ? (count++, parseFloat(value)) : value;
  }
  return count;
}

function flatten(dataframe) {
  const flattened = dataframe.map(row => row[0]);
  return flattened;
}

function loadCSV(csvFile, ignoreRows, ignoreCols) {
  if (!fs.existsSync(csvFile)) {
    return [[], -1, -1];
  }
  const fileData = fs.readFileSync(csvFile, "utf-8");
  const rows = fileData.split(/\n/).map(rows => rows.split(','));
  const totalRows = rows.length;
  const totalColumns = rows[0].length;
  const filteredRows = rows.filter((_, index) => !ignoreRows.includes(index));
  const dataframe = filteredRows.map(row => row.filter((_, index) => !ignoreCols.includes(index)));
  return [dataframe, totalRows, totalColumns];
}

function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  if (columnIndex < 0 || columnIndex >= dataframe[0].length) {
    throw new Error('Invalid column index.');
  }
  const filteredRows = dataframe.filter(row => {
    const value = row[columnIndex];
    return pattern === '*' ? true : value === pattern;
  });
  const result = filteredRows.map(row => exportColumns.length === 0 ? row : exportColumns.map(index => row[index]));
  
  return result;
}




module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};