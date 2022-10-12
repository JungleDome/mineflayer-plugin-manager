//@ts-nocheck
module.exports = (bot, options) => {
    function addAttribute() {
        //@ts-ignore
        bot.newAttribute = {
            attr1: 'test_attr'
        };
    }

    function addListener() {
        bot.on('spawn', () => {
            console.log('Bot has been spawn.');
        });
    }

    addAttribute();
    addListener();
};