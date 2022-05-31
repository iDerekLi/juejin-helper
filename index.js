const checkin = require('./juejin-helper/scripts/checkin')
const seaGold = require('./juejin-helper/scripts/seaGold')

exports.main_handler = async () => {
    return Promise.all([checkin(), seaGold()])
};

main()