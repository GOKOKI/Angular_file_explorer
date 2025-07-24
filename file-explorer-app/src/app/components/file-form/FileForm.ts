import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileNode } from '../../models/file-node';

@Component({
  selector: 'app-file-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-form.html',
  styleUrls: ['./file-form.scss']
})
export class FileForm {
  @Input() isEditMode: boolean = false;
  @Input() currentNode: FileNode | null = null;
  @Output() formSubmitted = new EventEmitter<{ name: string, type: 'file' | 'folder' }>();

  itemName: string = '';
  itemType: 'file' | 'folder' = 'file';

  onSubmit() {
    if (this.itemName.trim()) {
      this.formSubmitted.emit({
        name: this.itemName,
        type: this.itemType
      });
      this.itemName = '';
    }
  }
}