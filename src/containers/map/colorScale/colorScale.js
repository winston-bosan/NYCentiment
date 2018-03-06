import tinygradient from 'tinygradient';

const innerGradient = tinygradient(['#108188', '#eee7e5', '#c22e00']);

const resultGradient = innerGradient.rgb(100).map(el => {
  let result = [];
  let newElement = el.toRgb();
  for (let key in newElement) {
    result.push(newElement[key]);
  }
  return result;
});

//Color Spectrum Function
export function colorScale(lowest, input, highest) {
  let position = 100 - Math.floor((highest - input) / (highest - lowest) * 100);
  let result = resultGradient[position];

  if (result === undefined) {
    return [0, 0, 0, 90];
  }

  result[3] = 255;
  return result;
}
