function notChange(newVal, oldVal){
  return newVal === oldVal || (isNaN(newVal) && isNaN(oldVal))
}
