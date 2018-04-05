/**
Create function for asyn serial list processing. Takes list and callback (element, index, list, doneCb). 
Returns promise wich resolved with results. Add callbacks should be called one by one.

serialProcess([1,2,3,4,5], (el, index, list, done) => {
  console.log(`${el} start`);
  setTimeout(() => {
    console.log(`${el} end`);
    done(el*el);
  }, el*100);
}).then((list) => console.log(list)); // [1,4,9,16,25]
in callback style

serialProcess(
  [1,2,3,4,5], 
  (el, index, list, done) => {
    console.log(`${el} start`);
    setTimeout(() => {
      console.log(`${el} end`);
      done(el*el);
    }, el*100);
  },
  (list) => console.log(list)
); // [1,4,9,16,25]
*/

describe("serialProcess", () => {
  it("функция существует", () => assert.isFunction(serialProcess));
  it("функция ожидает три аргумента", () =>
    assert.equal(serialProcess.length, 3));
  it("вызывает итератор (второй аргумент) с заданными параметрами", done => {
    var list = [1, 2, 3];
    var expectedArgs = list.map((el, index, list) => [el, index, list]);
    var args = [];
    serialProcess(list, (el, index, list, iDone) => {
      args.push([el, index, list]);
      assert.isFunction(iDone);
      if (args.length === list.length) {
        assert.deepEqual(
          args,
          expectedArgs,
          `должно получиться ${JSON.stringify(expectedArgs)}`
        );
        done();
      }
      iDone();
    });
  });
  it("вызывает callback с результатом работы", done => {
    var list = [1, 2, 3];
    var expectedResult = [1, 2, 3].map(process);
    var process = el => el * el;
    serialProcess(
      list,
      (el, index, list, iDone) => iDone(process(el)),
      result =>
        done(
          assert.deepEqual(
            result,
            expectedResult,
            `должно получиться ${JSON.stringify(expectedResult)}`
          )
        )
    );
  });
  it("работает асинхронно (асихронно вызывает резултирующий callback)", done => {
    var list = [1];
    var process = el => el * el;
    var a = 0;
    serialProcess(
      list,
      (el, index, list, iDone) => iDone(process(el)),
      result => done(assert.equal(a, 1))
    );
    a++;
  });
  it("вызывает итераторы последовательно, с учетом асинхронности", done => {
    var list = [1, 2, 3];
    var expectedResult = list.reduce((acc, el, index) => {
      acc.push(`${el} at ${index} start`);
      acc.push(`${el} at ${index} end`);
      return acc;
    }, []);
    var result = [];
    var process = el => el * el;
    serialProcess(
      list,
      (el, index, list, done) => {
        result.push(`${el} at ${index} start`);
        setTimeout(() => {
          result.push(`${el} at ${index} end`);
          done(process(el));
        }, el * 10);
      },
      data => {
        try {
          assert.deepEqual(data, list.map(process), "правильный результат");
          assert.equal(
            result.join(" | "),
            expectedResult.join(" | "),
            "правильная последовательность операций"
          );
          done();
        } catch (e) {
          done(e);
        }
      }
    );
  });
});
