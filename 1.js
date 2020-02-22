var findDuplicates = function(nums) {
  let res = []
  for (let i = 0; i < nums.length; i++) {
    let v = Math.abs(nums[i])
    if (nums[v - 1] > 0) {
      nums[v - 1] = nums[v - 1] * -1
    } else {
      res.push(v)
    }
  }
  return res
}
