// 输入: [4, 6, 7, 7]
// 输出: [[4, 6], [4, 7], [4, 6, 7], [4, 6, 7, 7], [6, 7], [6, 7, 7], [7,7], [4,7,7]]
// [[4,6],[4,6,7],[4,6,7,7],   [4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
var arr =[4, 6, 7, 7]
function back(arr) {
    let res = [];
    let len = arr.length;
    let set = new Set();
    function dfs(start, path) {
        path.push(arr[start]);
        if (path.length >= 2) {
            let str = path.toString();
            if (!set.has(str)) {
                set.add(str);
                res.push(path.slice());
            }
        }
        for (let i = start + 1; i <= len; i++) {
            const cur = arr[i];
            const pre = arr[start];
            if (cur >= pre) {
                dfs(i, path);
            }
        }
        path.pop();
    }
    for (let i = 0; i < len; i++) {
        dfs(i, []);
    }
    return res;
}
back(arr);
