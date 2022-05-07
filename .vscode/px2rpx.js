exports.execute = async (args) => {
  // args => https://egodigital.github.io/vscode-powertools/api/interfaces/_contracts_.buttonactionscriptarguments.html

  // s. https://code.visualstudio.com/api/references/vscode-api
  const vscode = args.require("vscode");
  const activeTextEditor = vscode.window.activeTextEditor;
  const selection = activeTextEditor.selection;
  const oldText = activeTextEditor.document.getText(selection);
  const rootPath = vscode.workspace.rootPath;
  const position = activeTextEditor.selection.active;
  vscode.window.showInformationMessage(
    JSON.stringify(position) + `选中值为：` + oldText
  );
  vscode.workspace
    .openTextDocument(
      vscode.Uri.file(rootPath + "\\src\\locales\\en\\pages\\game.json")
    )
    .then((document) => vscode.window.showTextDocument(document));
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
