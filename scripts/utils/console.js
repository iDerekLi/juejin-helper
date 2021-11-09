const result = [];
let index = 0;
let groupResult = null;

module.exports = {
  clear: () => {
    result.length = 0;
    console.clear();
  },
  log: msg => {
    if (groupResult) {
      groupResult.result[index] = msg;
    } else {
      result[index] = msg;
    }
    index++;
    console.log(msg);
  },
  logGroupStart: name => {
    groupResult = {
      name,
      result: []
    }
    result.push(groupResult);
    index = 0;
    console.group(name);
  },
  logGroupEnd: name => {
    index = result.findIndex(item => item.name === name) + 1;
    groupResult = null;
    console.groupEnd(name);
  },
  toString() {
    let content = "";
    result.forEach(item => {
      if (typeof item === "string") {
        content += item + "\n";
      } else {
        content += item.name + "\n";
        content += item.result.map(i => ` - ${i}\n`);
      }
    });
    return content;
  }
}
