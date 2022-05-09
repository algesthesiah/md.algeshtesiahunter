const a = ['flower', 'flow', 'flight'];
function findSamePre(arr) {
    let res = '';
    let i = 0;
    while (i != -1) {
        for (let j = 0; j < arr.length; j++) {
            const v=arr[j]
            const strItem = v[i];
            if (j === 0) {
                res += strItem;
            }
            if (!strItem || strItem !== res[i]) {
                res = res.slice(0, res.length - 1);
                i === -1;
                return res;
            }
        }
        i += 1;
    }
    return res;

}
findSamePre(a);

