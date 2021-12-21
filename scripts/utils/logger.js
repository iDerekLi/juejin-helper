class LogNode {
  constructor(data, parent = null, leaf = true) {
    this.data = data;
    this.parent = parent;
    this.level = parent ? parent.level + 1 : 0;
    this.leaf = leaf;

    if (!leaf) {
      this.children = [];
    }
  }

  toString() {
    const level = this.level - 1;
    const isGroup = !this.leaf;
    return `${' '.repeat(level * 3)}${isGroup ? '▼' : level > 0 ? '-' : ' '} ${this.data}\n`;
  }
}

class Logger {
  result = this.createNode(null, null, false);
  current = this.result;

  createNode(data, parent, leaf) {
    return new LogNode(data, parent, leaf);
  }

  clear() {
    this.result = this.createNode(null, null, false);
    this.current = this.result;
    console.clear();
  }

  log(msg) {
    const node = this.createNode(msg, this.current, true);
    this.current.children.push(node);
    console.log(msg);
  }

  logGroupStart(name) {
    const current = this.createNode(name, this.current, false);
    this.result.children.push(current);
    this.current = current;
    console.group(name);
  }

  logGroupEnd(name) {
    const current = this.current.parent;
    this.current = current;
    console.groupEnd(name);
  }

  toString() {
    const each = children => {
      if (!Array.isArray(children)) return "";
      let content = "";
      children.forEach(child => {
        content += child.toString();
        if (!child.leaf) {
          content += each(child.children);
        }
      });
      return content;
    }
    return each(this.result.children);
  }
}

const logger = new Logger();

module.exports = logger;
// logger.log(2)
// logger.logGroupStart("group 1")
// logger.log(3)
// logger.log(4)
// logger.log(5)
// logger.logGroupStart("group 2")
// logger.log(6)
// logger.log(7)
// logger.log(8)
// logger.logGroupEnd("group 2")
// logger.logGroupEnd("group 1")
// logger.log(9)
// logger.toString();
