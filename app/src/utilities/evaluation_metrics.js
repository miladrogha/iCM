export function accuracy(num_tp, num_tn, n) {
  let acc = null;
  try {
    acc = (num_tp + num_tn) / n;
  } catch (e) {
    console.log(`Error occured: ${e}`);
  }
  return acc || null;
}
