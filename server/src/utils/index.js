
 

const { Types } = require("mongoose");

// [el, 1]  ==1 chọn ==0 không chọn
const getSelectData = (select = []) => { return Object.fromEntries(select.map(el => [el, 1])); }
const getUnselectData = (unselect = []) => { return Object.fromEntries(unselect.map(el => [el, 0])); }
const convertToObjectIdMongodb = id =>new Types.ObjectId(id)
// dạng 1: 
// a {
//      b: 1,
//      c: 2
// sang dạng 2:
// a.b: 1,
// a.c: 2
// Mình phải chuyển đổi như vậy vì trong trường hợp mình chỉ muốn update giá trị b sang 3 chẳng hạn, 
// nếu mình để như dạng 1 và không truyền key c vào trong object a thì database sẽ update cái object
//  a của mình thành chỉ có key b, key c sẽ bị remove. Còn nếu mình để a.b = 3 như dạng 2 thì database
//   sẽ update giá trị của key b chứ không phải giá trị của key a.
// Em hiểu như vậy đúng không ạ? Mong anh và mọi người giải đáp ạ. Em cảm ơn anh và mọi người nhiều
const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k];
        }
    });
    return obj
};

const updateNestedObjectParser = obj => {
    const final = {};
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
            const response = removeUndefinedObject(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    console.log("[2]: ", final);
    return final;
};




module.exports = { getSelectData, updateNestedObjectParser, getUnselectData ,convertToObjectIdMongodb}