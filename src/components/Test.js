class Test  {
    static i = 0
  
    static isset(elem) {
      let r = "F"
      if (elem) {
        r = "C"
      }
  
      console.log(`T0${Test.i++} - ${r}`)
    }
}

export default Test