module.exports = {
  async wait(time = 0) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}
