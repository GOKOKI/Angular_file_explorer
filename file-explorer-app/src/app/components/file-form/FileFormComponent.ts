import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FileNode } from '../../models/file-node';

@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent {
  @Input() isEditMode: boolean = false;
  @Input() currentNode: FileNode | null = null; // Pour l'édition
  @Output() formSubmitted = new EventEmitter<{ name: string, type: 'file' | 'folder' }>();

  itemName: string = '';
  itemType: 'file' | 'folder' = 'file';

  onSubmit() {
    if (this.itemName.trim()) {
      this.formSubmitted.emit({
        name: this.itemName,
        type: this.itemType
      });
      this.itemName = ''; // Réinitialise le champ
    }
  }
}