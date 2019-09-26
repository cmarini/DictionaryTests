

function runTest_validation() {
    var suite = new Benchmark.Suite;
    fisherYates(dict);
    dicts.forEach(function(d, i) {
        function check() { checkDictionary(d) }
        suite.add({
            'name': d.name,
            'fn': check,
        });
    });
    suite.on("start", function() {
        console.log("---- Starting Validation Tests");
    })
    .on("complete", function() {
        console.log("Test completed");
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .run({'async': true});
}

function runTest_solve() {
    generateBoard();
    var suite = new Benchmark.Suite;
    dicts.forEach(function(d, i) {
        function check() { 
            canBeWord = d.canBeWord.bind(d);
            isWord = d.isWord.bind(d);
            solve();
        }
        suite.add({
            'name': d.name,
            'fn': check,
        });
    });
    suite.on("start", function() {
        console.log("---- Starting Solve Tests");
    })
    .on("complete", function() {
        console.log("Test completed");
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .run({'async': true});
}

function runTest_searchContains(search) {
    if (!search) {
        search = "app";
    }
    var suite = new Benchmark.Suite;
    dicts.forEach(function(d, i) {
        function check() { 
            return d.searchContains(search);
        }
        suite.add({
            'name': d.name,
            'fn': check,
        });
        console.log(check());
    });
    suite.on("start", function() {
        console.log("---- Starting SearchContains Tests");
    })
    .on("complete", function() {
        console.log("Test completed");
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .run({'async': true});
}
