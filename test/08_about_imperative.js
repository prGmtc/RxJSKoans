var Rx = require('rx'),
    Observable = Rx.Observable;

QUnit.module('Imperative');

var __ = 'Fill in the blank';

test('can make a decision with an if with no else', function () {
  var results = [];
  Observable.range(1, 10)
    .flatMap(function (x) {
      return Rx.Observable.if(
        function () { return x % 2 === 0; },
        Observable.just(x)
      );
    })
    .subscribe(results.push.bind(results));

  equal('246810', results.join(''));
});

test('can make a decision with an if with an else', function () {
  var results = [];
  Observable.range(1, 5)
    .flatMap(function (x, i) {
      //(1,0) : Range(1,0) : []
      //(2,1) : Just(2)
      //(3,2) : Range (3,2) : 3,4
      //(4,3) : Just(4)
      //(5,4) : Range(5,4) : 5,6,7,8
      return Rx.Observable.if(
        function () {return x % 2 === 0; },
        Observable.just(x),
        Observable.range(x, i)
      );
    })
    .subscribe(results.push.bind(results));

  equal('2'+'34'+'4'+'5678', results.join(''));
});

test('we can make test cases', function () {
  var result = '';

  var cases = {
    'matt': Observable.just(1),
    'erik': Observable.just(2),
    'bart': Observable.just(3),
    'wes': Observable.just(4)
  };

  Observable.just('wes')
    .flatMap(function (x) {
      return Observable.case(
        function () { return x; }, //predicate: case selector
        cases
      );
    })
    .subscribe(function (x) { result = x; });

  equal(4, result);
});

test('we can also have a default case', function () {
  var result = '';

  var cases = {
    'matt': Observable.just(1),
    'erik': Observable.just(2),
    'bart': Observable.just(3),
    'wes': Observable.just(4)
  };

  Observable.just('RxJS')
    .flatMap(function (x) {
      return Observable.case(
        function () { return x; },
        cases,
        Observable.just(5) //default fallback if no case found
      );
    })
    .subscribe(function (x) { result = x; });

  equal(5, result);
});

test('while does something until proven false', function () {
  var i = 0;
  var result = [];

  var source = Rx.Observable
    .while(
      function () { return ++i < 3 },
      Rx.Observable.just('42')
    )
    .subscribe(result.push.bind(result));

  equal('4242', result.join(''));
});
