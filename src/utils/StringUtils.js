export const kFormatter = (num) => {
    if ((Math.abs(num) > 999) && (Math.abs(num) < 1000000)) {
        return Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k'
    } else if (Math.abs(num) > 999999) {
        return Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'm'
    } else {
        return Math.sign(num)*Math.abs(num)
    }
}

export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return word.toUpperCase();
    }).replace(/\s+/g, ' ');
}

export const readable = (str) => {
    return camelize(str.replace(/_/g, ' '))
}