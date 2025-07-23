import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileExplorer } from './components/file-explorer/file-explorer';
import { Folder } from './components/folder/folder';
import { File } from './components/file/file';
import { FileForm } from './components/file-form/file-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileExplorer, Folder, File, FileForm],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [FileSystem]
})
export class App {
  protected title = 'file-explorer-app';
}
