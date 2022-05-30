const checkin = require('./juejin-helper/scripts/checkin')
const seaGold = require('./juejin-helper/scripts/seaGold')
// const lottery = require('./juejin-helper/scripts/lottery')

exports.main_handler = async () => {
    await checkin()
    await seaGold()
    // await lottery() 暂未开发
};