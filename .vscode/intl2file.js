exports.execute = async (args) => {
  // args => https://egodigital.github.io/vscode-powertools/api/interfaces/_contracts_.buttonactionscriptarguments.html

  // s. https://code.visualstudio.com/api/references/vscode-api
  const vscode = args.require("vscode");
  const rootPath = vscode.workspace.rootPath;
  const activeTextEditor = vscode.window.activeTextEditor;
  const { document, selection } = activeTextEditor;
  const oldText = document.getText(selection);
  const position = selection.active;
  const { line, character } = position;
  // vscode.window.showInformationMessage(
  //   JSON.stringify(position) + `选中值为：` + oldText
  // );
  const localesRootPath = "\\src\\locales\\en";
  compileSelection();
  function compileSelection() {
    const {
      anchor: { line: lineIndex, character: characterIndex },
    } = selection;
    // {"start":{"line":4,"character":23},"end":{"line":4,"character":34},"active":{"line":4,"character":34},"anchor":{"line":4,"character":23}}

    const { range, text } = document.lineAt(lineIndex);
    // document.lineAt(lineIndex)
    // {"_line":5,"_text":"import intl from \"react-intl-universal\";","_isLastLine":false}

    let start = characterIndex - 1,
      end = characterIndex;
    for (; start >= 0; start--) {
      if (/['"]/.test(text[start])) {
        break;
      }
    }
    for (; end < text.length; end++) {
      if (/['"]/.test(text[end])) {
        break;
      }
    }

    vscode.window.showInformationMessage(text.substring(start + 1, end));

    const intlKey = text.substring(start + 1, end);
    const intlKeyArr = intlKey.split(".");
    const jsonFilePath =
      intlKeyArr
        .slice(0, intlKeyArr.length - 1)
        .reduce((p, c) => p + "\\" + c, "") + ".json";
    const jsonIntlKey = intlKeyArr[intlKeyArr.length - 1];
    // vscode.window.showInformationMessage(
    //   rootPath + localesRootPath + jsonFilePath
    // );

    // vscode.window.showInformationMessage(
    //   "dd" + JSON.stringify(activeTextEditor.selection)
    // );
    //dd{"start":{"line":9,"character":33},"end":{"line":9,"character":33},"active":{"line":9,"character":33},"anchor":{"line":9,"character":33}}

    // 打开语言文件地址
    const targetFilePath = rootPath + localesRootPath + jsonFilePath;
    vscode.workspace
      .openTextDocument(vscode.Uri.file(targetFilePath))
      .then((document) =>
        vscode.window.showTextDocument(document).then((targetEditor) => {
          const { lineCount, lineAt } = targetEditor.document;

          const li = Array.from({ length: lineCount })
            .map((m, i) => i)
            .find((li) =>
              new RegExp(`['"]${jsonIntlKey}['"]`).test(lineAt(li).text)
            );

          if (li) {
            vscode.window.showTextDocument(document, {
              selection: new vscode.Range(li, 0, li, lineAt(li).text.length),
            });
          }
        })
      );
    // const targetFileJson = require(targetFilePath);
    // console.log(targetFileJson);
    // vscode.window.showTextDocument(document).then(() => {
    //   vscode.window.showInformationMessage(JSON.stringify(targetFileJson));
    // });
    // setTimeout(() => {
    //   const targetEditor = vscode.window.activeTextEditor;
    // vscode.window.showInformationMessage(
    //   JSON.stringify(targetEditor.document)
    // );
    // {"uri":{"$mid":1,"fsPath":"d:\\test\\reacti18n\\src\\App.js","_sep":1,"external":"file:///d%3A/test/reacti18n/src/App.js","path":"/D:/test/reacti18n/src/App.js","scheme":"file"},"fileName":"d:\\test\\reacti18n\\src\\App.js","isUntitled":false,"languageId":"javascript","version":96,"isClosed":false,"isDirty":false,"eol":1,"lineCount":29}
    // }, 1000);
  }

  // {"start":{"line":5,"character":37},"end":{"line":5,"character":37},"active":{"line":5,"character":37},"anchor":{"line":5,"character":37}}

  // vscode.workspace
  //   .openTextDocument(
  //     vscode.Uri.file(rootPath + localesRootPath + "\\pages\\game.json")
  //   )
  //   .then((document) => vscode.window.showTextDocument(document));

  //   const r = /^(\d+)px$/.exec(oldText);
  //   if (r !== null) {
  //     const newText = r[1] * 2 + "rpx";
  //     activeTextEditor.edit((builder) => {
  //       builder.replace(selection, newText);
  //     });
  //     vscode.window.showInformationMessage(`${oldText} => ${newText}`);
  //   } else {
  //     vscode.window.showInformationMessage(`没有选中PX值`);
  //   }
};
