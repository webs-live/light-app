export function getColumns(num: number, bew: number, max: number) {
  function createChildren(num: number) {
    let arr: any[] = [];
    const m = 24 - max - num;
    const b = 24 - m - bew;

    for (let index = num; index <= b; index++) {
      if (index <= 24) {
        const time = index > 9 ? `${index}时` : `0${index}时`;
        arr.push({
          text: time,
          value: time,
        });
      }
    }

    return arr;
  }

  let arr: any[] = [];
  for (let index = 0; index <= num; index++) {
    const time = index > 9 ? `${index}时` : `0${index}时`;
    arr.push({
      text: time,
      value: time,
      children: createChildren(bew + index),
    });
  }
  return arr;
}
