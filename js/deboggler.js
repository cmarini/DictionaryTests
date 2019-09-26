var boardSize = 8;
var charLimit = 0;
var minCharLimit = 3;

var CANBEWORDCHECKS = 0;

function canBeWord() {};
function isWord() {};

var board;

var dicts = [];

class Dictionary {
    constructor(name, dictGenerator, func_canBeWord, func_isWord, func_searchStart, func_searchContains) {
        this.name = name;
        this.dict = dictGenerator();
        this.canBeWord = func_canBeWord;
        this.isWord = func_isWord;
        this.searchStart = func_searchStart;
        this.searchContains = func_searchContains;
    }
}

function buildDict()
{

    dict.sort();
    dict.forEach(function (word, i) {
        charLimit = word.length>charLimit?word.length:charLimit;
    });
    console.log(`Longest word is ${charLimit} characters`);

    dicts = [
        new Dictionary("Binary Search String", 
            function() { // Dict Generator
                console.time("Build Dict: Binary Search String ");
                // Initialize first letter
                var d = {};
                for (var i = 10; i<36; i++) {
                    d[i.toString(36)] = [];
                }
                var radix;
                dict.forEach(function (word, i) {
                    radix = word.length-1;
                    if(word.length >= minCharLimit) {
                        d[word.substr(0,1)][radix] = d[word.substr(0,1)][radix] || "";
                        d[word.substr(0,1)][radix] += word.substring(1);
                    }
                });
                console.timeEnd("Build Dict: Binary Search String ");
                return d;
            }, 
            function(word) { // Can Be Word
                var suffix = word.substring(1);
                var radix = suffix.length;
                var dictSlice = this.dict[word.substring(0,1)];
                var keys = Object.keys(dictSlice);
                var dictStr;
                for (radix; radix <= keys[keys.length-1]; radix++) {
                    if (!dictSlice.hasOwnProperty(radix)) {
                        continue;
                    }
                    dictStr = dictSlice[radix];
                    var l = 0;
                    var m;
                    var h = dictStr.length/radix - 1;
                    while (l <= h) {
                        m = Math.floor((l + h) / 2);
                        var str = dictStr.substr(m*radix, radix).substring(0,suffix.length);
                        if (suffix > str) {
                            l = m + 1;
                        }
                        else if (suffix < str) {
                            h = m - 1;
                        }
                        else {
                            return word.substring(0,1) + str;
                        }
                    }
                }
                return false;
            },
            function (word) { // Is Word
                var suffix = word.substring(1);
                var radix = word.length-1;
                var dictStr = this.dict[word.substr(0,1)][radix];
                if (!dictStr) {
                    return false;
                }
                var l = 0;
                var m;
                var h = dictStr.length/radix - 1;
                while (l <= h) {
                    m = Math.floor((l + h) / 2);
                    var str = dictStr.substr(m*radix, radix);
                    if (suffix > str) {
                        l = m + 1;
                    }
                    else if (suffix < str) {
                        h = m - 1;
                    }
                    else {
                        return word.substring(0,1) + str;
                    }
                }
                return false;
            },
			function (word) { // Search Start
				
				return;
			},
			function (word) { // Search Contains
				var matchList = [];
				// var suffix = word.substring(1);
				var d = this.dict;
				var radix;
				var dictSliceKeys = Object.keys(d);
				// iterate dict by starting letter
				dictSliceKeys.forEach(function (key) {
					if (word.indexOf(key) >= 0) {
						// the search term could be in this dict key
						radix = word.length-1;
					} else {
						// search term does not contain the key letter. Must be at least one letter longer.
						radix = word.length;
					}
					var dictSlice = d[key];
					var radices = Object.keys(dictSlice);
					// Iterate over each dict string at least that length
					for (var r = 0; r < radices.length; r++) {
						if (!dictSlice.hasOwnProperty(radix)) {
							radix++;
							continue;
						}
						var words = chunkString(dictSlice[radix], radix);
						var w;
						for (var i = 0; i < words.length; i++) {
							w = key + words[i];
							if (w.indexOf(word) >=0 ) {
								//console.log(w);
								matchList.push(w);
							}
						}
						radix++;
					}
				});
				return matchList;
			}
        ),
        /*
        new Dictionary("Trie", 
            function() {
                console.time("Build Dict: Trie");
                var d = {};
                dict.forEach(function (word, i) {
                    if (word.length >= minCharLimit) {
                        var c = '';
                        var node = d;
                        for (var i=0; i<word.length; i++) {
                            c = word.charAt(i);
                            if (!node.hasOwnProperty(c)) {
                                node[c] = {};
                            }
                            node = node[c];
                        }
                        node.isWord = true;
                    }
                });
                console.timeEnd("Build Dict: Trie");
                return d;
            }, 
            function(word) {
                var c = '';
                var node = this.dict;
                for (var i=0; i<word.length; i++) {
                    c = word.charAt(i);
                    if (!node.hasOwnProperty(c)) {
                        return false;
                    }
                    node = node[c];
                }
                return true;
            },
            function (word) {
                if (word.length >= minCharLimit) {
                    var c = '';
                    var node = this.dict;
                    for (var i=0; i<word.length; i++) {
                        c = word.charAt(i);
                        if (!node.hasOwnProperty(c)) {
                            return false;
                        }
                        node = node[c];
                    }
                    if (node.hasOwnProperty("isWord")) {
                        return word;
                    }
                }
            }
        ),
        */
        new Dictionary("Prefix Index", 
            function() {
                console.time("Build Dict: Prefix Index");
                var d = {};
                dict.forEach(function (word, i) {
                    var letters = word.substring(0,minCharLimit);
                    if (letters.length >= minCharLimit) {
                        if (!d.hasOwnProperty(letters)) {
                            d[letters] = [];
                        }
                        d[letters].push(word);
                    }
                });
                console.timeEnd("Build Dict: Prefix Index");
                return d;
            }, 
            function(word) {
                if (word.length > 0) {
                    if (word.length < minCharLimit) {
                        return true;
                        // Just search the keys
                        return Object.keys(this.dict).filter(function (x){
                            return !x.search(word);
                        }).length;
                    }
                    else if (word.length == minCharLimit) {
                        if (this.dict[word]) return word;
                    }
                    else if (this.dict.hasOwnProperty(word.substring(0,minCharLimit))) {
                        return this.dict[word.substring(0,minCharLimit)].filter(function (x){
                            return !x.search(word);
                        }).length;
                    }
                    return false;
                }
                return word;
            },
            function (word) {
                return (this.dict[word.substring(0,minCharLimit)].filter(function (x){
                    return x==word;
                })[0]);
            },
			function (word) { // Search Start
				return dict.filter(function (w,i){
                    return (w.search(word) == 0);
                });
			},
			function (word) { // Search Contains
				return dict.filter(function (w,i){
                    return (w.search(word) >= 0);
                });
			},
        ),
    ];
    
    return;
    console.log("--- VALIDATING DICTIONARIES");
    fisherYates(dict);
    dicts.forEach(function(d, i) {
        console.log("TESTING: " + d.name);
        console.log(d);
        console.time("TESTING: " + d.name);
        checkDictionary(d);
        console.timeEnd("TESTING: " + d.name);
    });
    console.log("--- DONE VALIDATING DICTIONARIES");
    // return;
    console.log("--- SOLVING BOARD");
    for(var i = 0; i < dicts.length; i++) {
        var d = dicts[i];
        canBeWord = d.canBeWord.bind(d);
        isWord = d.isWord.bind(d);
        console.time("PERFORMANCE TEST: " + d.name);
        solve();
        console.timeEnd("PERFORMANCE TEST: " + d.name);
        console.log(validWords);
    };
    console.log("--- DONE SOLVING BOARD");

}

