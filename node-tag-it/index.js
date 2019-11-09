const DEFAULT_NEW_TAG = "New TAG";
const { prompt } = require("enquirer");
const colors = require("colors/safe");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const isNewTag = require("./functions/is-new-tag");
const doesArrayHaveTheValue = require("./functions/does-array-have-the-value");
const getTitle = require("./functions/get-title");

colors.enable();

// Init DB
const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ data: [], tags: [], result: [] }).write();
const data = db.get("data").value();

async function appStart() {
  for (const item of data) {
    const tags = db.get("tags").value();
    const result = db.get("result").value();
    let tag = "";

    const currentIndex = data.findIndex(dItem => {
      return dItem === item;
    });

    // Select Tag from Tags
    const autoCompleteResponse = await prompt({
      type: "autocomplete",
      name: "tag",
      message: `[${currentIndex + 1}/${data.length}] ${getTitle(item)}`,
      choices: [DEFAULT_NEW_TAG].concat(tags),
      limit: 10
    });

    tag = autoCompleteResponse.tag;

    // Add New Tag
    if (isNewTag(tag, DEFAULT_NEW_TAG)) {
      const newTagResponse = await prompt({
        type: "input",
        name: "tag",
        message: "What tag is it?"
      });

      tag = newTagResponse.tag;

      if (tags.length === 0 || !doesArrayHaveTheValue(tags, tag)) {
        db.get("tags")
          .push(newTagResponse.tag)
          .write();
      }
    }

    // Check result has the value yet
    const value = `[${tag}]${item}`;
    if (result.length === 0 || !doesArrayHaveTheValue(result, value)) {
      // Ppush To Result
      db.get("result")
        .push(value)
        .write();

      // Remove Item
      const currentData = db.get("data").value();
      const dataWithoutItem = currentData.filter(cItem => {
        return cItem !== item;
      });
      db.set("data", dataWithoutItem).write();
    }
  }
}

appStart();
