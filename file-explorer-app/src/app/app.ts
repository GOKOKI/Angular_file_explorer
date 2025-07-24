import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileExplorer } from './components/file-explorer/file-explorer';
import { FolderComponent } from './components/folder/folder';
import { FileComponent } from './components/file/file.component';
import { FileForm } from './components/file-form/file-form';
import { FileSystem } from './services/file-system';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileExplorer, FolderComponent, FileComponent, FileForm],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [FileSystem]
})
export class AppComponent {
  protected title = 'file-explorer-app';
}