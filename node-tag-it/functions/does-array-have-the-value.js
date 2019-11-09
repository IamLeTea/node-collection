function doesArrayHaveTheValue(array = [], value = "") {
  return !!array.find((item, index) => {
    return item === value;
  });
}

module.exports = doesArrayHaveTheValue;