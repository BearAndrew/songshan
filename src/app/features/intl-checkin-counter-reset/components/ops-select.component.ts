import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Option } from '../../../shared/components/dropdown/dropdown.component';

/**
 * ops 風格通用下拉:用 CDK overlay 呈現選單(取代原生 <select>)。
 * - 支援高度上限 + 滾動
 * - 實作 ControlValueAccessor,可直接搭配 [(ngModel)] / formControl
 */
@Component({
  selector: 'app-ops-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ops-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OpsSelectComponent),
      multi: true,
    },
  ],
})
export class OpsSelectComponent implements ControlValueAccessor, OnDestroy {
  @Input() options: Option[] = [];
  @Input() placeholder = '請選擇…';
  @Input() disabled = false;
  /** 觸發器最小寬度(px) */
  @Input() minWidth = 120;
  /** 選單最大高度(px),超過則滾動 */
  @Input() maxHeight = 280;
  /** 是否填滿容器寬度(表單欄位用) */
  @Input() block = false;

  @HostBinding('class.is-block') get isBlock(): boolean {
    return this.block;
  }

  @ViewChild('trigger', { static: true }) trigger!: ElementRef<HTMLElement>;
  @ViewChild('menu', { static: true }) menu!: TemplateRef<unknown>;

  value: any = '';
  private overlayRef: OverlayRef | null = null;

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private overlay: Overlay,
    private vcr: ViewContainerRef,
  ) {}

  get selectedLabel(): string {
    const opt = this.options.find((o) => o.value === this.value);
    return opt ? opt.label : '';
  }

  // ---- ControlValueAccessor ----
  writeValue(v: any): void {
    this.value = v;
  }
  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ---- overlay ----
  toggle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.overlayRef ? this.close() : this.open();
  }

  private open(): void {
    const position = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      width: this.trigger.nativeElement.offsetWidth,
      positionStrategy: position,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef.attach(new TemplatePortal(this.menu, this.vcr));
    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.onTouched();
  }

  select(opt: Option): void {
    this.value = opt.value;
    this.onChange(opt.value);
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.close();
  }

  ngOnDestroy(): void {
    this.close();
  }
}
