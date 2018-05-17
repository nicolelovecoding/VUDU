/**
* get a page of data from server, page size is fixed and always = 25
* @param {number} pageIndex
 * @return Promise, resolved with page data when the data arrive from server
*   e.g. when called with pageIndex=0 will return records [0, 1, 2, ... 24] - 1st page of data set
*        when called with pageIndex=1 will return records [25, 26, 7, ... 49] - 2nd page of data set
* consider this function implemented and working
*/
const each = require('sync-each');
const async = require("async");
 
function getPageFromServer(pageIndex){
    return new Promise(function(resolve){
        //...
        resolve(pageData);
    });
}
 
/**
* fetch any range of data from server using function getPageFromServer()
* @param {number} startIndex of data
* @param {number} endIndex of data
* @returns Promise resolved when all data arrive from server
 */
function getDataRangeFromServer(startIndex, endIndex){
  var res = [];
  function getPages(i) {
    return function(cb){
      var getPagePromise = getPageFromServer(i);
      getPagePromise.then(
        function(pageData) {                    
          res = res.concat(pageData);            
          cb(null);
        }) 
    };
  };

  return new Promise(function(resolve){
    var s = Math.floor(startIndex / 25);
    var e = Math.floor(endIndex / 25);    
    var funcs = [];      
    for (var i = s; i <= e; i++) 
      funcs.push(getPages(i));
    async.parallel(funcs, function(err, result) {  
      var l;
      var r = e * 25 + 24;
      if (s == 0) 
        l = 0;
      else 
        l = 25 + (s - 1) * 25;
      for (var j = l; j < startIndex; j++) 
        res.shift();  
      for (var j = r; j > endIndex; j--) 
        res.pop();    
      resolve(res);  
    })        
  });
}
 
getDataRangeFromServer(5, 51).then(function(res) {
  console.log(res);
})
// sample cases:
 
// 1) getDataRangeFromServer(0, 1) -> returns [0, 1], calls getPageFromServer 1 time with pageIndex 0
// 2) getDataRangeFromServer(0, 49) -> returns [0..49], calls getPageFromServer 2 times  with pageIndex 0, 1
// 3) getDataRangeFromServer(5, 51) -> returns [5..51], calls getPageFromServer 3 times  with pageIndex 0, 1, 2
 
// 4) getDataRangeFromServer(50, 99) -> returns [50..99], calls getPageFromServer 2 times with pageIndex 2, 3
// 5) getDataRangeFromServer(55, 99) -> returns [55..99], calls getPageFromServer 2 times with pageIndex 2, 3
 
