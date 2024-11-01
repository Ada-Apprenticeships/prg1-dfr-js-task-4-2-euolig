const fs = require("fs");

function fileExists(filename) {
  return fs.existsSync(filename);
}
// Function to check if a value is a valid number (integer or float),
// returning true if valid and false otherwise
function validNumber(value) {
  if (typeof value === 'number'){
    return !isNaN(value);
  } else if (typeof value === 'string'){
    const validNumbers = /^-?\d+(\.\d+)?$/; // Regex to check for valid number format
    return validNumbers.test(value);
  } else {
    return false;
  }
}
// Function to determine the dimensions of an array
// Checks whether an input is a 1D or 2D array and returns its dimensions
function dataDimensions(dataframe) {
  return !Array.isArray(dataframe)
    ? [-1, -1] // Not an array
    : dataframe.length === 0
    ? [0, 0] // Empty array
    : Array.isArray(dataframe[0])
    ? [dataframe.length, dataframe[0].length] // 2D array
    : [dataframe.length, -1]; // 1D array
}
// Function to find the total sum of numbers in an array
// Calculates and returns the sum of all valid numbers within an array.
function findTotal(dataset) {
  if (!Array.isArray(dataset)) {
    return 0;
  }
  const validNumbers = dataset.filter(validNumber);
  return validNumbers.reduce((total, value) => total + Number(value), 0);
}
// Function to calculate the mean (average) of valid numbers in an array
// Filters and converts valid numbers then calculates the mean
// Returns the mean as a number, or 0 if no valid numbers are found
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
// Function to calculate the median of valid numbers in an array
// Finds the middle value in a sorted list of valid numbers from an array
// Returns the median value as a number, or 0 if no valid numbers are present
function calculateMedian(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    return 0;
  }
  const validNumbers = dataset.filter(validNumber).map(value =>
    typeof value === 'string' ? parseFloat(value) : value
  );
  validNumbers.sort((a, b) => a - b);
  const length = validNumbers.length;
  const middle = Math.floor(length / 2);
  // Checks for both even or odd lengths
  return length % 2 === 0 ? (validNumbers[middle - 1] + validNumbers[middle]) / 2 : validNumbers[middle];
}
// Function to convert valid numeric strings to numbers in a specified column of a 2D array
// Returns the count of successful conversions
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
// Function to flatten a 2D array to a 1D array by extracting the first element of each sub-array
function flatten(dataframe) {
  const flattened = dataframe.map(row => row[0]);
  return flattened;
}
// Function to load a CSV file into a 2D array, with optional row and column exclusions
// Returns the processed 2D array and the original dimensions of the CSV
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
// Function to create a subset of a dataframe based on a specified pattern in a column
// Extracts rows from a 2D array where a specific column matches a given pattern
// Allows exporting specific columns from the matched rows
// Returns the filtered and possibly reduced subset of the dataframe
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