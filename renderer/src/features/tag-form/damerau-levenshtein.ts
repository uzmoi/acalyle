// cspell:word damerau

// HACK vitestがimportをちゃんと処理してくれないので
// esmでエクスポートし直してテスト時にモックできるようにしている。
// 具体的には`module.exports =`を`export default`にするから型が合わない。
// viteはまともなのでasでお茶を濁すことも出来ない。

import * as damerauLevenshtein from "damerau-levenshtein";

export { damerauLevenshtein };
