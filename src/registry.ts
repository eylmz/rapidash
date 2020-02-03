import { SolutionBuilder } from './solution';
import { Benchmark, BenchmarkReport } from './benchmark';
import { solution as max } from './functions/max';
import { solution as factorial } from './functions/factorial';

type BenchmarkResults = Array<{
  function: SolutionBuilder;
  benchmarkResults: BenchmarkReport;
}>;

class Registry {
  static solutions: SolutionBuilder[] = [];

  static solution(fnName: string, solutions: SolutionBuilder) {
    this.solutions.push(solutions);
    return this;
  }

  static async benchmarkWinners() {
    const benchMarksResults: BenchmarkResults = [];

    for (const solution of this.solutions) {
      const benchmark = new Benchmark(
        solution.solutions,
        solution.benchmarkInput,
        solution.name
      );

      benchMarksResults.push({
        function: solution,
        benchmarkResults: await benchmark.run(),
      });
    }

    return benchMarksResults;
  }

  static runSolutionTests() {
    this.solutions.forEach(solutionBuilder => {
      describe(solutionBuilder.name, () => {
        solutionBuilder.solutions.forEach(solution => {
          describe(`Solution Owner: ${solution.owner}, method: ${solution.methodDescription}`, () => {
            solutionBuilder.testCases.forEach(test => {
              it(test.name, () => {
                const returnValue = (solution.func as any)!(...test.input);
                expect(returnValue).toEqual(test.output);
              });
            });
          });
        });
      });
    });
  }
}

Registry.solution('max', max).solution('factorial', factorial);

export { BenchmarkResults, Registry };
