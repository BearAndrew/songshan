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
import { CommonService } from '../../../core/services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  imports: [CommonModule],
})
export class DropdownComponent {
  @Input() options: { label: string; value: any }[] = [];
  @Input() value: any;
  @Input() placeholder = ' ';
  @Input() showIcon: boolean = false;
  @Output() selectionChange = new EventEmitter<{ label: string; value: any }>();

  @ViewChild('dropdownTrigger') trigger!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: TemplateRef<any>;

  overlayRef!: OverlayRef;
  selectedLabel: string = '';

  constructor(private overlay: Overlay, private vcr: ViewContainerRef, private commonService: CommonService) {}

  ngOnInit(): void {
    this.selectedLabel = this.options.find(item => item.value == this.value)?.label || '';
  }

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
      width: triggerWidth,
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
    this.value = item.value;
    this.selectedLabel = item.label;
    this.selectionChange.emit(item);
    this.commonService.setSelectedAirport(item.value);
    this.close();
  }
}
