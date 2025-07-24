import { Component, Input } from '@angular/core';
import { FileSystemMockService } from '../../services/file-system.mock'; // À remplacer plus tard par le vrai service
import { FileNode } from '../../models/file-node';
import { FileForm } from '../file-form/FileForm';
import { FileComponent, FileItem } from '../file/file.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [FileForm, FileComponent, CommonModule],
  templateUrl: './folder.html',
  styleUrls: ['./folder.css']
})
export class Folder {
  @Input() currentFolder!: FileNode;
  isOpen = true;

  constructor(private fileSystemService: FileSystemMockService) {} // Mock pour l'instant

  onAddItem(event: { name: string, type: 'file' | 'folder' }) {
    this.fileSystemService.addNode(
      this.currentFolder.id,
      event.name,
      event.type
    );
    // Rafraîchir le dossier courant pour afficher la mise à jour
    const updated = this.fileSystemService.getTree().children?.find(child => child.id === this.currentFolder.id);
    if (updated) {
      this.currentFolder = updated;
    }
  }

  onFileEvent(event: any) {
    if (event.type === 'delete') {
      this.fileSystemService.deleteNode(event.file.id);
    } else if (event.type === 'rename' && event.newName) {
      this.fileSystemService.renameNode(event.file.id, event.newName);
    }
    // Rafraîchir le dossier courant pour afficher la mise à jour
    const updated = this.fileSystemService.getTree().children?.find(child => child.id === this.currentFolder.id);
    if (updated) {
      this.currentFolder = updated;
    }
  }

  toFileItem(node: FileNode): FileItem {
    return {
      id: node.id,
      name: node.name,
      type: 'file',
      size: node.size ?? 0,
      extension: node.extension ?? '',
      lastModified: node.modifiedDate ?? new Date(),
      path: this.buildPath(node)
    };
  }

  private buildPath(node: FileNode): string {
    // Simple version: just use the name (améliorable pour l'arborescence réelle)
    return node.name;
  }
}