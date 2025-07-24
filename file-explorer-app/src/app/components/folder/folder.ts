import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileNode, MOCK_FOLDERS } from '../../mock-folder';


@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder.html',
  styleUrls: ['./folder.css']
})
export class FolderComponent {
  @Input() node: FileNode | undefined;
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
  // Pour le dossier racine, on peut utiliser les données mock
  folders = MOCK_FOLDERS;
}