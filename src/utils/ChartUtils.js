export const dynamicColor = () => {
    let r = randIntBetween(50, 255);
    let g = randIntBetween(50, 255);
    let b = randIntBetween(50, 255);
    return "rgba(" + r + "," + g + "," + b + "0.9)";
}

export const chartDataColors = () => {
    return ['239, 154, 154','239, 83, 80',
    '206, 147, 216','224, 64, 251','159, 168, 218','83, 109, 254',
    '179, 229, 252','132, 255, 255','100, 255, 218','178, 255, 89',
    '238, 255, 65','255, 215, 64','188, 170, 164','245, 245, 245',
    '224, 224, 224','239, 154, 154','239, 83, 80','206, 147, 216',
    '224, 64, 251','159, 168, 218','83, 109, 254','179, 229, 252',
    '132, 255, 255','100, 255, 218','178, 255, 89','238, 255, 65',
    '255, 215, 64','188, 170, 164','245, 245, 245','224, 224, 224']
}

export const accumOptions = () => { 
    return ['total_points', 'assists', 'bonus', 'bps', 'yellow_cards', 'goals_scored'] 
}

function randIntBetween(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }