function parseComment(comment, result) {
   // 去除 /** 和 */ ，去除每行前面的 *
   const lines = comment.split('\n');
   const filteredLines = lines.map(line => line.replace(/^\/\*\*|^\s*\*\s|^\s*\*\//, '').trim()).filter(line => line !== '');

   let currentLine = "";
   for (let i = 0; i < filteredLines.length; i++) {
      if (i < filteredLines.length) {
         currentLine += (currentLine ? "\n" : "") + filteredLines[i];
         if (i < filteredLines.length - 1 && !filteredLines[i + 1].startsWith("@")) {
            continue;
         };
      }

      console.log(currentLine);

      if (currentLine && currentLine.indexOf(" ") > -1) {
         const tagName = currentLine.substring(0, currentLine.indexOf(" ")).trim();
         const tagContent = currentLine.substring(currentLine.indexOf(" ") + 1).trim()

         if (tagContent) {
            // 特殊处理的标签
            switch (tagName) {
               case "@type":
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