function checkDictionary(dictClass) {
    for(var i = 0; i<dict.length; i++) {
        word = dict[i];
        if (word.length >= minCharLimit) {
            var search = dictClass.isWord(word);
            if (word != search) {
                console.error(`Searching "${word}" returned "${search}"`);
                return;
            }
        }
    }
}

function fisherYates ( myArray ) {
    var i = myArray.length;
    if ( i == 0 ) return false;
    while ( --i ) {
       var j = Math.floor( Math.random() * ( i + 1 ) );
       var tempi = myArray[i];
       var tempj = myArray[j];
       myArray[i] = tempj;
       myArray[j] = tempi;
     }
  }

  
function solve()
{   
    validWords = new Array();
    CANBEWORDCHECKS = 0;

    var memo = new Array();
    for (var row=0; row<boardSize; row++) {
        memo[row] = new Array();
    }
    for (var row=0; row<boardSize; row++) {
        for (var col=0; col<boardSize; col++) {
            solveRecurse("", row, col, memo);
        }
    }
    // console.log("canBeWord Checks = "+CANBEWORDCHECKS);
    validWords = removeDup(validWords);
}
  
function solveRecurse(word, row, col, memo)
{
    if (memo[row][col]) {
        return;
    }
    
    word += board[row][col];
    memo[row][col] = true;
    if (word.length >= 2) {
        CANBEWORDCHECKS++;
        if (canBeWord(word))
        {
            if (word.length >= minCharLimit) {
                if (isWord(word)) {
                    validWords.push(word);
                }
            }
        } 
        else
        {
            memo[row][col] = false;
            return;
        }
    }
    if (word.length < charLimit)
    {
        for (var r=(-1); r<2; r++) {
            for (var c=(-1); c<2; c++) {
                if (row+r >= 0 && row+r < boardSize &&
                    col+c >= 0 && col+c < boardSize &&
                    !(r == 0 && c == 0)
                    ) 
                {
                    solveRecurse(word, row+r, col+c, memo);
                }
            }
        }
    }
    memo[row][col] = false;
}

function generateBoard()
{
    board = [];
    if (boardSize == 4) {
        board = [
            ["y","b","e","n"],
            ["v","r","k","l"],
            ["p","m","n","r"],
            ["a","i","d","i"],
        ];
        return board;
    }
    if (boardSize == 10) {
        board = [
            ["q","e","x","s","l","m","x","y","o","i"],
            ["f","u","t","i","n","v","v","a","e","f"],
            ["t","o","d","r","c","l","n","r","r","c"],
            ["q","c","s","m","k","g","f","a","g","j"],
            ["q","r","c","z","v","i","y","r","k","j"],
            ["z","w","n","b","c","p","s","c","p","f"],
            ["e","q","v","i","n","l","q","k","m","i"],
            ["z","d","d","c","t","i","g","k","l","v"],
            ["z","a","s","f","h","n","h","j","i","u"],
            ["i","a","y","i","s","b","v","s","c","i"],
        ];
        return board;
    }

    for (var row=0; row<boardSize; row++) {
        board[row] = [];
        for (var col=0; col<boardSize; col++) {
            var c = (Math.floor(Math.random()*26)+10).toString(36);
            board[row][col] = c;
        }
    }
    console.log(board);
    return board; 
}


function removeDup (list)
{
    var prev = undefined;
    list.sort();
    return list.filter(function (x) {
        if( x != prev ) {
            prev = x;
            return true;
        }
        return false;
    });
}

function chunkString(str, len) {
    var size = str.length / len + .5 | 0,
        ret  = new Array(size),
        offset = 0;
  
    for(var i = 0; i < size; ++i, offset += len) {
      ret[i] = str.substring(offset, offset + len);
	}
	return ret;
}
