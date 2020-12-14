export function run<T, R>(f: (_: T) => R, args: T): R {
  return f(args);
}
