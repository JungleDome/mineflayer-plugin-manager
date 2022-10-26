//@ts-nocheck
module.exports = (bot, options) => {
    function addAttribute() {
        //@ts-ignore
        bot.newAttribute = {
            attr1: 'test_attr'
        };
    }

    function addListener() {
        bot.on('newEvent', () => {
            console.log('A custom event has been triggered.');
        });
    }

    function addObjectAssignAttribute() {
        Object.assign(bot, {newAssignAttribute: {attr1: 'test_attr'}})
    }

    addAttribute();
    addListener();
    addObjectAssignAttribute()
};