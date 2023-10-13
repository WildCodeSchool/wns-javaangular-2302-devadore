import {Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
    @Input() message: string = '';
    @Input() type: 'confirm' | 'success' | 'error' | 'warning' = 'confirm';
    @Output() onConfirm = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();
    @Input() canShowButton: boolean = true;

    confirm() {
        this.onConfirm.emit();
    }

    cancel() {
        this.onCancel.emit();
    }

    closeToast() {
        this.close.emit();
    }
}

