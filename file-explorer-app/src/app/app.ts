import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileExplorer } from './components/file-explorer/file-explorer';
import { Folder } from './components/folder/folder';

import { FileComponent } from './components/file/file.component';
import { FileForm } from './components/file-form/FileForm';
import { FileSystem } from './services/file-system';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileExplorer, Folder, FileComponent, FileForm,],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [FileSystem],
})
export class AppComponent {
  protected title = 'file-explorer-app';
}
