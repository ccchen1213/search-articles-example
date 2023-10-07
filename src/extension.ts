// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import {XMLParser} from 'fast-xml-parser';

interface Article {
	label: string;
	detail: string;
	link: string;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let articles: Article[] = [];
	try{
		// 激活时调用一次
		const res = await axios.get('http://rss.cnn.com/rss/edition.rss');
		if(res && res.data){
			const parser = new XMLParser();
			articles = parser.parse(res.data)?.rss?.channel?.item.map((article: any) => {
				return { label: article.title, detail: article.description, link: article.link };
			}) || [];
			console.log("🚀 ~ file: extension.ts:12 ~ activate ~ data:",articles);
		}
		
	} catch(err){
		console.log('get rss failed: ', err);
	}
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "searcharticlesextension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('searcharticlesextension.searchCNNArticles', async () => {
		// The code you place here will be executed every time your command is executed
		try{
			// showQuickPick: label, description
			const article = await vscode.window.showQuickPick(articles, {
				matchOnDetail: true
			});

			if (!article) {return;}
			console.log("🚀 ~ file: extension.ts:41 ~ disposable ~ article:", article);

			vscode.env.openExternal(vscode.Uri.parse(article.link));
		
		} catch(err) {
			console.log('vscode get article failed: ', err);
		}
		
		vscode.window.showInformationMessage('Hello World from SearchArticlesExtension!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
