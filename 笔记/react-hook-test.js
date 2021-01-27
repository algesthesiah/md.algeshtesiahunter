

function App(){
  const [num, updataNum] = useState(0)
  console.log('ismount', isMount)
  console.log(num)
  return {
      onClick() {
          updataNum((num) => num + 1)
      },
  }
}
window.app=schedule()