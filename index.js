const checkin = require('./scripts/checkin')
const seaGold = require('./scripts/seaGold')

exports.main_handler = async () => {
    await checkin()
    await seaGold()
};