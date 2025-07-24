import { Component } from '@angular/core';
import { FileSystemMockService } from '../../services/file-system.mock';
import { FileNode } from '../../models/file-node';
import { Folder } from '../folder/folder';
import { FileForm } from '../file-form/FileForm';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FolderTree } from '../folder/folder-tree';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [Folder, FileForm, FormsModule, CommonModule, FolderTree],
  templateUrl: './file-explorer.html',
  styleUrls: ['./file-explorer.css']
})
export class FileExplorer {
  rootFolder: FileNode;
  showUploads = false;
  uploadedFiles: File[] = [];
  showCreateForm = false;
  createType: 'file' | 'folder' = 'folder';

  // Navigation
  currentFolder: FileNode;
  history: FileNode[] = [];
  historyIndex = -1;
  currentPath = 'Ce PC';
  searchTerm = '';

  sortColumn: 'name' | 'type' | 'size' | 'date' = 'name';
  sortAsc = true;

  contextMenu = { visible: false, x: 0, y: 0, target: null as FileNode | null };
  clipboard: { items: FileNode[]; cut: boolean } | null = null;
  renamingId: string | null = null;
  newName: string = '';
  selectedIds: string[] = [];
  favorites: string[] = [];
  activeIndex: number = -1;

  isSelected(id: string) {
    return this.selectedIds.includes(id);
  }

