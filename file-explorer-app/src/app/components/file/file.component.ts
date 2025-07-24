import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface FileItem {
  id: string;
  name: string;
  type: 'file';
  size: number;
  extension: string;
  lastModified: Date;
  path: string;
}

export interface FileEvent {
  type: 'delete' | 'rename' | 'select';
  file: FileItem;
  newName?: string;
}

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file',
  standalone: true, // ✅ important !
  imports: [CommonModule, FormsModule], // ✅ pour *ngIf, [(ngModel)], etc.
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})

export class FileComponent {
  @Input() file!: FileItem;
  @Input() isSelected: boolean = false;
  @Input() isRenaming: boolean = false;
  
  @Output() fileEvent = new EventEmitter<FileEvent>();

  newFileName: string = '';
  showContextMenu: boolean = false;

  ngOnInit() {
    this.newFileName = this.file.name;
  }

  onFileClick() {
    this.fileEvent.emit({
      type: 'select',
      file: this.file
    });
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.showContextMenu = true;
  }

  onDeleteFile() {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${this.file.name}" ?`)) {
      this.fileEvent.emit({
        type: 'delete',
        file: this.file
      });
    }
    this.showContextMenu = false;
  }

  onRenameFile() {
    this.isRenaming = true;
    this.newFileName = this.file.name;
    this.showContextMenu = false;
    
    // Focus sur l'input après un petit délai pour s'assurer qu'il est rendu
    setTimeout(() => {
      const input = document.querySelector('.rename-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  onConfirmRename() {
    if (this.newFileName.trim() && this.newFileName !== this.file.name) {
      this.fileEvent.emit({
        type: 'rename',
        file: this.file,
        newName: this.newFileName.trim()
      });
    }
    this.isRenaming = false;
  }

  onCancelRename() {
    this.isRenaming = false;
    this.newFileName = this.file.name;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onConfirmRename();
    } else if (event.key === 'Escape') {
      this.onCancelRename();
    }
  }

  getFileIcon(): string {
    const extension = this.file.extension.toLowerCase();
    const iconMap: { [key: string]: string } = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'txt': '📄',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'mp4': '🎥',
      'avi': '🎥',
      'mp3': '🎵',
      'wav': '🎵',
      'zip': '📦',
      'rar': '📦',
      'js': '💻',
      'ts': '💻',
      'html': '🌐',
      'css': '🎨',
      'json': '⚙️',
      'xml': '⚙️'
    };
    
    return iconMap[extension] || '📄';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Fermer le menu contextuel si on clique ailleurs
  onDocumentClick() {
    this.showContextMenu = false;
  }
}