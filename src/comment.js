function parseComment(comment, result) {
   // 去除 /** 和 */ ，去除每行前面的 *
   const lines = comment.split('\n');
   const filteredLines = lines.map(line => line.replace(/^\/\*\*|^\s*\*\s|^\s*\*\//, '').trim()).filter(line => line !== '');

   let currentLine = "";
   if (comment.indexOf('@') > -1) {
      let title = filteredLines.join("\n").substring(0, filteredLines.join("\n").indexOf('@'));
      if (title.trim()) {
         result["_title"] = title.trim();
      }
   }
   for (let i = 0; i < filteredLines.length; i++) {
      if (i < filteredLines.length) {
         currentLine += (currentLine ? "\n" : "") + filteredLines[i];
         if (i < filteredLines.length - 1 && !filteredLines[i + 1].startsWith("@")) {
            continue;
         };
      }

      if (currentLine && currentLine.indexOf(" ") > -1) {
         const tagName = currentLine.substring(0, currentLine.indexOf(" ")).trim().replace("@", "_");
         const tagContent = currentLine.substring(currentLine.indexOf(" ") + 1).trim()

         if (tagContent) {
            // 特殊处理的标签
            switch (tagName) {
               case "_type":
                  result[tagName] = tagContent.replace(/\{|\}/g, "");
                  break;
               default:
                  result[tagName] = tagContent;
                  break;
            }
         }
      }
      currentLine = "";
   }

}

module.exports = parseComment;