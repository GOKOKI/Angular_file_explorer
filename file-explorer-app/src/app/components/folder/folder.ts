import { Component, OnInit } from '@angular/core';
import { FileSystemMockService } from '../../services/file-system.mock'; // À remplacer plus tard par le vrai service
import { FileNode } from '../../models/file-node';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.html',
  styleUrl: './folder.css'
})
export class Folder implements OnInit {
  currentFolder!: FileNode;

  constructor(private fileSystemService: FileSystemMockService) {} // Mock pour l'instant

  ngOnInit() {
    this.currentFolder = this.fileSystemService.getTree(); // Charge les données mock
  }

  onAddItem(event: { name: string, type: 'file' | 'folder' }) {
    this.currentFolder = this.fileSystemService.addNode(
      this.currentFolder.id, 
      event.name, 
      event.type
    );
  }
}