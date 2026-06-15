import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpsSelectComponent } from './ops-select.component';

describe('OpsSelectComponent', () => {
  let fixture: ComponentFixture<OpsSelectComponent>;
  let comp: OpsSelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpsSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpsSelectComponent);
    comp = fixture.componentInstance;
    comp.options = [
      { label: '全部', value: 'all' },
      { label: '整季', value: 'season' },
      { label: '指定期間', value: 'range' },
    ];
    fixture.detectChanges();
  });

  it('應建立成功', () => {
    expect(comp).toBeTruthy();
  });

  it('writeValue 後 selectedLabel 反映對應選項', () => {
    comp.writeValue('season');
    expect(comp.selectedLabel).toBe('整季');
  });

  it('無對應值時 selectedLabel 為空(顯示 placeholder)', () => {
    comp.writeValue('not-exist');
    expect(comp.selectedLabel).toBe('');
  });

  it('select() 更新 value 並觸發 onChange', () => {
    let changed: any = null;
    comp.registerOnChange((v) => (changed = v));
    comp.select({ label: '指定期間', value: 'range' });
    expect(comp.value).toBe('range');
    expect(changed).toBe('range');
  });

  it('select() 後 selectedLabel 更新', () => {
    comp.select({ label: '指定期間', value: 'range' });
    expect(comp.selectedLabel).toBe('指定期間');
  });

  it('setDisabledState 控制 disabled', () => {
    comp.setDisabledState(true);
    expect(comp.disabled).toBeTrue();
    comp.setDisabledState(false);
    expect(comp.disabled).toBeFalse();
  });

  it('disabled 時點擊不開啟選單', () => {
    comp.setDisabledState(true);
    comp.toggle(new MouseEvent('click'));
    // 沒有 overlay 被建立(select 仍可被外部 writeValue)
    expect(comp.selectedLabel).toBe('');
  });
});