  toggleSelect(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedIds.includes(id)) this.selectedIds.push(id);
    } else {
      this.selectedIds = this.selectedIds.filter(sel => sel !== id);
    }
  }

  allSelected() {
    const items = this.sortedChildren();
    return items.length > 0 && items.every(item => this.selectedIds.includes(item.id));
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const items = this.sortedChildren();
    if (checked) {
      this.selectedIds = Array.from(new Set([...this.selectedIds, ...items.map(i => i.id)]));
    } else {
      this.selectedIds = this.selectedIds.filter(id => !items.some(i => i.id === id));
    }
  }

  deleteSelected() {
    for (const id of this.selectedIds) {
      const item = this.currentFolder.children?.find(i => i.id === id);
      if (item) this.deleteItem(item);
    }
    this.selectedIds = [];
  }

  copySelected() {
    const items = this.currentFolder.children?.filter(i => this.selectedIds.includes(i.id)) || [];
    this.clipboard = { items: items.map(i => ({ ...i, children: i.children ? [...i.children] : undefined })), cut: false };
  }

  cutSelected() {
    const items = this.currentFolder.children?.filter(i => this.selectedIds.includes(i.id)) || [];
    this.clipboard = { items: items.map(i => ({ ...i, children: i.children ? [...i.children] : undefined })), cut: true };
  }

  constructor(private fileSystem: FileSystemMockService) {
    this.rootFolder = this.fileSystem.getTree();
    this.currentFolder = this.rootFolder;
    this.pushHistory(this.currentFolder);
  }

  // Navigation
  goBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentFolder = this.history[this.historyIndex];
      this.updatePath();
    }
  }
  goForward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.currentFolder = this.history[this.historyIndex];
      this.updatePath();
    }
  }
  goUp() {
    if (this.currentFolder.parentId) {
      const parent = this.findNodeById(this.rootFolder, this.currentFolder.parentId);
      if (parent) {
        this.currentFolder = parent;
        this.pushHistory(this.currentFolder);
        this.updatePath();
      }
    }
  }
  pushHistory(folder: FileNode) {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(folder);
    this.historyIndex = this.history.length - 1;
  }
  updatePath() {
    const path: string[] = [];
    let node: FileNode | undefined = this.currentFolder;
    while (node) {
      path.unshift(node.name);
      node = node.parentId ? this.findNodeById(this.rootFolder, node.parentId) : undefined;
    }
    this.currentPath = path.join(' > ');
  }
  findNodeById(node: FileNode, id: string): FileNode | undefined {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeById(child, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  // Recherche
  onSearch() {
    // À compléter : filtrer l'affichage selon searchTerm
  }

  toggleShowUploads() {
    this.showUploads = !this.showUploads;
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.uploadedFiles.push(input.files[i]);
      }
    }
  }

  downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  removeFile(file: File) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }

  onNewFolder() {
    this.createType = 'folder';
    this.showCreateForm = true;
  }

  onNewFile() {
    this.createType = 'file';
    this.showCreateForm = true;
  }

  onCreateItem(event: { name: string, type: 'file' | 'folder' }) {
    this.fileSystem.addNode(
      this.rootFolder.id,
      event.name,
      event.type
    );
    this.rootFolder = this.fileSystem.getTree();
    this.showCreateForm = false;
  }

  onCancelCreate() {
    this.showCreateForm = false;
  }

  sortedChildren() {
    if (!this.currentFolder.children) return [];
    let arr = [...this.currentFolder.children];
    // Filtrage recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      arr = arr.filter(item =>
        item.name.toLowerCase().includes(term) ||
        (item.type === 'file' && item.extension && item.extension.toLowerCase().includes(term)) ||
        item.type.toLowerCase().includes(term)
      );
    }
    return arr.sort((a, b) => {
      let v1: any, v2: any;
      switch (this.sortColumn) {
        case 'name': v1 = a.name.toLowerCase(); v2 = b.name.toLowerCase(); break;
        case 'type': v1 = a.type; v2 = b.type; break;
        case 'size': v1 = a.size || 0; v2 = b.size || 0; break;
        case 'date': v1 = a.modifiedDate ? new Date(a.modifiedDate).getTime() : 0; v2 = b.modifiedDate ? new Date(b.modifiedDate).getTime() : 0; break;
        default: v1 = a.name; v2 = b.name;
      }
      if (v1 < v2) return this.sortAsc ? -1 : 1;
      if (v1 > v2) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  sortBy(col: 'name' | 'type' | 'size' | 'date') {
    if (this.sortColumn === col) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = col;
      this.sortAsc = true;
    }
  }

  openFolder(folder: FileNode) {
    this.currentFolder = folder;
    this.pushHistory(folder);
    this.updatePath();
    this.selectedIds = [];
    this.activeIndex = -1;
  }

  downloadFileItem(file: FileNode) {
    // Simulé : télécharge un fichier vide avec le nom
    const blob = new Blob([''], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name + (file.extension ? '.' + file.extension : '');
    a.click();
    URL.revokeObjectURL(url);
  }

  deleteItem(item: FileNode) {
    if (item.type === 'file') {
      this.fileSystem.deleteNode(item.id);
    } else if (item.type === 'folder') {
      this.fileSystem.deleteNode(item.id);
    }
    // Rafraîchir le dossier courant
    const updated = this.findNodeById(this.rootFolder, this.currentFolder.id);
    if (updated) {
      this.currentFolder = updated;
    }
  }

  onContextMenu(event: MouseEvent, item: FileNode) {
    event.preventDefault();
    this.contextMenu.visible = true;
    this.contextMenu.x = event.clientX;
    this.contextMenu.y = event.clientY;
    this.contextMenu.target = item;
    document.addEventListener('keydown', this._contextMenuEscListener);
  }

  closeContextMenu() {
    this.contextMenu.visible = false;
    this.contextMenu.target = null;
    document.removeEventListener('keydown', this._contextMenuEscListener);
  }

  private _contextMenuEscListener = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeContextMenu();
  };

  startRename(item: FileNode) {
    this.renamingId = item.id;
    this.newName = item.name;
    setTimeout(() => {
      const input = document.getElementById('rename-input-' + item.id) as HTMLInputElement;
      if (input) { input.focus(); input.select(); }
    }, 50);
  }

  confirmRename(item: FileNode) {
    if (this.newName.trim() && this.newName !== item.name) {
      this.fileSystem.renameNode(item.id, this.newName.trim());
      // Rafraîchir le dossier courant
      const updated = this.findNodeById(this.rootFolder, this.currentFolder.id);
      if (updated) {
        this.currentFolder = updated;
      }
    }
    this.renamingId = null;
    this.newName = '';
  }

  cancelRename() {
    this.renamingId = null;
    this.newName = '';
  }

  isFavorite(id: string) {
    return this.favorites.includes(id);
  }

  toggleFavorite(folder: FileNode) {
    if (this.isFavorite(folder.id)) {
      this.favorites = this.favorites.filter(fav => fav !== folder.id);
    } else {
      this.favorites.push(folder.id);
    }
  }

  goToFavorite(id: string) {
    const folder = this.findNodeById(this.rootFolder, id);
    if (folder) {
      this.openFolder(folder);
    }
  }

  onContextAction(action: string) {
    const item = this.contextMenu.target;
    if (!item) return;
    this.closeContextMenu();
    switch (action) {
      case 'rename':
        this.startRename(item);
        break;
      case 'delete':
        this.deleteItem(item);
        break;
      case 'copy':
        this.clipboard = { items: [item], cut: false };
        break;
      case 'cut':
        this.clipboard = { items: [item], cut: true };
        break;
      case 'paste':
        this.pasteClipboard();
        break;
      case 'favorite':
        this.toggleFavorite(item);
        break;
    }
  }

  pasteClipboard() {
    if (!this.clipboard) return;
    for (const item of this.clipboard.items) {
      // Gestion du conflit de nom
      let name = item.name;
      let suffix = 1;
      while (this.currentFolder.children?.some(child => child.name === name && child.type === item.type)) {
        name = item.name + ' - copie' + (suffix > 1 ? ' ' + suffix : '');
        suffix++;
      }
      const newItem: FileNode = {
        ...item,
        id: Math.random().toString(36).substring(2),
        name,
        parentId: this.currentFolder.id,
        children: item.children ? [...item.children] : undefined
      };
      this.currentFolder.children?.push(newItem);
    }
    // Si c'était un couper, on retire les originaux
    if (this.clipboard.cut) {
      for (const item of this.clipboard.items) {
        this.fileSystem.deleteNode(item.id);
      }
    }
    // Rafraîchir le dossier courant
    const updated = this.findNodeById(this.rootFolder, this.currentFolder.id);
    if (updated) {
      this.currentFolder = updated;
    }
    this.clipboard = null;
    this.selectedIds = [];
  }

  onTableKeydown(event: KeyboardEvent) {
    const items = this.sortedChildren();
    if (!items.length) return;
    if (this.activeIndex === -1) this.activeIndex = 0;
    switch (event.key) {
      case 'ArrowDown':
        this.activeIndex = Math.min(this.activeIndex + 1, items.length - 1);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        event.preventDefault();
        break;
      case 'Enter':
        const item = items[this.activeIndex];
        if (item.type === 'folder') this.openFolder(item);
        // Pour un fichier, on pourrait ouvrir un aperçu ou lancer le téléchargement
        event.preventDefault();
        break;
      case ' ': // Espace
        const id = items[this.activeIndex].id;
        if (this.isSelected(id)) {
          this.selectedIds = this.selectedIds.filter(sel => sel !== id);
        } else {
          this.selectedIds.push(id);
        }
        event.preventDefault();
        break;
      case 'Escape':
        this.selectedIds = [];
        this.activeIndex = -1;
        event.preventDefault();
        break;
    }
  }

  setActiveIndex(idx: number) {
    this.activeIndex = idx;
  }
}
