import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent {
  @Input() data: { label: string; value: any }[] = [];
  @Input() placeholder = 'Select...';
  @Output() selectionChange = new EventEmitter<{ label: string; value: any }>();

  @ViewChild('dropdownTrigger') trigger!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: TemplateRef<any>;

  overlayRef!: OverlayRef;
  selected?: { label: string; value: any };

  constructor(
    private overlay: Overlay,
    private vcr: ViewContainerRef
  ) {}

  toggle() {
    this.overlayRef ? this.close() : this.open();
  }

open() {
  const position = this.overlay
    .position()
    .flexibleConnectedTo(this.trigger)
    .withPositions([
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
    ]);

  const triggerWidth = this.trigger.nativeElement.offsetWidth;

  this.overlayRef = this.overlay.create({
    width: triggerWidth,     // 👈 設定 panel 和 trigger 等寬
    // 或改成 minWidth: triggerWidth,
    positionStrategy: position,
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-transparent-backdrop',
    scrollStrategy: this.overlay.scrollStrategies.reposition(),
  });

  const portal = new TemplatePortal(this.dropdownMenu, this.vcr);
  this.overlayRef.attach(portal);

  this.overlayRef.backdropClick().subscribe(() => this.close());
}


  close() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined!;
  }

  select(item: { label: string; value: any }) {
    this.selected = item;                // 👈 更新畫面
    this.selectionChange.emit(item);     // 👈 回傳選擇
    this.close();
  }
}
