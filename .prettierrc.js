/**
 * 代码风格
 * 更多配置请戳 https://prettier.io/docs/en/options.html
 */
module.exports = {
  printWidth: 120, // 代码长度
  useTabs: false, // 使用制表符缩进行而不是空格。
  tabWidth: 2, // 2个空格缩进
  endOfLine: "lf", // 2个空格缩进
  singleQuote: false, // 使用单引号
  semi: true, // 在每个语句的末尾添加分号。
  trailingComma: "none", // 多行末尾加逗号，单行末尾不加逗号
  /**
   * 在单个箭头函数参数周围加上括号
   * "avoid" - 尽可能省略parens。例：x => x
   * "always" - 始终包括parens。例：(x) => x
   */
  arrowParens: "avoid",
  bracketSpacing: true // 对象左右空格 例如：{ a: 1 }
};
