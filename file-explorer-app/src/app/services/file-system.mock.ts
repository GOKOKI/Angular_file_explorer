import { Injectable } from '@angular/core';
import { FileNode } from '../models/file-node';

@Injectable({
  providedIn: 'root'
})
export class FileSystemMockService {
  private mockTree: FileNode = {
    id: 'root',
    name: 'Root',
    type: 'folder',
    children: []
  };

  addNode(parentId: string, name: string, type: 'file' | 'folder') {
    console.log(`[Mock] Ajout de ${name} (${type}) au parent ${parentId}`);
    // Simulation : ajoute au dossier racine pour tester
    if (parentId === 'root') {
      this.mockTree.children?.push({
        id: Math.random().toString(36).substring(2),
        name,
        type,
        children: type === 'folder' ? [] : undefined
      });
    }
    return this.mockTree;
  }

  getTree() {
    return this.mockTree;
  }
}