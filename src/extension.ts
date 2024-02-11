import JsonToTS from "json-to-ts";
import * as vscode from "vscode";

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "json-to-ts-converter.convertJSON",
    () => {
      const editor = vscode.window.activeTextEditor;
      const selection = editor?.selection;

      if (selection && !selection.isEmpty) {
        const selectionRange = new vscode.Range(
          selection.start.line,
          selection.start.character,
          selection.end.line,
          selection.end.character
        );
        const highlighted = editor.document.getText(selectionRange);

        if (isJsonString(highlighted)) {
          const convertedText = JsonToTS(JSON.parse(highlighted));

          editor.edit((editBuilder) => {
            editBuilder.replace(selectionRange, convertedText.join("\n\r"));
          });

          return;
        }
      }
      vscode.window.showInformationMessage("Error converting to TS");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
