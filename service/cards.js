var cards = {};
var Cards = require('../modal/cards');
module.exports = cards;
cards.batch_service = function* (strArray,topicId,idArray){
    var cardArray = [];
    var len = idArray.length;
    for(var j=0;j<strArray.length;j++){
        if(strArray[j]){
            var obj = strArray[j];
            var remainder = j%len;
            obj.topicId = topicId;
            obj.userId = idArray[remainder];
            obj.isClose = false;
            cardArray.push(obj);
        }
    }
    yield Cards.bulkCreate(cardArray);
}