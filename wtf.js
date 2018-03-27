function isSame(newVal, oldVal){
  return newVal === oldVal || (isNaN(newVal) && isNaN(oldVal))
}
